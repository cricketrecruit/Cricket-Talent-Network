import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { assignRole, notifyAdminsOfNewPlayer } from "@/lib/admin.functions";
import {
  BATTING_STYLE_OPTIONS,
  BOWLING_STYLE_OPTIONS,
  GENDER_OPTIONS,
  PLAYER_LABELS,
  PRIMARY_SKILL_OPTIONS,
  SIGNUP_AGE_GROUP_OPTIONS,
} from "@/lib/player-profile-fields";
import {
  EMPTY_SIGNUP_VALUES,
  playerSignupSchema,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  type PlayerSignupValues,
} from "@/lib/player-signup-schema";
import { DobFields } from "@/components/player-signup/DobFields";
import { PhoneFields } from "@/components/player-signup/PhoneFields";
import { SignupStepIndicator } from "@/components/player-signup/SignupStepIndicator";

function SignupField({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label className="block text-[10px] font-mono uppercase tracking-widest text-white/60 mb-2 font-bold">
        {label}{required && <span className="text-cricket-red ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={isPassword && visible ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
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

function SignupSelect({
  label,
  value,
  options,
  onChange,
  required,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] font-mono uppercase tracking-widest text-white/60 mb-2 font-bold">
        {label}{required && <span className="text-cricket-red ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/20 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-cricket-red"
      >
        <option value="" disabled className="bg-ink-black">Select...</option>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue} className="bg-ink-black">{optionLabel}</option>
        ))}
      </select>
    </div>
  );
}

function MediaConsent({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="border border-white/15 bg-white/[0.03] p-4 space-y-3">
      <div className="text-[10px] font-mono uppercase tracking-widest text-white/60 font-bold">
        Media Consent &amp; Release
      </div>
      <p className="text-xs text-white/60 leading-relaxed">
        I hereby grant permission to Cricket Recruit to capture, use, reproduce, publish, and distribute my
        photographs, videos, audio recordings, and other media featuring me for the purpose of showcasing my
        cricket skills, promoting player profiles, marketing, advertising, social media, websites, digital
        platforms, print materials, and other promotional or educational content.
      </p>
      <p className="text-xs text-white/60 leading-relaxed">
        I understand that these materials may be edited, modified, or combined with other content and may be
        used without further notice or compensation. I release Cricket Recruit from any claims arising from the
        use of such media for these purposes.
      </p>
      <p className="text-xs text-white/60 leading-relaxed">
        By accepting this consent, I confirm that I have read, understood, and agree to the use of my media as
        described above.
      </p>
      <label className="flex items-start gap-2 text-xs text-white/80 pt-1">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5"
        />
        I Agree to the Media Consent and Release Terms.
      </label>
    </div>
  );
}

