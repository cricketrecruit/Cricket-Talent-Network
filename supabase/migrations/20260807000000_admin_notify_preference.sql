-- Per-admin opt-in for "new player signed up" email notifications, default off.
ALTER TABLE public.profiles
  ADD COLUMN notify_on_new_player BOOLEAN NOT NULL DEFAULT false;
