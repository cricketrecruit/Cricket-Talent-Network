
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'recruiter', 'player');
CREATE TYPE public.recruiter_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.age_group AS ENUM ('youth_11_14', 'youth_15_19', 'adult_19_plus');
CREATE TYPE public.primary_skill AS ENUM ('batter', 'bowler', 'wicket_keeper', 'batting_all_rounder', 'bowling_all_rounder');
CREATE TYPE public.batting_style AS ENUM ('right_handed', 'left_handed');
CREATE TYPE public.bowling_style AS ENUM ('right_arm_pace', 'right_arm_medium', 'left_arm_pace', 'left_arm_medium', 'off_spin', 'leg_spin', 'left_arm_orthodox', 'chinaman');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role security-definer
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- Player profiles
CREATE TABLE public.player_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  dob DATE NOT NULL,
  contact_email TEXT NOT NULL,
  phone_country_code TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL,
  academy TEXT NOT NULL,
  age_group public.age_group NOT NULL,
  primary_skill public.primary_skill NOT NULL,
  batting_style public.batting_style NOT NULL,
  bowling_style public.bowling_style NOT NULL,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.player_profiles TO authenticated;
GRANT ALL ON public.player_profiles TO service_role;
ALTER TABLE public.player_profiles ENABLE ROW LEVEL SECURITY;

-- Recruiter profiles
CREATE TABLE public.recruiter_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  organization_type TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  website TEXT,
  phone TEXT,
  reason_for_access TEXT NOT NULL,
  status public.recruiter_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recruiter_profiles TO authenticated;
GRANT ALL ON public.recruiter_profiles TO service_role;
ALTER TABLE public.recruiter_profiles ENABLE ROW LEVEL SECURITY;

-- Approved-recruiter helper
CREATE OR REPLACE FUNCTION public.is_approved_recruiter(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.recruiter_profiles
    WHERE user_id = _user_id AND status = 'approved'
  );
$$;

-- Player media
CREATE TABLE public.player_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.player_profiles(user_id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.player_media TO authenticated;
GRANT ALL ON public.player_media TO service_role;
ALTER TABLE public.player_media ENABLE ROW LEVEL SECURITY;

-- updated_at trigger fn
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_player_profiles_updated BEFORE UPDATE ON public.player_profiles
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_recruiter_profiles_updated BEFORE UPDATE ON public.recruiter_profiles
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============= RLS POLICIES =============

-- profiles: user reads/updates own; admins full
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin') OR public.is_approved_recruiter(auth.uid()));
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_admin_all" ON public.profiles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- user_roles: read own; admins full (writes done via service_role during signup/admin actions)
CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "user_roles_admin_all" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- player_profiles: owner full; approved recruiters SELECT; admins full
CREATE POLICY "player_profiles_owner_all" ON public.player_profiles FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "player_profiles_recruiter_select" ON public.player_profiles FOR SELECT TO authenticated
  USING (public.is_approved_recruiter(auth.uid()));
CREATE POLICY "player_profiles_admin_all" ON public.player_profiles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- recruiter_profiles: owner reads/updates own (limited); admins full
CREATE POLICY "recruiter_profiles_owner_select" ON public.recruiter_profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "recruiter_profiles_owner_insert" ON public.recruiter_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "recruiter_profiles_owner_update" ON public.recruiter_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND status = (SELECT status FROM public.recruiter_profiles WHERE user_id = auth.uid()));
CREATE POLICY "recruiter_profiles_admin_all" ON public.recruiter_profiles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- player_media: owner full; approved recruiters + admins SELECT
CREATE POLICY "player_media_owner_all" ON public.player_media FOR ALL TO authenticated
  USING (auth.uid() = player_id) WITH CHECK (auth.uid() = player_id);
CREATE POLICY "player_media_recruiter_select" ON public.player_media FOR SELECT TO authenticated
  USING (public.is_approved_recruiter(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- Also allow players to insert their own profile row (covered by owner_all, INSERT WITH CHECK)
