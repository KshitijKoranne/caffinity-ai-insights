
-- This SQL will be executed manually by the user
CREATE TABLE IF NOT EXISTS public.caffeine_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  beverage_name TEXT NOT NULL,
  caffeine_amount INTEGER NOT NULL,
  serving_size TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Row Level Security
ALTER TABLE public.caffeine_entries ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own entries"
  ON public.caffeine_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own entries"
  ON public.caffeine_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries"
  ON public.caffeine_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries"
  ON public.caffeine_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Create an index for faster queries
CREATE INDEX caffeine_entries_user_id_idx ON public.caffeine_entries (user_id);
CREATE INDEX caffeine_entries_created_at_idx ON public.caffeine_entries (created_at);
