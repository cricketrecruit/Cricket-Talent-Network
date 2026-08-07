import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const idSchema = z.object({ userId: z.string().uuid() });
const approvalSchema = z.object({
  userId: z.string().uuid(),
  status: z.enum(["approved", "rejected"]),
});

export const deleteUserAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => idSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error || !isAdmin) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (delErr) throw new Error(delErr.message);
    return { ok: true };
  });

export const reviewRecruiter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => approvalSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { error } = await context.supabase
      .from("recruiter_profiles")
      .update({
        status: data.status,
        reviewed_by: context.userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("user_id", data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const createAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1),
});

export const createAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => createAdminSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.fullName },
    });
    if (error || !created.user) throw new Error(error?.message ?? "Failed to create admin user");
    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: created.user.id, role: "admin" });
    if (roleErr) throw new Error(roleErr.message);
    return { ok: true };
  });

const notifyNewPlayerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  country: z.string(),
});

export const notifyAdminsOfNewPlayer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => notifyNewPlayerSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: adminRoles } = await supabaseAdmin.from("user_roles").select("user_id").eq("role", "admin");
    const adminIds = (adminRoles ?? []).map((r) => r.user_id);
    if (adminIds.length === 0) return { ok: true, sent: 0 };

    const { data: optedInAdmins } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .in("id", adminIds)
      .eq("notify_on_new_player", true);

    const recipients = (optedInAdmins ?? [])
      .map((a) => a.email)
      .filter((email): email is string => !!email);

    if (recipients.length === 0) return { ok: true, sent: 0 };

    const { sendEmail } = await import("@/integrations/resend/client.server");
    await sendEmail({
      to: recipients,
      subject: "New player joined Cricket Recruit",
      html: `
        <p>A new player just signed up on Cricket Recruit:</p>
        <ul>
          <li><strong>Name:</strong> ${data.firstName} ${data.lastName}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>Country:</strong> ${data.country}</li>
        </ul>
      `,
    });
    return { ok: true, sent: recipients.length };
  });

export const assignRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({
      userId: z.string().uuid(),
      role: z.enum(["admin", "recruiter", "player"]),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    // Only the user themselves (during signup) or an admin can add a role.
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin && context.userId !== data.userId) throw new Error("Forbidden");
    // Players/recruiters can only self-assign player/recruiter, never admin.
    if (!isAdmin && data.role === "admin") throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: data.userId, role: data.role });
    if (error && !error.message.includes("duplicate")) throw new Error(error.message);
    return { ok: true };
  });
