-- Drop the survival_plans table if it exists
DROP TABLE IF EXISTS public.questions;

-- Create the survival_plans table
CREATE TABLE IF NOT EXISTS public.questions (
  id SERIAL PRIMARY KEY,
  relevant_date DATE NOT NULL,
  items JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create a unique index on the relevant_date column
CREATE UNIQUE INDEX IF NOT EXISTS questions_relevant_date_idx ON public.questions (relevant_date);

-- Enable Row Level Security
-- ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- -- Create policies for Row Level Security
-- -- Allow users to select their own plans
-- CREATE POLICY "Users can view their own plans"
--   ON public.questions
--   FOR SELECT
--   USING (auth.uid() = user_id);

-- -- Allow users to insert their own plans
-- CREATE POLICY "Users can insert their own plans"
--   ON public.questions
--   FOR INSERT
--   WITH CHECK (auth.uid() = user_id);

-- -- Allow users to update their own plans
-- CREATE POLICY "Users can update their own plans"
--   ON public.questions
--   FOR UPDATE
--   USING (auth.uid() = user_id);

-- -- Allow users to delete their own plans
-- CREATE POLICY "Users can delete their own plans"
--   ON public.questions
--   FOR DELETE
--   USING (auth.uid() = user_id);

-- -- Create an index on user_id for faster queries
-- CREATE INDEX questions_user_id_idx ON public.questions (user_id);

-- Add a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before update
CREATE TRIGGER update_questions_updated_at
BEFORE UPDATE ON public.questions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();