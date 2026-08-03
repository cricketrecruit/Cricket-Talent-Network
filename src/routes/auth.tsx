import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { assignRole } from "@/lib/admin.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Link, useNavigate } from "@tanstack/react-router";
import { resolveRolePathForUser } from "@/lib/role-redirect";
import { PlayerSignupWizard } from "@/components/player-signup/PlayerSignupWizard";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { tab?: "player" | "recruiter" } => ({
    tab: search.tab === "player" || search.tab === "recruiter" ? search.tab : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign In · Cricket Recruit" },
      { name: "robots", content: "noindex" },
    ],
  }),
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      const dest = await resolveRolePathForUser(data.user.id);
      throw redirect({ to: dest });
    }
  },
  component: AuthPage,
});

type Tab = "signin" | "player" | "recruiter" | "forgot";

function AuthPage() {
  const { tab: initialTab } = Route.useSearch();
  const [tab, setTab] = useState<Tab>(initialTab ?? "signin");
  const copy = {
    signin: {
      eyebrow: "Welcome back",
      title: "Step back onto the pitch.",
      sub: "Sign in to continue building your profile, browse players, or manage the network.",
    },
    player: {
      eyebrow: "Player registration",
      title: "Get scouted. Get signed.",
      sub: "Create your athlete profile — stats, footage, and story — and put yourself in front of the scouts who matter.",
    },
    recruiter: {
      eyebrow: "Recruiter access",
      title: "Discover the next generation.",
      sub: "Build a shortlist from a verified network of emerging cricketers across academies, franchises, and clubs.",
    },
    forgot: {
      eyebrow: "Forgot password",
      title: "Reset your password.",
      sub: "Enter your account email and we'll send you a secure link to set a new password.",
    },
  }[tab];

  return (
    <main className="min-h-screen bg-ink-black text-white relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-cricket-red/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-32 w-[520px] h-[520px] rounded-full bg-field-green/15 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="relative z-10 grid lg:grid-cols-[1.05fr_1fr] lg:items-stretch">

        {/* Left — editorial panel */}
        <aside className="hidden lg:flex lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden border-r border-white/10 relative">
          <div className="flex flex-col h-full w-full p-10 xl:p-14">
            <div className="shrink-0">
              <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.3em] text-white/50">
                <span className="h-px w-8 bg-cricket-red" />
                {copy.eyebrow}
              </div>

              <div className="space-y-8 max-w-xl mt-8">
                <h1 className="font-display uppercase text-5xl xl:text-6xl leading-[0.95] tracking-tight">
                  {copy.title.split(" ").slice(0, -2).join(" ")}{" "}
                  <span className="italic text-cricket-red">
                    {copy.title.split(" ").slice(-2).join(" ")}
                  </span>
                </h1>
                <p className="text-white/70 text-lg leading-relaxed max-w-md">{copy.sub}</p>

                <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/10">
                  {[
                    ["2.4k+", "Players scouted"],
                    ["180+", "Recruiter orgs"],
                    ["27", "Countries"],
                  ].map(([n, l]) => (
                    <div key={l}>
                      <div className="font-display text-3xl text-white">{n}</div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-white/50 mt-1">
                        {l}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <blockquote className="mt-auto shrink-0 max-w-md border-l-2 border-cricket-red pl-5 pt-10">
              <p className="text-sm text-white/75 italic leading-relaxed">
                "Signed my first franchise contract eight weeks after uploading footage here. The
                network is real."
              </p>
              <footer className="text-[10px] font-mono uppercase tracking-widest text-white/50 mt-3">
                — A. Sharma · U-19 all-rounder
              </footer>
            </blockquote>
          </div>
        </aside>

        {/* Right — form panel */}
        <section className="flex lg:items-start justify-center p-6 sm:p-10 lg:p-12 lg:min-h-screen lg:overflow-y-auto">
          <div className={`w-full ${tab === "player" || tab === "recruiter" ? "max-w-2xl" : "max-w-md"}`}>
            {/* Segmented control */}
            <div className="relative mb-8 p-1 bg-white/5 border border-white/10 rounded-full grid grid-cols-3 text-[11px] font-mono uppercase tracking-widest">
              <div
                className={`absolute top-1 bottom-1 w-[calc(33.333%-4px)] rounded-full bg-cricket-red transition-transform duration-300 ease-out ${
                  tab === "forgot" ? "opacity-0" : "opacity-100"
                }`}
                style={{
                  transform: `translateX(${
                    tab === "player" ? "calc(100% + 4px)" : tab === "recruiter" ? "calc(200% + 4px)" : "4px"
                  })`,
                }}
              />
              {(["signin", "player", "recruiter"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative z-10 py-2.5 rounded-full transition-colors ${
                    tab === t ? "text-white" : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {t === "signin" ? "Sign In" : t === "player" ? "Player" : "Recruiter"}
                </button>
              ))}
            </div>

            <div className="lg:hidden mb-6">
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-cricket-red mb-2">
                {copy.eyebrow}
              </div>
              <h1 className="font-display uppercase text-3xl leading-tight">{copy.title}</h1>
            </div>

            <div className={`rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)] ${tab === "player" ? "min-h-[28rem]" : ""}`}>
              {tab === "signin" && <SignInForm onForgotPassword={() => setTab("forgot")} />}
              {tab === "player" && <PlayerSignupWizard />}
              {tab === "recruiter" && <RecruiterSignUp />}
              {tab === "forgot" && <ForgotPasswordForm />}
            </div>

            <p className="text-center text-[11px] font-mono uppercase tracking-widest text-white/40 mt-6">
              {tab === "signin" ? (
                <>
                  New here?{" "}
                  <button onClick={() => setTab("player")} className="text-white/80 hover:text-cricket-red">
                    Create an account
                  </button>
                </>
              ) : tab === "forgot" ? (
                <>
                  Remembered it?{" "}
                  <button onClick={() => setTab("signin")} className="text-white/80 hover:text-cricket-red">
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Already registered?{" "}
                  <button onClick={() => setTab("signin")} className="text-white/80 hover:text-cricket-red">
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function SignInForm({ onForgotPassword }: { onForgotPassword: () => void }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setLoading(true);
        try {
          const { data: signInData, error } = await supabase.auth.signInWithPassword({
            email: String(fd.get("email")),
            password: String(fd.get("password")),
          });
          if (error) return toast.error(error.message);
          const uid = signInData.user?.id;
          const dest = uid ? await resolveRolePathForUser(uid) : "/auth";
          toast.success("Signed in");
          navigate({ to: dest, replace: true });
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Something went wrong signing in. Please try again.");
        } finally {
          setLoading(false);
        }
      }}
      className="space-y-4"
    >
      <Field name="email" label="Email" type="email" required />
      <Field name="password" label="Password" type="password" required />
      <div className="text-right -mt-2">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-[11px] font-mono uppercase tracking-widest text-white/50 hover:text-cricket-red"
        >
          Forgot password?
        </button>
      </div>
      <button disabled={loading} className="cta-press skew-tag w-full bg-cricket-red text-white py-3 font-display uppercase italic tracking-widest">
        <span>{loading ? "Signing in..." : "Sign In"}</span>
      </button>
    </form>
  );
}

function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="space-y-4 text-sm text-white/70">
        <p>If an account exists for that email, a reset link is on its way. Check your inbox.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(String(fd.get("email")), {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        setLoading(false);
        if (error) return toast.error(error.message);
        setSent(true);
      }}
      className="space-y-4"
    >
      <Field name="email" label="Email" type="email" required />
      <button disabled={loading} className="cta-press skew-tag w-full bg-cricket-red text-white py-3 font-display uppercase italic tracking-widest">
        <span>{loading ? "Sending..." : "Send Reset Link"}</span>
      </button>
    </form>
  );
}

const recruiterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  full_name: z.string().min(1),
  organization_name: z.string().min(1),
  role_title: z.string().min(1),
  organization_type: z.string().min(1),
  country: z.string().min(1),
  city: z.string().min(1),
  website: z.string().optional(),
  phone: z.string().optional(),
  reason_for_access: z.string().min(1),
});

