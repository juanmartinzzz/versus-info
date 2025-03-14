  -- Drop table if it exists
  DROP TABLE IF EXISTS public.answers;

  -- Create table
  CREATE TABLE IF NOT EXISTS public.answers (
    id SERIAL PRIMARY KEY,
    local_id VARCHAR(255) NOT NULL,
    relevant_date DATE NOT NULL,
    score INTEGER,
    questions_data JSONB,
    ip_address TEXT,
    browser_info TEXT,
    geo_language TEXT,
    geo_country TEXT,
    geo_region TEXT,
    geo_city TEXT,
    geo_latitude TEXT,
    geo_longitude TEXT,
    geo_timezone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
  );

  -- Create a unique index on local_id and relevant_date columns
  CREATE UNIQUE INDEX IF NOT EXISTS answers_local_id_relevant_date_idx ON public.answers (local_id, relevant_date);

  -- Enable Row Level Security
  -- ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

  -- -- Create policies for Row Level Security
  -- -- Allow users to select their own plans
  -- CREATE POLICY "Users can view their own plans"
  --   ON public.answers
  --   FOR SELECT
  --   USING (auth.uid() = user_id);

  -- -- Allow users to insert their own plans
  -- CREATE POLICY "Users can insert their own plans"
  --   ON public.answers
  --   FOR INSERT
  --   WITH CHECK (auth.uid() = user_id);

  -- -- Allow users to update their own plans
  -- CREATE POLICY "Users can update their own plans"
  --   ON public.answers
  --   FOR UPDATE
  --   USING (auth.uid() = user_id);

  -- -- Allow users to delete their own plans
  -- CREATE POLICY "Users can delete their own plans"
  --   ON public.answers
  --   FOR DELETE
  --   USING (auth.uid() = user_id);

  -- -- Create an index on user_id for faster queries
  -- CREATE INDEX answers_user_id_idx ON public.answers (user_id);

  -- Add a function to automatically update the updated_at timestamp
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  -- Create a trigger to call the function before update
  CREATE TRIGGER update_answers_updated_at
  BEFORE UPDATE ON public.answers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();