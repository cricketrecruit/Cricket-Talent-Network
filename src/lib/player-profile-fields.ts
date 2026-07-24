import type { Database } from "@/integrations/supabase/types";

export type PlayerProfile = Database["public"]["Tables"]["player_profiles"]["Row"];
export type PlayerProfileAudience = "player" | "recruiter" | "admin";

export const PLAYER_LABELS = {
  name: "Name",
  profilePhoto: "Profile Photo",
  profileHeadline: "Profile Headline",
  gender: "Gender",
  dob: "Date of Birth",
  accountEmail: "Account Email",
  contactEmail: "Contact Email",
  phone: "Country Code & Phone Number",
  city: "City of Residence",
  state: "State",
  country: "Country",
  academy: "Academy / Club you belong to",
  ageGroup: "Age Group",
  primarySkill: "Player Primary Skill",
  battingStyle: "Player Batting Style",
  bowlingStyle: "Player Bowling Style",
  bio: "Bio",
  mediaConsent: "Media Consent",
  cv: "CV / Resume",
} as const;

const GENDER_LABELS: Record<string, string> = {
  male: "Male",
  female: "Female",
  other: "Other",
};

const AGE_GROUP_LABELS: Record<string, string> = {
  youth_11_14: "Youth Cricket (11-14 years)",
  youth_15_19: "Youth Cricket (15-19 years)",
  adult_19_plus: "Adults: 19+ years",
};

const PRIMARY_SKILL_LABELS: Record<string, string> = {
  batter: "Batter",
  bowler: "Bowler",
  wicket_keeper: "Wicket Keeper",
  batting_all_rounder: "Batting All-Rounder",
  bowling_all_rounder: "Bowling All-Rounder",
};

const BATTING_STYLE_LABELS: Record<string, string> = {
  right_handed: "Right Handed",
  left_handed: "Left Handed",
};

const BOWLING_STYLE_LABELS: Record<string, string> = {
  right_arm_pace: "Right-arm pace",
  right_arm_medium: "Right-arm medium",
  left_arm_pace: "Left-arm pace",
  left_arm_medium: "Left-arm medium",
  off_spin: "Off-spin",
  leg_spin: "Leg-spin",
  left_arm_orthodox: "Left-arm orthodox",
  chinaman: "Chinaman",
};

export function formatPlayerValue(
  key: keyof PlayerProfile | "account_email",
  value: string | boolean | null | undefined,
): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";

  switch (key) {
    case "gender":
      return GENDER_LABELS[value] ?? String(value);
    case "age_group":
      return AGE_GROUP_LABELS[value] ?? String(value).replace(/_/g, " ");
    case "primary_skill":
      return PRIMARY_SKILL_LABELS[value] ?? String(value).replace(/_/g, " ");
    case "batting_style":
      return BATTING_STYLE_LABELS[value] ?? String(value).replace(/_/g, " ");
    case "bowling_style":
      return BOWLING_STYLE_LABELS[value] ?? String(value).replace(/_/g, " ");
    case "profile_photo_path":
      return value ? "Uploaded" : "—";
    case "cv_storage_path":
      return value ? "Uploaded" : "—";
    default:
      return String(value);
  }
}

export type PlayerProfileRow = {
  key: string;
  label: string;
  value: string;
  fullWidth?: boolean;
};

export function getPlayerProfileRows(
  profile: PlayerProfile,
  audience: PlayerProfileAudience,
  accountEmail?: string | null,
): PlayerProfileRow[] {
  const rows: PlayerProfileRow[] = [
    { key: "gender", label: PLAYER_LABELS.gender, value: formatPlayerValue("gender", profile.gender) },
    { key: "dob", label: PLAYER_LABELS.dob, value: profile.dob },
  ];

  if (audience === "admin" || audience === "player") {
    rows.push({
      key: "account_email",
      label: PLAYER_LABELS.accountEmail,
      value: accountEmail ?? "—",
    });
  }

  rows.push(
    {
      key: "contact_email",
      label: PLAYER_LABELS.contactEmail,
      value: profile.contact_email,
    },
    {
      key: "phone",
      label: PLAYER_LABELS.phone,
      value: `${profile.phone_country_code} ${profile.phone_number}`,
    },
    { key: "city", label: PLAYER_LABELS.city, value: profile.city },
    { key: "state", label: PLAYER_LABELS.state, value: profile.state },
    { key: "country", label: PLAYER_LABELS.country, value: profile.country },
    { key: "academy", label: PLAYER_LABELS.academy, value: profile.academy },
    {
      key: "age_group",
      label: PLAYER_LABELS.ageGroup,
      value: formatPlayerValue("age_group", profile.age_group),
    },
    {
      key: "primary_skill",
      label: PLAYER_LABELS.primarySkill,
      value: formatPlayerValue("primary_skill", profile.primary_skill),
    },
    {
      key: "batting_style",
      label: PLAYER_LABELS.battingStyle,
      value: formatPlayerValue("batting_style", profile.batting_style),
    },
    {
      key: "bowling_style",
      label: PLAYER_LABELS.bowlingStyle,
      value: formatPlayerValue("bowling_style", profile.bowling_style),
    },
    {
      key: "bio",
      label: PLAYER_LABELS.bio,
      value: formatPlayerValue("bio", profile.bio),
      fullWidth: true,
    },
  );

  if (audience === "admin") {
    rows.push({
      key: "media_consent",
      label: PLAYER_LABELS.mediaConsent,
      value: formatPlayerValue("media_consent", profile.media_consent),
    });
  }

  return rows;
}

export const PRIMARY_SKILL_OPTIONS: [string, string][] = [
  ["batter", "Batter"],
  ["bowler", "Bowler"],
  ["wicket_keeper", "Wicket Keeper"],
  ["batting_all_rounder", "Batting All-Rounder"],
  ["bowling_all_rounder", "Bowling All-Rounder"],
];

export const BOWLING_STYLE_OPTIONS: [string, string][] = [
  ["right_arm_pace", "Right-arm pace"],
  ["right_arm_medium", "Right-arm medium"],
  ["left_arm_pace", "Left-arm pace"],
  ["left_arm_medium", "Left-arm medium"],
  ["off_spin", "Off-spin"],
  ["leg_spin", "Leg-spin"],
  ["left_arm_orthodox", "Left-arm orthodox"],
  ["chinaman", "Chinaman"],
];

export const BATTING_STYLE_OPTIONS: [string, string][] = [
  ["right_handed", "Right Handed"],
  ["left_handed", "Left Handed"],
];

export const SIGNUP_AGE_GROUP_OPTIONS: [string, string][] = [
  ["youth_15_19", "Youth Cricket (15-18 years)"],
  ["adult_19_plus", "Adults: 19+ years"],
];

export const AGE_GROUP_OPTIONS: [string, string][] = [
  ["youth_11_14", "Youth Cricket (11-14 years)"],
  ["youth_15_19", "Youth Cricket (15-19 years)"],
  ["adult_19_plus", "Adults: 19+ years"],
];

export const GENDER_OPTIONS: [string, string][] = [
  ["male", "Male"],
  ["female", "Female"],
  ["other", "Other"],
];