function RecruiterSignUp() {
  const navigate = useNavigate();
  const assign = useServerFn(assignRole);
  const [loading, setLoading] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const parsed = recruiterSchema.safeParse(Object.fromEntries(fd.entries()));
        if (!parsed.success) return toast.error(parsed.error.issues[0].message);
        setLoading(true);
        try {
          const v = parsed.data;
          const { data, error } = await supabase.auth.signUp({
            email: v.email,
            password: v.password,
            options: { emailRedirectTo: `${window.location.origin}/auth`, data: { full_name: v.full_name } },
          });
          if (error || !data.user) return toast.error(error?.message ?? "Signup failed");
          if (!data.session) return toast.error("Please check your email to confirm your account before signing in.");
          await assign({ data: { userId: data.user.id, role: "recruiter" } });
          const { error: rErr } = await supabase.from("recruiter_profiles").insert({
            user_id: data.user.id,
            organization_name: v.organization_name,
            role_title: v.role_title,
            organization_type: v.organization_type,
            country: v.country,
            city: v.city,
            website: v.website || null,
            phone: v.phone || null,
            reason_for_access: v.reason_for_access,
          });
          if (rErr) return toast.error(rErr.message);
          toast.success("Account created — pending admin approval");
          navigate({ to: "/recruiter", replace: true });
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Something went wrong creating your account. Please try again.");
        } finally {
          setLoading(false);
        }
      }}
      className="space-y-8"
    >
      <FormSection title="Account">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field name="email" label="Account Email" type="email" required />
          <Field name="password" label="Password (min 8)" type="password" required />
        </div>
      </FormSection>

      <FormSection title="Organization">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field name="full_name" label="Full Name" required />
          <Field name="organization_name" label="Organization / Team Name" required />
          <Field name="role_title" label="Role / Title" required />
          <SelectField name="organization_type" label="Organization Type" required options={[
            ["Franchise", "Franchise"],
            ["Academy", "Academy"],
            ["Team", "Team"],
            ["Sponsor", "Sponsor"],
            ["Scout", "Independent Scout"],
          ]} />
        </div>
      </FormSection>

      <FormSection title="Location">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field name="country" label="Country" required />
          <Field name="city" label="City" required />
          <Field name="website" label="Website (optional)" />
          <Field name="phone" label="Phone (optional)" />
        </div>
      </FormSection>

      <FormSection title="Access Request">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-widest text-white/60 mb-2 font-bold">
            Reason for Access<span className="text-cricket-red ml-1">*</span>
          </label>
          <textarea name="reason_for_access" required rows={4}
            className="w-full bg-white/5 border border-white/20 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-cricket-red" />
        </div>
        <p className="text-xs text-white/60 mt-4">Recruiter accounts require admin approval before you can browse players.</p>
      </FormSection>

      <button disabled={loading} className="cta-press skew-tag w-full bg-cricket-red text-white py-3 font-display uppercase italic tracking-widest">
        <span>{loading ? "Creating..." : "Create Recruiter Account"}</span>
      </button>
    </form>
  );
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-cricket-red">{title}</div>
      {children}
    </section>
  );
}

