import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CvActions } from "@/components/CvActions";
import {
  getPlayerProfileRows,
  PLAYER_LABELS,
  type PlayerProfileAudience,
} from "@/lib/player-profile-fields";

export const Route = createFileRoute("/_authenticated/recruiter")({
  head: () => ({ meta: [{ title: "Recruiter · Cricket Recruit" }, { name: "robots", content: "noindex" }] }),
  component: RecruiterDashboard,
});

function RecruiterDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: user } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => (await supabase.auth.getUser()).data.user,
  });

  const { data: me } = useQuery({
    queryKey: ["my-recruiter", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("recruiter_profiles").select("*").eq("user_id", user!.id).maybeSingle()).data,
  });

  const { data: players } = useQuery({
    queryKey: ["all-players", search],
    enabled: me?.status === "approved",
    queryFn: async () => {
      let q = supabase.from("player_profiles").select("*").order("created_at", { ascending: false });
      if (search) q = q.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,academy.ilike.%${search}%`);
      const { data } = await q;
      return data ?? [];
    },
  });

  const signOut = async () => { await supabase.auth.signOut(); navigate({ to: "/" }); };

  if (!me) {
    return (
      <div className="min-h-screen bg-metric flex items-center justify-center">
        <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-ink-soft animate-pulse">Loading</div>
      </div>
    );
  }

  if (me.status !== "approved") {
    return (
      <div className="min-h-screen bg-ink-black text-white flex flex-col">
        <TopBar onSignOut={signOut} dark />
        <div className="flex-1 flex items-center justify-center px-6 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{ backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)", backgroundSize: "80px 80px" }}
          />
          <div className="relative max-w-xl w-full border border-white/10 bg-white/[0.02] backdrop-blur-sm p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-10 bg-cricket-red" />
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-cricket-red">Status · {me.status}</div>
            </div>
            <h2 className="font-display italic text-4xl md:text-5xl uppercase leading-[0.95] mb-6">
              {me.status === "pending" ? (<>Awaiting<br /><span className="text-white/40">Approval</span></>) : (<>Application<br /><span className="text-white/40">Rejected</span></>)}
            </h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-md">
              {me.status === "pending"
                ? "Your recruiter application is under review. You'll be able to browse players once an admin approves your account."
                : "Please contact the Cricket Recruit team for more information."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-metric text-ink-black">
      <TopBar onSignOut={signOut} />
      {selectedId ? (
        <div className="max-w-6xl mx-auto px-6 py-10">
          <PlayerDetail id={selectedId} onBack={() => setSelectedId(null)} />
        </div>
      ) : (
        <>
          {/* Hero band */}
          <div className="relative bg-ink-black text-white overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{ backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)", backgroundSize: "80px 80px" }}
            />
            <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-cricket-red" />
                <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-cricket-red">Recruiter · Dashboard</div>
              </div>
              <h1 className="font-display italic text-5xl md:text-7xl uppercase leading-[0.9]">
                Browse<br />
                <span className="text-white/30">Players</span>
              </h1>
              <div className="mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <p className="text-white/60 text-sm max-w-md leading-relaxed">
                  A curated network of vetted cricket talent. Search by name or academy to open a full profile.
                </p>
                <div className="relative w-full md:w-80">
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40 mb-2">Search</div>
                  <input
                    placeholder="Name or academy…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent border-b border-white/20 focus:border-cricket-red outline-none py-2 text-sm text-white placeholder:text-white/30 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-6">
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-soft">
                {players?.length ?? 0} {(players?.length ?? 0) === 1 ? "Player" : "Players"}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-soft">Index / 01</div>
            </div>
            <div className={`grid gap-px bg-ink-black/10 ${
              (players?.length ?? 0) === 1
                ? "grid-cols-1"
                : (players?.length ?? 0) === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}>
              {(players ?? []).map((p, i) => (
                <button
                  key={p.user_id}
                  onClick={() => setSelectedId(p.user_id)}
                  className="group text-left bg-white p-6 hover:bg-ink-black hover:text-white transition-colors duration-300 relative"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-soft group-hover:text-cricket-red transition-colors">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-soft group-hover:text-white/50 transition-colors">
                      {p.primary_skill.replace(/_/g, " ")}
                    </div>
                  </div>
                  <div className="font-display italic text-2xl uppercase leading-[0.95]">
                    {p.first_name}<br />{p.last_name}
                  </div>
                  <div className="mt-6 pt-4 border-t border-ink-black/10 group-hover:border-white/10 transition-colors">
                    <div className="text-xs text-ink-soft group-hover:text-white/60 transition-colors">{p.academy}</div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-ink-soft/70 group-hover:text-white/40 mt-1 transition-colors">{p.city}, {p.country}</div>
                  </div>
                  <div className="absolute bottom-6 right-6 text-cricket-red opacity-0 group-hover:opacity-100 transition-opacity text-lg">→</div>
                </button>
              ))}
              {players && players.length === 0 && (
                <div className="col-span-full bg-white p-12 text-center">
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-soft">No players match your search</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function TopBar({ onSignOut, dark = false }: { onSignOut: () => void; dark?: boolean }) {
  return (
    <div className={dark ? "bg-ink-black text-white border-b border-white/10" : "bg-ink-black text-white"}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="font-display italic uppercase tracking-widest text-lg">CR</span>
          <span className="h-4 w-px bg-white/30" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/60 group-hover:text-cricket-red transition-colors">Recruiter</span>
        </Link>
        <button onClick={onSignOut} className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/60 hover:text-cricket-red transition-colors">
          Sign Out →
        </button>
      </div>
    </div>
  );
}

export function PlayerDetail({
  id,
  onBack,
  audience = "recruiter",
  accountEmail,
}: {
  id: string;
  onBack: () => void;
  audience?: PlayerProfileAudience;
  accountEmail?: string | null;
}) {
  const { data: p } = useQuery({
    queryKey: ["player", id],
    queryFn: async () => (await supabase.from("player_profiles").select("*").eq("user_id", id).maybeSingle()).data,
  });
  const { data: profileEmail } = useQuery({
    queryKey: ["player-account-email", id],
    enabled: audience === "admin" && accountEmail === undefined,
    queryFn: async () => (await supabase.from("profiles").select("email").eq("id", id).maybeSingle()).data?.email ?? null,
  });
  const { data: media } = useQuery({
    queryKey: ["player-media", id],
    queryFn: async () => (await supabase.from("player_media").select("*").eq("player_id", id).order("created_at", { ascending: false })).data ?? [],
  });
  const { data: photoUrl } = useQuery({
    queryKey: ["signed", p?.profile_photo_path],
    enabled: !!p?.profile_photo_path,
    queryFn: async () => (await supabase.storage.from("player-media").createSignedUrl(p!.profile_photo_path!, 3600)).data?.signedUrl,
  });
  const { data: cvViewUrl } = useQuery({
    queryKey: ["signed", "view", p?.cv_storage_path],
    enabled: !!p?.cv_storage_path,
    queryFn: async () => (await supabase.storage.from("player-media").createSignedUrl(p!.cv_storage_path!, 3600)).data?.signedUrl,
  });
  const { data: cvDownloadUrl } = useQuery({
    queryKey: ["signed", "download", p?.cv_storage_path],
    enabled: !!p?.cv_storage_path,
    queryFn: async () =>
      (await supabase.storage.from("player-media").createSignedUrl(p!.cv_storage_path!, 3600, { download: p!.cv_storage_path!.split("/").pop() })).data
        ?.signedUrl,
  });

  if (!p) return <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-ink-soft animate-pulse">Loading</p>;

  const resolvedAccountEmail = accountEmail ?? profileEmail ?? null;
  const rows = getPlayerProfileRows(p, audience === "admin" ? "admin" : "recruiter", resolvedAccountEmail);

  return (
    <div>
      <button onClick={onBack} className="text-[10px] font-mono uppercase tracking-[0.3em] text-cricket-red hover:tracking-[0.4em] transition-all mb-8">
        ← Back to Index
      </button>

      <div className="bg-white border-t-2 border-cricket-red border-b border-l border-r border-ink-black/10 p-8 md:p-10 mb-10">
        <div className="flex items-center gap-6 mb-6">
          {photoUrl && (
            <img src={photoUrl} alt="" className="size-20 rounded-full object-cover border border-ink-black/10 shrink-0" />
          )}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-soft mb-1">Player Profile</div>
            <h2 className="font-display italic text-5xl md:text-6xl uppercase leading-[0.9] text-ink-black">
              {p.first_name}<br /><span className="text-ink-black/30">{p.last_name}</span>
            </h2>
            {p.headline && <p className="text-ink-soft text-sm mt-2">{p.headline}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 pt-8 border-t border-ink-black/10">
          {rows.map((row) => (
            <div key={row.key} className={row.fullWidth ? "sm:col-span-2 lg:col-span-3" : ""}>
              <Row k={row.label} v={row.value} />
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-ink-black/10">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-soft mb-1.5">{PLAYER_LABELS.cv}</div>
          {cvViewUrl && cvDownloadUrl ? (
            <CvActions path={p.cv_storage_path!} viewUrl={cvViewUrl} downloadUrl={cvDownloadUrl} />
          ) : (
            <div className="text-sm text-ink-black">—</div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="h-px w-10 bg-cricket-red" />
        <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-soft">Media Library</h3>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink-black/10">
        {(media ?? []).map((m) => <ViewMedia key={m.id} media={m} />)}
        {media && media.length === 0 && (
          <div className="col-span-full bg-white p-8">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-soft">No media uploaded</div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  if (!v && k) {
    return (
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-soft mb-1.5">{k}</div>
      </div>
    );
  }
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-soft mb-1.5">{k}</div>
      <div className="text-sm text-ink-black">{v}</div>
    </div>
  );
}

function ViewMedia({ media }: { media: any }) {
  const filename = (media.storage_path as string).split("/").pop() || "download";
  const { data: url } = useQuery({
    queryKey: ["signed", media.storage_path],
    queryFn: async () => (await supabase.storage.from("player-media").createSignedUrl(media.storage_path, 3600)).data?.signedUrl,
  });
  const { data: downloadUrl } = useQuery({
    queryKey: ["signed-download", media.storage_path],
    queryFn: async () =>
      (await supabase.storage.from("player-media").createSignedUrl(media.storage_path, 3600, { download: filename })).data?.signedUrl,
  });
  return (
    <div className="bg-white flex flex-col group">
      <div className="relative overflow-hidden">
        {url && (media.media_type === "video"
          ? <video src={url} controls className="w-full aspect-video object-cover bg-black" />
          : <img src={url} alt="" className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105" />)}
      </div>
      <div className="p-4 flex items-center justify-between gap-3 border-t border-ink-black/5">
        <div className="text-xs text-ink-soft truncate">{media.caption || <span className="font-mono uppercase tracking-widest text-[10px]">Untitled</span>}</div>
        <a
          href={downloadUrl || "#"}
          download={filename}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-mono uppercase tracking-[0.3em] text-cricket-red hover:tracking-[0.4em] transition-all whitespace-nowrap"
        >
          ↓ Download
        </a>
      </div>
    </div>
  );
}
