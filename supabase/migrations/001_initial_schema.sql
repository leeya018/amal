-- ============================================
-- Amal App - Initial Schema (Hebrew-only MVP)
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES
-- ============================================
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email) VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- RECORDINGS  (server-signed with HMAC)
-- ============================================
CREATE TABLE public.recordings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_path   TEXT NOT NULL,
  lat         DOUBLE PRECISION,
  long        DOUBLE PRECISION,
  sha256      TEXT,
  signature   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recordings_user_id    ON public.recordings(user_id);
CREATE INDEX idx_recordings_created_at ON public.recordings(created_at DESC);

-- ============================================
-- CHATS
-- ============================================
CREATE TABLE public.chats (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_text  TEXT NOT NULL,
  sender        TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chats_user_id    ON public.chats(user_id);
CREATE INDEX idx_chats_created_at ON public.chats(created_at ASC);

-- ============================================
-- TODOS
-- ============================================
CREATE TABLE public.todos (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  due_date     DATE,
  completed    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_todos_user_id  ON public.todos(user_id);
CREATE INDEX idx_todos_due_date ON public.todos(due_date);

CREATE TRIGGER set_todos_updated_at
  BEFORE UPDATE ON public.todos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos      ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "recordings_select_own" ON public.recordings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "recordings_insert_own" ON public.recordings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "recordings_delete_own" ON public.recordings
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "chats_select_own" ON public.chats
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "chats_insert_own" ON public.chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "todos_all_own" ON public.todos
  FOR ALL USING (auth.uid() = user_id);