export function PlayerSignupWizard() {
  const navigate = useNavigate();
  const assign = useServerFn(assignRole);
  const notifyAdmins = useServerFn(notifyAdminsOfNewPlayer);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(EMPTY_SIGNUP_VALUES);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [cv, setCv] = useState<File | null>(null);

  const patch = (next: Partial<typeof values>) => setValues((prev) => ({ ...prev, ...next }));

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      const result = step1Schema.safeParse({ email: values.email, password: values.password });
      if (!result.success) {
        toast.error(result.error.issues[0].message);
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      if (!profilePhoto || profilePhoto.size === 0) {
        toast.error("Profile photo is required");
        return false;
      }
      const result = step2Schema.safeParse({
        age_group: values.age_group,
        headline: values.headline,
        first_name: values.first_name,
        last_name: values.last_name,
        gender: values.gender,
        dob: values.dob,
      });
      if (!result.success) {
        toast.error(result.error.issues[0].message);
        return false;
      }
      patch({ dob: result.data.dob });
      return true;
    }

    if (currentStep === 3) {
      const result = step3Schema.safeParse({
        contact_email: values.contact_email,
        phone_country_code: values.phone_country_code,
        phone_number: values.phone_number,
        city: values.city,
        state: values.state,
        country: values.country,
      });
      if (!result.success) {
        toast.error(result.error.issues[0].message);
        return false;
      }
      return true;
    }

    if (currentStep === 4) {
      const result = step4Schema.safeParse({
        academy: values.academy,
        primary_skill: values.primary_skill,
        batting_style: values.batting_style,
        bowling_style: values.bowling_style,
      });
      if (!result.success) {
        toast.error(result.error.issues[0].message);
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, 5));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    const result = step5Schema.safeParse({
      bio: values.bio,
      media_consent: values.media_consent === "true" ? "true" : undefined,
    });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    const parsed = playerSignupSchema.safeParse({
      ...values,
      media_consent: "true" as const,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (!profilePhoto) {
      toast.error("Profile photo is required");
      return;
    }
    if (!cv) {
      toast.error("CV / Resume is required");
      return;
    }

    setLoading(true);
    const v = parsed.data;

    try {
      const { data, error } = await supabase.auth.signUp({
        email: v.email,
        password: v.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: { full_name: `${v.first_name} ${v.last_name}` },
        },
      });
      if (error || !data.user) {
        toast.error(error?.message ?? "Signup failed");
        return;
      }
      if (!data.session) {
        toast.error("Please check your email to confirm your account before signing in.");
        return;
      }

      await assign({ data: { userId: data.user.id, role: "player" } });

      const userId = data.user.id;
      const photoPath = `${userId}/profile-photo-${Date.now()}-${profilePhoto.name}`;
      const { error: photoErr } = await supabase.storage.from("player-media").upload(photoPath, profilePhoto);
      if (photoErr) {
        toast.error(photoErr.message);
        return;
      }

      let cvPath: string | null = null;
      if (cv && cv.size > 0) {
        cvPath = `${userId}/cv-${Date.now()}-${cv.name}`;
        const { error: cvErr } = await supabase.storage.from("player-media").upload(cvPath, cv);
        if (cvErr) {
          toast.error(cvErr.message);
          return;
        }
      }

      const { error: pErr } = await supabase.from("player_profiles").insert({
        user_id: userId,
        first_name: v.first_name,
        last_name: v.last_name,
        dob: v.dob,
        headline: v.headline,
        gender: v.gender,
        contact_email: v.contact_email,
        phone_country_code: v.phone_country_code,
        phone_number: v.phone_number,
        city: v.city,
        state: v.state,
        country: v.country,
        academy: v.academy,
        age_group: v.age_group,
        primary_skill: v.primary_skill,
        batting_style: v.batting_style,
        bowling_style: v.bowling_style,
        bio: v.bio,
        profile_photo_path: photoPath,
        cv_storage_path: cvPath,
        media_consent: true,
      });

      if (pErr) {
        toast.error(pErr.message);
        return;
      }

      try {
        await notifyAdmins({
          data: { firstName: v.first_name, lastName: v.last_name, email: v.contact_email, country: v.country },
        });
      } catch {
        // Non-critical: never block account creation on a notification failure.
      }

      toast.success("Account created");
      navigate({ to: "/player", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong creating your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <SignupStepIndicator step={step} />

      {step === 1 && (
        <div className="space-y-5">
          <SignupField
            label="Account Email"
            type="email"
            required
            value={values.email}
            onChange={(email) => patch({ email })}
          />
          <SignupField
            label="Password (min 8)"
            type="password"
            required
            value={values.password}
            onChange={(password) => patch({ password })}
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <SignupSelect
            label="Age Group"
            required
            value={values.age_group}
            options={SIGNUP_AGE_GROUP_OPTIONS}
            onChange={(age_group) => patch({ age_group: age_group as PlayerSignupValues["age_group"] })}
          />
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-white/60 mb-2 font-bold">
              {PLAYER_LABELS.profilePhoto}<span className="text-cricket-red ml-1">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePhoto(e.target.files?.[0] ?? null)}
              className="w-full bg-white/5 border border-white/20 text-white text-sm file:mr-3 file:py-2.5 file:px-3 file:border-0 file:bg-cricket-red file:text-white file:text-xs file:uppercase file:tracking-widest file:font-display file:italic focus:outline-none focus:border-cricket-red"
            />
            {profilePhoto && (
              <p className="text-xs text-white/50 mt-2">{profilePhoto.name}</p>
            )}
          </div>
          <SignupField
            label={PLAYER_LABELS.profileHeadline}
            required
            value={values.headline}
            onChange={(headline) => patch({ headline })}
          />
          <SignupField
            label="Player First Name"
            required
            value={values.first_name}
            onChange={(first_name) => patch({ first_name })}
          />
          <SignupField
            label="Player Last Name"
            required
            value={values.last_name}
            onChange={(last_name) => patch({ last_name })}
          />
          <SignupSelect
            label={PLAYER_LABELS.gender}
            required
            value={values.gender}
            options={GENDER_OPTIONS}
            onChange={(gender) => patch({ gender: gender as PlayerSignupValues["gender"] })}
          />
          <DobFields value={values.dob} onChange={(dob) => patch({ dob })} />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <SignupField
            label={PLAYER_LABELS.contactEmail}
            type="email"
            required
            value={values.contact_email}
            onChange={(contact_email) => patch({ contact_email })}
          />
          <PhoneFields
            countryCode={values.phone_country_code}
            phoneNumber={values.phone_number}
            onChange={({ countryCode, phoneNumber }) =>
              patch({ phone_country_code: countryCode, phone_number: phoneNumber })
            }
          />
          <SignupField
            label={PLAYER_LABELS.city}
            required
            value={values.city}
            onChange={(city) => patch({ city })}
          />
          <SignupField
            label={PLAYER_LABELS.state}
            required
            value={values.state}
            onChange={(state) => patch({ state })}
          />
          <SignupField
            label={PLAYER_LABELS.country}
            required
            value={values.country}
            onChange={(country) => patch({ country })}
          />
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <SignupField
            label={PLAYER_LABELS.academy}
            required
            value={values.academy}
            onChange={(academy) => patch({ academy })}
          />
          <SignupSelect
            label={PLAYER_LABELS.primarySkill}
            required
            value={values.primary_skill}
            options={PRIMARY_SKILL_OPTIONS}
            onChange={(primary_skill) => patch({ primary_skill: primary_skill as PlayerSignupValues["primary_skill"] })}
          />
          <SignupSelect
            label={PLAYER_LABELS.battingStyle}
            required
            value={values.batting_style}
            options={BATTING_STYLE_OPTIONS}
            onChange={(batting_style) => patch({ batting_style: batting_style as PlayerSignupValues["batting_style"] })}
          />
          <SignupSelect
            label={PLAYER_LABELS.bowlingStyle}
            required
            value={values.bowling_style}
            options={BOWLING_STYLE_OPTIONS}
            onChange={(bowling_style) => patch({ bowling_style: bowling_style as PlayerSignupValues["bowling_style"] })}
          />
        </div>
      )}

      {step === 5 && (
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-white/60 mb-2 font-bold">
              {PLAYER_LABELS.bio}<span className="text-cricket-red ml-1">*</span>
            </label>
            <textarea
              value={values.bio}
              onChange={(e) => patch({ bio: e.target.value })}
              rows={4}
              className="w-full bg-white/5 border border-white/20 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-cricket-red"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-white/60 mb-2 font-bold">
              {PLAYER_LABELS.cv}<span className="text-cricket-red ml-1">*</span>
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setCv(e.target.files?.[0] ?? null)}
              className="w-full bg-white/5 border border-white/20 text-white text-sm file:mr-3 file:py-2.5 file:px-3 file:border-0 file:bg-cricket-red file:text-white file:text-xs file:uppercase file:tracking-widest file:font-display file:italic focus:outline-none focus:border-cricket-red"
            />
            {cv && <p className="text-xs text-white/50 mt-2">{cv.name}</p>}
          </div>
          <MediaConsent
            checked={values.media_consent === "true"}
            onChange={(checked) => patch({ media_consent: checked ? "true" : "" })}
          />
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        {step > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="cta-press skew-tag border border-white/20 text-white/80 px-5 py-3 font-display uppercase italic text-sm tracking-widest"
          >
            <span>Back</span>
          </button>
        )}
        {step < 5 ? (
          <button
            type="button"
            onClick={handleNext}
            className="cta-press skew-tag flex-1 bg-cricket-red text-white py-3 font-display uppercase italic tracking-widest"
          >
            <span>Next</span>
          </button>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="cta-press skew-tag flex-1 bg-cricket-red text-white py-3 font-display uppercase italic tracking-widest"
          >
            <span>{loading ? "Creating..." : "Create Player Account"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
