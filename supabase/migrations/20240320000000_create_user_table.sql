-- Create user table
CREATE TABLE IF NOT EXISTS public.user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    profile_image_url VARCHAR(255),
    favorite_team_id INTEGER REFERENCES public.team(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Create index for email
CREATE INDEX IF NOT EXISTS idx_user_email ON public.user(email);

-- Create index for favorite_team_id
CREATE INDEX IF NOT EXISTS idx_user_favorite_team_id ON public.user(favorite_team_id);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;

-- Policy for select (users can view all non-deleted users)
CREATE POLICY "Users can view all non-deleted users" ON public.user
    FOR SELECT
    USING (is_deleted = FALSE);

-- Policy for insert (users can only insert their own data)
CREATE POLICY "Users can insert their own data" ON public.user
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Policy for update (users can only update their own data)
CREATE POLICY "Users can update their own data" ON public.user
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy for delete (users can only soft delete their own data)
CREATE POLICY "Users can soft delete their own data" ON public.user
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND is_deleted = TRUE);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_updated_at
    BEFORE UPDATE ON public.user
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 