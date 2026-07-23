import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { deleteUserAccount, reviewRecruiter } from "@/lib/admin.functions";
import { PlayerDetail } from "@/routes/_authenticated/recruiter";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin · Cricket Recruit" }, { name: "robots", content: "noindex" }] }),
  component: AdminDashboard,
});

type Tab = "pending" | "recruiters" | "players";

function AdminDashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("pending");
  const [viewPlayerId, setViewPlayerId] = useState<string | null>(null);
  const [viewRecruiterId, setViewRecruiterId] = useState<string | null>(null);
  const review = useServerFn(reviewRecruiter);
  const del = useServerFn(deleteUserAccount);

  const { data: recruiters } = useQuery({
    queryKey: ["all-recruiters"],
    queryFn: async () => {
      const { data } = await supabase.from("recruiter_profiles").select("*, profiles(email, full_name)").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: players } = useQuery({
    queryKey: ["all-players-admin"],
    queryFn: async () => {
      const { data } = await supabase.from("player_profiles").select("*, profiles(email)").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const pending = (recruiters ?? []).filter((r: any) => r.status === "pending");

  const handleReview = async (userId: string, status: "approved" | "rejected") => {
    try {
      await review({ data: { userId, status } });
      toast.success(`Recruiter ${status}`);
      qc.invalidateQueries({ queryKey: ["all-recruiters"] });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Delete this account permanently?")) return;
    try {
      await del({ data: { userId } });
      toast.success("Account deleted");
      qc.invalidateQueries();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const signOut = async () => { await supabase.auth.signOut(); navigate({ to: "/" }); };

  return (
    <div className="min-h-screen bg-ink-black text-white">
      <TopBar onSignOut={signOut} />

      {/* Hero band */}
      <div className="relative bg-ink-black text-white overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)", backgroundSize: "80px 80px" }}
        />
        <div className="max-w-6xl mx-auto px-6 py-14 md:py-18 relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-cricket-red" />
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-cricket-red">Admin · Dashboard</div>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h1 className="font-display italic text-5xl md:text-7xl uppercase leading-[0.9]">
              Admin<br />
              <span className="text-white/30">Control</span>
            </h1>
            <p className="text-white/60 text-sm max-w-md leading-relaxed md:pb-2">
              Manage recruiter approvals, monitor network accounts, and keep the talent pipeline moving.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {viewPlayerId ? (
          <PlayerDetail id={viewPlayerId} onBack={() => setViewPlayerId(null)} />
        ) : viewRecruiterId ? (
          <RecruiterDetail id={viewRecruiterId} onBack={() => setViewRecruiterId(null)} />
        ) : (
        <>
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/10">
          {[
            ["Players", (players ?? []).length],
            ["Recruiters", (recruiters ?? []).length],
            ["Pending Approvals", pending.length],
          ].map(([label, count]) => (
            <div key={label as string} className="bg-white/[0.02] p-6">
              <div className="font-display italic text-4xl text-white">{count}</div>
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40 mt-2">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <nav className="flex flex-wrap gap-2 p-1 bg-white/[0.03] border border-white/10 w-fit">
          {([
            ["pending", `Pending Recruiters (${pending.length})`],
            ["recruiters", "All Recruiters"],
            ["players", "All Players"],
          ] as [Tab, string][]).map(([t, l]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-5 py-2.5 font-display uppercase italic text-sm tracking-widest transition-all cta-press ${
                tab === t
                  ? "skew-tag bg-cricket-red text-white"
                  : "skew-tag text-white/50 hover:text-white"
              }`}
            >
              <span>{l}</span>
            </button>
          ))}
        </nav>

        {/* Pending Recruiters */}
        {tab === "pending" && (
          <div className="bg-white/[0.02] border border-white/10 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/[0.05] border-b border-white/10">
                <tr className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                  <th className="px-6 py-4 font-normal">Organization</th>
                  <th className="px-6 py-4 font-normal hidden md:table-cell">Type</th>
                  <th className="px-6 py-4 font-normal hidden lg:table-cell">Reason</th>
                  <th className="px-6 py-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pending.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">No pending applications</div>
                    </td>
                  </tr>
                )}
                {pending.map((r: any) => (
                  <tr key={r.user_id} className="group hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-5">
                      <button onClick={() => setViewRecruiterId(r.user_id)} className="font-display italic text-xl uppercase text-white hover:text-cricket-red hover:underline transition-colors text-left">
                        {r.organization_name}
                      </button>
                      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mt-1">
                        {r.profiles?.full_name} · {r.profiles?.email}
                      </div>
                      <div className="text-xs text-white/60 mt-1 md:hidden">{r.organization_type} · {r.role_title}</div>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell">
                      <span className="text-xs text-white/70">{r.organization_type}</span>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-white/40 mt-1">{r.role_title}</div>
                    </td>
                    <td className="px-6 py-5 hidden lg:table-cell">
                      <span className="text-sm text-white/60">{r.reason_for_access}</span>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-white/40 mt-1">{r.city}, {r.country}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => handleReview(r.user_id, "approved")}
                          className="cta-press skew-tag border border-cricket-red text-cricket-red px-4 py-2 font-display uppercase italic text-xs tracking-widest hover:bg-cricket-red hover:text-white transition-colors">
                          <span>Approve</span>
                        </button>
                        <button onClick={() => handleReview(r.user_id, "rejected")}
                          className="cta-press skew-tag border border-white/20 text-white/70 px-4 py-2 font-display uppercase italic text-xs tracking-widest hover:border-white hover:text-white transition-colors">
                          <span>Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* All Recruiters */}
        {tab === "recruiters" && (
          <div className="bg-white/[0.02] border border-white/10 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/[0.05] border-b border-white/10">
                <tr className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                  <th className="px-6 py-4 font-normal">Organization</th>
                  <th className="px-6 py-4 font-normal">Country</th>
                  <th className="px-6 py-4 font-normal">Email</th>
                  <th className="px-6 py-4 font-normal">Status</th>
                  <th className="px-6 py-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(recruiters ?? []).length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">No recruiters found</div>
                    </td>
                  </tr>
                )}
                {(recruiters ?? []).map((r: any) => (
                  <tr key={r.user_id} className="group hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-5">
                      <button onClick={() => setViewRecruiterId(r.user_id)} className="font-display italic text-lg uppercase text-white hover:text-cricket-red hover:underline transition-colors text-left">
                        {r.organization_name}
                      </button>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-white/70">{r.country}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-white/70">{r.profiles?.email}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-block px-2 py-1 font-mono uppercase text-[10px] tracking-widest skew-tag ${
                        r.status === "approved"
                          ? "bg-field-green/20 text-field-green"
                          : r.status === "pending"
                            ? "bg-cricket-red/20 text-cricket-red"
                            : "bg-white/10 text-white/60"
                      }`}>
                        <span>{r.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button onClick={() => handleDelete(r.user_id)}
                        className="text-xs text-cricket-red font-mono uppercase tracking-widest hover:underline transition-all">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* All Players */}
        {tab === "players" && (
          <div className="bg-white/[0.02] border border-white/10 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/[0.05] border-b border-white/10">
                <tr className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                  <th className="px-6 py-4 font-normal">Name</th>
                  <th className="px-6 py-4 font-normal">Country</th>
                  <th className="px-6 py-4 font-normal">Email</th>
                  <th className="px-6 py-4 font-normal">Skill</th>
                  <th className="px-6 py-4 font-normal hidden md:table-cell">Academy</th>
                  <th className="px-6 py-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(players ?? []).length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">No players found</div>
                    </td>
                  </tr>
                )}
                {(players ?? []).map((p: any) => (
                  <tr key={p.user_id} className="group hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-5">
                      <button onClick={() => setViewPlayerId(p.user_id)} className="font-display italic text-lg uppercase text-white hover:text-cricket-red hover:underline transition-colors text-left">
                        {p.first_name} {p.last_name}
                      </button>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-white/70">{p.country}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-white/70">{p.profiles?.email}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-mono uppercase text-[10px] tracking-widest text-white/60">{p.primary_skill?.replace(/_/g, " ")}</span>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell">
                      <span className="text-sm text-white/70">{p.academy}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button onClick={() => handleDelete(p.user_id)}
                        className="text-xs text-cricket-red font-mono uppercase tracking-widest hover:underline transition-all">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/10 pt-8">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
            {tab === "pending" && `Showing ${pending.length} pending request${pending.length === 1 ? "" : "s"}`}
            {tab === "recruiters" && `Showing ${(recruiters ?? []).length} recruiter${(recruiters ?? []).length === 1 ? "" : "s"}`}
            {tab === "players" && `Showing ${(players ?? []).length} player${(players ?? []).length === 1 ? "" : "s"}`}
          </div>
          <Link to="/" className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/50 hover:text-cricket-red transition-colors">
            ← Back to Home
          </Link>
        </div>
        </>
        )}
      </div>
    </div>
  );
}

function TopBar({ onSignOut }: { onSignOut: () => void }) {
  return (
    <div className="bg-ink-black text-white border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="font-display italic uppercase tracking-widest text-lg">CR</span>
          <span className="h-4 w-px bg-white/30" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/60 group-hover:text-cricket-red transition-colors">Admin</span>
        </Link>
        <button onClick={onSignOut} className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/60 hover:text-cricket-red transition-colors">
          Sign Out →
        </button>
      </div>
    </div>
  );
}

function RecruiterDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const { data: r } = useQuery({
    queryKey: ["recruiter-detail", id],
    queryFn: async () =>
      (await supabase.from("recruiter_profiles").select("*, profiles(email, full_name)").eq("user_id", id).maybeSingle()).data,
  });

  if (!r) {
    return <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/40 animate-pulse">Loading</p>;
  }

  return (
    <div>
      <button onClick={onBack} className="text-[10px] font-mono uppercase tracking-[0.3em] text-cricket-red hover:tracking-[0.4em] transition-all mb-8">
        ← Back to Index
      </button>

      <div className="bg-white/[0.02] border-t-2 border-cricket-red border-b border-l border-r border-white/10 p-8 md:p-10">
        <div className="flex items-center gap-3 mb-6">
          <span className={`inline-block px-2 py-1 font-mono uppercase text-[10px] tracking-widest skew-tag ${
            r.status === "approved"
              ? "bg-field-green/20 text-field-green"
              : r.status === "pending"
                ? "bg-cricket-red/20 text-cricket-red"
                : "bg-white/10 text-white/60"
          }`}>
            <span>{r.status}</span>
          </span>
        </div>
        <h2 className="font-display italic text-4xl md:text-5xl uppercase leading-[0.95] mb-10 text-white">
          {r.organization_name}
        </h2>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 pt-8 border-t border-white/10">
          <Row k="Contact" v={`${r.profiles?.full_name ?? "—"} · ${r.profiles?.email ?? "—"}`} />
          <Row k="Role / Title" v={r.role_title} />
          <Row k="Organization Type" v={r.organization_type} />
          <Row k="Location" v={`${r.city}, ${r.country}`} />
          {r.website && <Row k="Website" v={r.website} />}
          {r.phone && <Row k="Phone" v={r.phone} />}
          <div className="sm:col-span-2">
            <Row k="Reason for Access" v={r.reason_for_access} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40 mb-1.5">{k}</div>
      <div className="text-sm text-white">{v}</div>
    </div>
  );
}