function Field({ name, label, type = "text", required }: { name: string; label: string; type?: string; required?: boolean }) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label className="block text-[10px] font-mono uppercase tracking-widest text-white/60 mb-2 font-bold">
        {label}{required && <span className="text-cricket-red ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          name={name}
          type={isPassword && visible ? "text" : type}
          required={required}
          className={`w-full bg-white/5 border border-white/20 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-cricket-red ${isPassword ? "pr-10" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-white/50 hover:text-white"
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

function SelectField({ name, label, options, required }: { name: string; label: string; options: [string, string][]; required?: boolean }) {
  return (
    <div>
      <label className="block text-[10px] font-mono uppercase tracking-widest text-white/60 mb-2 font-bold">
        {label}{required && <span className="text-cricket-red ml-1">*</span>}
      </label>
      <select name={name} required={required} defaultValue=""
        className="w-full bg-white/5 border border-white/20 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-cricket-red">
        <option value="" disabled className="bg-ink-black">Select...</option>
        {options.map(([v, l]) => <option key={v} value={v} className="bg-ink-black">{l}</option>)}
      </select>
    </div>
  );
}

function FileField({ name, label, accept, required }: { name: string; label: string; accept?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-[10px] font-mono uppercase tracking-widest text-white/60 mb-2 font-bold">
        {label}{required && <span className="text-cricket-red ml-1">*</span>}
      </label>
      <input name={name} type="file" accept={accept} required={required}
        className="w-full bg-white/5 border border-white/20 text-white text-sm file:mr-3 file:py-2.5 file:px-3 file:border-0 file:bg-cricket-red file:text-white file:text-xs file:uppercase file:tracking-widest file:font-display file:italic focus:outline-none focus:border-cricket-red" />
    </div>
  );
}
