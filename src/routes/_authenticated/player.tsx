import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/player")({
  head: () => ({ meta: [{ title: "Player Dashboard · Cricket Recruit" }, { name: "robots", content: "noindex" }] }),
  component: PlayerDashboard,
});

function PlayerDashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => (await supabase.auth.getUser()).data.user,
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-player-profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("player_profiles").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
  });

  const { data: media } = useQuery({
    queryKey: ["my-media", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("player_media").select("*").eq("player_id", user!.id).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const signOut = async () => { await supabase.auth.signOut(); navigate({ to: "/" }); };

  return (
    <div className="min-h-screen bg-metric text-ink-black">
      <TopBar onSignOut={signOut} />

      {/* Hero band */}
      <div className="relative bg-ink-black text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)", backgroundSize: "80px 80px" }}
        />
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-cricket-red" />
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-cricket-red">Player · Dashboard</div>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h1 className="font-display italic text-5xl md:text-7xl uppercase leading-[0.9]">
              My<br />
              <span className="text-white/30">Profile</span>
            </h1>
            <p className="text-white/60 text-sm max-w-md leading-relaxed md:pb-2">
              Manage your cricket profile, update your details, and showcase your best media for recruiters.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Profile section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-cricket-red" />
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-soft">Profile Details</div>
            </div>
            {profile && (
              <button
                onClick={() => setEditing((v) => !v)}
                className="cta-press skew-tag bg-ink-black text-white px-5 py-2 font-display uppercase italic text-xs tracking-widest"
              >
                <span>{editing ? "Cancel" : "Edit Profile"}</span>
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="bg-white border border-ink-black/10 p-12 flex items-center justify-center">
              <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-ink-soft animate-pulse">Loading profile</div>
            </div>
          ) : !profile ? (
            <EmptyState message="No profile found. Complete your registration to build your player dashboard." />
          ) : editing ? (
            <ProfileEditor profile={profile} onDone={() => { setEditing(false); qc.invalidateQueries({ queryKey: ["my-player-profile"] }); }} />
          ) : (
            <ProfileView p={profile} />
          )}
        </section>

        {/* Media section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-cricket-red" />
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-soft">Media Library</div>
          </div>

          <div className="bg-white border border-ink-black/10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display italic text-2xl uppercase">Showcase your Skills</h2>
                <p className="text-ink-soft text-sm mt-1">Upload images and videos to share with recruiters.</p>
              </div>
              <MediaUploader userId={user?.id} onUploaded={() => qc.invalidateQueries({ queryKey: ["my-media"] })} />
            </div>

            {(media ?? []).length === 0 ? (
              <div className="border border-dashed border-ink-black/20 p-10 flex flex-col items-center justify-center text-center">
                <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-soft mb-2">Empty</div>
                <p className="text-sm text-ink-soft">No media uploaded yet.</p>
              </div>
            ) : (
              <div className={`grid gap-px bg-ink-black/10 ${
                (media?.length ?? 0) === 1
                  ? "grid-cols-1"
                  : (media?.length ?? 0) === 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}>
                {(media ?? []).map((m) => (
                  <MediaCard key={m.id} media={m} onDeleted={() => qc.invalidateQueries({ queryKey: ["my-media"] })} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function TopBar({ onSignOut }: { onSignOut: () => void }) {
  return (
    <div className="bg-ink-black text-white border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display italic uppercase tracking-widest">CR · Player</Link>
        <button onClick={onSignOut} className="text-sm font-mono uppercase tracking-widest text-white/70 hover:text-white transition-colors">
          Sign Out →
        </button>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white border border-ink-black/10 p-10 md:p-14 flex flex-col items-center justify-center text-center">
      <div className="h-px w-10 bg-cricket-red mb-6" />
      <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-soft mb-3">No Data</div>
      <p className="text-sm text-ink-soft max-w-md leading-relaxed">{message}</p>
    </div>
  );
}

function ProfileView({ p }: { p: any }) {
  const rows: [string, string][] = [
    ["Name", `${p.first_name} ${p.last_name}`],
    ["Gender", p.gender ?? "—"],
    ["DOB", p.dob],
    ["Contact Email", p.contact_email],
    ["Phone", `${p.phone_country_code} ${p.phone_number}`],
    ["Location", `${p.city}, ${p.state}, ${p.country}`],
    ["Academy / Club", p.academy],
    ["Age Group", p.age_group],
    ["Primary Skill", p.primary_skill],
    ["Batting Style", p.batting_style],
    ["Bowling Style", p.bowling_style],
    ["Bio", p.bio ?? "—"],
  ];

  const { data: photoUrl } = useQuery({
    queryKey: ["signed", p.profile_photo_path],
    enabled: !!p.profile_photo_path,
    queryFn: async () => (await supabase.storage.from("player-media").createSignedUrl(p.profile_photo_path, 3600)).data?.signedUrl,
  });
  const { data: cvUrl } = useQuery({
    queryKey: ["signed", p.cv_storage_path],
    enabled: !!p.cv_storage_path,
    queryFn: async () =>
      (await supabase.storage.from("player-media").createSignedUrl(p.cv_storage_path, 3600, { download: p.cv_storage_path.split("/").pop() })).data?.signedUrl,
  });

  return (
    <div className="bg-white border border-ink-black/10 overflow-hidden">
      <div className="border-b border-ink-black/10 p-6 md:p-8 flex items-center gap-6">
        {photoUrl && (
          <img src={photoUrl} alt="" className="size-20 rounded-full object-cover border border-ink-black/10 shrink-0" />
        )}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8 bg-cricket-red" />
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-cricket-red">Overview</div>
          </div>
          <h2 className="font-display italic text-3xl md:text-4xl uppercase">{p.first_name} {p.last_name}</h2>
          {p.headline && <p className="text-ink-soft text-sm mt-1">{p.headline}</p>}
        </div>
      </div>
      <div className="p-6 md:p-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
        {rows.map(([k, v]) => (
          <div key={k} className={k === "Bio" ? "sm:col-span-2 lg:col-span-3" : ""}>
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-ink-soft mb-1.5">{k}</div>
            <div className="text-sm leading-relaxed">{v}</div>
          </div>
        ))}
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-ink-soft mb-1.5">CV / Resume</div>
          {cvUrl ? (
            <a href={cvUrl} download className="text-sm text-cricket-red hover:underline">↓ Download</a>
          ) : (
            <div className="text-sm text-ink-soft">—</div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileEditor({ profile, onDone }: { profile: any; onDone: () => void }) {
  const [saving, setSaving] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const newPhoto = fd.get("new_profile_photo") as File | null;
        const newCv = fd.get("new_cv") as File | null;
        setSaving(true);
        const update: any = Object.fromEntries(fd.entries());
        delete update.new_profile_photo;
        delete update.new_cv;
        if (update.bio === "") update.bio = null;

        if (newPhoto && newPhoto.size > 0) {
          const path = `${profile.user_id}/profile-photo-${Date.now()}-${newPhoto.name}`;
          const { error: upErr } = await supabase.storage.from("player-media").upload(path, newPhoto);
          if (upErr) { setSaving(false); return toast.error(upErr.message); }
          update.profile_photo_path = path;
        }
        if (newCv && newCv.size > 0) {
          const path = `${profile.user_id}/cv-${Date.now()}-${newCv.name}`;
          const { error: upErr } = await supabase.storage.from("player-media").upload(path, newCv);
          if (upErr) { setSaving(false); return toast.error(upErr.message); }
          update.cv_storage_path = path;
        }

        const { error } = await supabase.from("player_profiles").update(update).eq("user_id", profile.user_id);
        setSaving(false);
        if (error) return toast.error(error.message);
        toast.success("Profile updated");
        onDone();
      }}
      className="bg-white border border-ink-black/10 overflow-hidden"
    >
      <div className="border-b border-ink-black/10 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px w-8 bg-cricket-red" />
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-cricket-red">Editing</div>
        </div>
        <h2 className="font-display italic text-3xl uppercase">Edit Profile</h2>
      </div>
      <div className="p-6 md:p-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
        <F name="first_name" label="First Name" defaultValue={profile.first_name} />
        <F name="last_name" label="Last Name" defaultValue={profile.last_name} />
        <div className="sm:col-span-2 lg:col-span-3">
          <F name="headline" label="Profile Headline" defaultValue={profile.headline ?? ""} />
        </div>
        <S name="gender" label="Gender" defaultValue={profile.gender ?? ""} options={[
          ["male", "Male"], ["female", "Female"], ["other", "Other"],
        ]} />
        <FileF name="new_profile_photo" label="Replace Profile Photo" accept="image/*" />
        <FileF name="new_cv" label="Replace CV / Resume" accept=".pdf,.doc,.docx" />
        <F name="dob" label="DOB" type="date" defaultValue={profile.dob} />
        <F name="contact_email" label="Contact Email" type="email" defaultValue={profile.contact_email} />
        <F name="phone_country_code" label="Phone Country Code" defaultValue={profile.phone_country_code} />
        <F name="phone_number" label="Phone Number" defaultValue={profile.phone_number} />
        <F name="city" label="City" defaultValue={profile.city} />
        <F name="state" label="State" defaultValue={profile.state} />
        <F name="country" label="Country" defaultValue={profile.country} />
        <F name="academy" label="Academy / Club" defaultValue={profile.academy} />
        <S name="age_group" label="Age Group" defaultValue={profile.age_group} options={[
          ["youth_11_14", "Youth 11-14"], ["youth_15_19", "Youth 15-19"], ["adult_19_plus", "Adult 19+"],
        ]} />
        <S name="primary_skill" label="Primary Skill" defaultValue={profile.primary_skill} options={[
          ["batter","Batter"],["bowler","Bowler"],["wicket_keeper","Wicket Keeper"],
          ["batting_all_rounder","Batting All-Rounder"],["bowling_all_rounder","Bowling All-Rounder"],
        ]} />
        <S name="batting_style" label="Batting Style" defaultValue={profile.batting_style} options={[
          ["right_handed","Right Handed"],["left_handed","Left Handed"],
        ]} />
        <S name="bowling_style" label="Bowling Style" defaultValue={profile.bowling_style} options={[
          ["right_arm_pace","Right-arm pace"],["right_arm_medium","Right-arm medium"],
          ["left_arm_pace","Left-arm pace"],["left_arm_medium","Left-arm medium"],
          ["off_spin","Off-spin"],["leg_spin","Leg-spin"],
          ["left_arm_orthodox","Left-arm orthodox"],["chinaman","Chinaman"],
        ]} />
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-ink-soft mb-2">Bio</label>
          <textarea name="bio" defaultValue={profile.bio ?? ""} rows={4}
            className="w-full border border-ink-black/20 px-3 py-2.5 text-sm focus:border-cricket-red focus:outline-none transition-colors" />
        </div>
      </div>
      <div className="border-t border-ink-black/10 p-6 md:p-8 flex items-center gap-4">
        <button disabled={saving} className="cta-press skew-tag bg-cricket-red text-white px-6 py-3 font-display uppercase italic text-sm tracking-widest">
          <span>{saving ? "Saving..." : "Save Changes"}</span>
        </button>
        <button type="button" onClick={onDone} className="text-sm font-mono uppercase tracking-widest text-ink-soft hover:text-ink-black transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

function F({ name, label, type = "text", defaultValue }: any) {
  return (
    <div>
      <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-ink-soft mb-2">{label}</label>
      <input name={name} type={type} defaultValue={defaultValue}
        className="w-full border border-ink-black/20 px-3 py-2.5 text-sm focus:border-cricket-red focus:outline-none transition-colors" />
    </div>
  );
}
function S({ name, label, defaultValue, options }: any) {
  return (
    <div>
      <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-ink-soft mb-2">{label}</label>
      <select name={name} defaultValue={defaultValue} className="w-full border border-ink-black/20 px-3 py-2.5 text-sm bg-white focus:border-cricket-red focus:outline-none transition-colors">
        {options.map(([v, l]: [string, string]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}
function FileF({ name, label, accept }: { name: string; label: string; accept?: string }) {
  return (
    <div>
      <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-ink-soft mb-2">{label}</label>
      <input name={name} type="file" accept={accept}
        className="w-full border border-ink-black/20 text-sm file:mr-3 file:py-2 file:px-3 file:border-0 file:bg-ink-black file:text-white file:text-xs file:uppercase file:tracking-widest focus:border-cricket-red focus:outline-none transition-colors" />
    </div>
  );
}

function MediaUploader({ userId, onUploaded }: { userId?: string; onUploaded: () => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  return (
    <div>
      <input
        ref={ref}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file || !userId) return;
          if (file.size > 50 * 1024 * 1024) return toast.error("Max 50MB");
          const isVideo = file.type.startsWith("video/");
          const path = `${userId}/${Date.now()}-${file.name}`;
          setUploading(true);
          const { error } = await supabase.storage.from("player-media").upload(path, file);
          if (error) { setUploading(false); return toast.error(error.message); }
          const { error: iErr } = await supabase.from("player_media").insert({
            player_id: userId, storage_path: path, media_type: isVideo ? "video" : "image",
          });
          setUploading(false);
          if (iErr) return toast.error(iErr.message);
          toast.success("Uploaded");
          onUploaded();
          if (ref.current) ref.current.value = "";
        }}
      />
      <button
        onClick={() => ref.current?.click()}
        disabled={uploading}
        className="cta-press skew-tag bg-ink-black text-white px-5 py-2.5 font-display uppercase italic text-xs tracking-widest"
      >
        <span>{uploading ? "Uploading..." : "Upload Image / Video"}</span>
      </button>
    </div>
  );
}

function MediaCard({ media, onDeleted }: { media: any; onDeleted: () => void }) {
  const { data: url } = useQuery({
    queryKey: ["media-url", media.storage_path],
    queryFn: async () => {
      const { data } = await supabase.storage.from("player-media").createSignedUrl(media.storage_path, 3600);
      return data?.signedUrl;
    },
  });
  return (
    <div className="bg-white p-4 lift group">
      <div className="zoom-frame bg-ink-black/5 aspect-video mb-4">
        {url && (media.media_type === "video"
          ? <video src={url} controls className="w-full h-full object-cover" />
          : <img src={url} alt="" className="w-full h-full object-cover" />)}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-ink-soft">{media.media_type}</span>
        <button
          onClick={async () => {
            await supabase.storage.from("player-media").remove([media.storage_path]);
            await supabase.from("player_media").delete().eq("id", media.id);
            toast.success("Deleted");
            onDeleted();
          }}
          className="text-xs text-cricket-red font-mono uppercase tracking-widest hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
