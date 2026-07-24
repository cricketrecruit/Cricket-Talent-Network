import { z } from "zod";

const signupAgeGroup = z.enum(["youth_15_19", "adult_19_plus"]);
const gender = z.enum(["male", "female", "other"]);
const primarySkill = z.enum(["batter", "bowler", "wicket_keeper", "batting_all_rounder", "bowling_all_rounder"]);
const battingStyle = z.enum(["right_handed", "left_handed"]);
const bowlingStyle = z.enum([
  "right_arm_pace",
  "right_arm_medium",
  "left_arm_pace",
  "left_arm_medium",
  "off_spin",
  "leg_spin",
  "left_arm_orthodox",
  "chinaman",
]);

export function parseDobToIso(month: string, day: string, year: string): string | null {
  const m = Number(month);
  const d = Number(day);
  const y = Number(year);
  if (!m || !d || !y || m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > new Date().getFullYear()) {
    return null;
  }
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return null;
  }
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

const dobSchema = z.string().min(1, "Date of birth is required").refine((value) => {
  const [y, m, d] = value.split("-").map(Number);
  return parseDobToIso(String(m), String(d), String(y)) === value;
}, "Enter a valid date of birth");

export const step1Schema = z.object({
  email: z.string().email("Enter a valid account email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const step2Schema = z.object({
  age_group: signupAgeGroup,
  headline: z.string().min(1, "Profile headline is required"),
  first_name: z.string().min(1, "Player first name is required"),
  last_name: z.string().min(1, "Player last name is required"),
  gender,
  dob: dobSchema,
});

export const step3Schema = z.object({
  contact_email: z.string().email("Enter a valid contact email"),
  phone_country_code: z.string().min(1, "Country code is required"),
  phone_number: z.string().min(4, "Phone number is required"),
  city: z.string().min(1, "City of residence is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
});

export const step4Schema = z.object({
  academy: z.string().min(1, "Academy / Club is required"),
  primary_skill: primarySkill,
  batting_style: battingStyle,
  bowling_style: bowlingStyle,
});

export const step5Schema = z.object({
  media_consent: z.literal("true", { message: "You must agree to the Media Consent & Release Terms" }),
});

export const playerSignupSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema);

export type PlayerSignupValues = z.infer<typeof playerSignupSchema>;

export const SIGNUP_STEP_TITLES = [
  "Account",
  "Age & Personal",
  "Contact & Location",
  "Cricket Profile",
  "Documents & Consent",
] as const;

export const EMPTY_SIGNUP_VALUES: Omit<PlayerSignupValues, "media_consent"> & { media_consent: "" } = {
  email: "",
  password: "",
  age_group: "" as PlayerSignupValues["age_group"],
  headline: "",
  first_name: "",
  last_name: "",
  gender: "" as PlayerSignupValues["gender"],
  dob: "",
  contact_email: "",
  phone_country_code: "",
  phone_number: "",
  city: "",
  state: "",
  country: "",
  academy: "",
  primary_skill: "" as PlayerSignupValues["primary_skill"],
  batting_style: "" as PlayerSignupValues["batting_style"],
  bowling_style: "" as PlayerSignupValues["bowling_style"],
  media_consent: "",
};
