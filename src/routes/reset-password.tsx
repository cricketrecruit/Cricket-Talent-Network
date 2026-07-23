import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { resolveRolePathForUser } from "@/lib/role-redirect";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password · Cricket Recruit" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <main className="min-h-screen bg-ink-black text-white relative overflow-hidden flex items-center justify-center p-6">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-cricket-red/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-32 w-[520px] h-[520px] rounded-full bg-field-green/15 blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
        <div className="font-mono text-[10px] text-cricket-red uppercase tracking-[0.3em] mb-3 font-bold">
          Set new password
        </div>
        <h1 className="font-display uppercase text-3xl leading-tight mb-6">Choose a new password.</h1>

        {failed ? (
          <div className="space-y-4 text-sm text-white/70">
            <p>That reset link is invalid or has expired.</p>
            <Link to="/auth" className="text-cricket-red hover:underline">
              Request a new reset link
            </Link>
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const password = String(fd.get("password"));
              const confirm = String(fd.get("confirm"));
              if (password.length < 8) return toast.error("Password must be at least 8 characters");
              if (password !== confirm) return toast.error("Passwords do not match");

              setLoading(true);
              const { data, error } = await supabase.auth.updateUser({ password });
              setLoading(false);
              if (error) {
                setFailed(true);
                return toast.error(error.message);
              }
              toast.success("Password updated");
              const uid = data.user?.id;
              const dest = uid ? await resolveRolePathForUser(uid) : "/auth";
              navigate({ to: dest });
            }}
            className="space-y-4"
          >
            <Field name="password" label="New Password (min 8)" type="password" required />
            <Field name="confirm" label="Confirm Password" type="password" required />
            <button
              disabled={loading}
              className="cta-press skew-tag w-full bg-cricket-red text-white py-3 font-display uppercase italic tracking-widest"
            >
              <span>{loading ? "Saving..." : "Set New Password"}</span>
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label className="block text-[10px] font-mono uppercase tracking-widest text-white/60 mb-2 font-bold">
        {label}
        {required && <span className="text-cricket-red ml-1">*</span>}
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
