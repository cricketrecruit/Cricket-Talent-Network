import { supabase } from "@/integrations/supabase/client";

export type RoleDest = "/admin" | "/recruiter" | "/player" | "/auth";

export async function resolveRolePathForUser(userId: string): Promise<RoleDest> {
  const { data: roles, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) throw error;
  const roleSet = new Set((roles ?? []).map((r) => r.role));
  if (roleSet.has("admin")) return "/admin";
  if (roleSet.has("recruiter")) return "/recruiter";
  if (roleSet.has("player")) return "/player";
  return "/auth";
}
