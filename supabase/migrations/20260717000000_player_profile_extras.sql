-- Player profile extras: photo, headline, gender, CV, media consent
CREATE TYPE public.gender AS ENUM ('male', 'female', 'other');

ALTER TABLE public.player_profiles
  ADD COLUMN profile_photo_path TEXT,
  ADD COLUMN headline TEXT,
  ADD COLUMN gender public.gender,
  ADD COLUMN cv_storage_path TEXT,
  ADD COLUMN media_consent BOOLEAN NOT NULL DEFAULT false;
