-- Create mate_post table
CREATE TABLE IF NOT EXISTS public.mate_post (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.user(id) NOT NULL,
    team_id INTEGER REFERENCES public.team(id) NOT NULL,
    game_date TIMESTAMP WITH TIME ZONE NOT NULL,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    max_participants INTEGER NOT NULL,
    current_participants INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Create mate_comment table
CREATE TABLE IF NOT EXISTS public.mate_comment (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES public.mate_post(id) NOT NULL,
    user_id UUID REFERENCES public.user(id) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_mate_post_team_id ON public.mate_post(team_id);
CREATE INDEX IF NOT EXISTS idx_mate_post_user_id ON public.mate_post(user_id);
CREATE INDEX IF NOT EXISTS idx_mate_post_game_date ON public.mate_post(game_date);
CREATE INDEX IF NOT EXISTS idx_mate_comment_post_id ON public.mate_comment(post_id);
CREATE INDEX IF NOT EXISTS idx_mate_comment_user_id ON public.mate_comment(user_id);

-- Enable RLS
ALTER TABLE public.mate_post ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mate_comment ENABLE ROW LEVEL SECURITY;

-- Policies for mate_post
CREATE POLICY "Anyone can view non-deleted posts" ON public.mate_post
    FOR SELECT
    USING (is_deleted = FALSE);

CREATE POLICY "Users can create posts" ON public.mate_post
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON public.mate_post
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can soft delete their own posts" ON public.mate_post
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id AND is_deleted = TRUE);

-- Policies for mate_comment
CREATE POLICY "Anyone can view non-deleted comments" ON public.mate_comment
    FOR SELECT
    USING (is_deleted = FALSE);

CREATE POLICY "Users can create comments" ON public.mate_comment
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.mate_comment
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can soft delete their own comments" ON public.mate_comment
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id AND is_deleted = TRUE);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_mate_post_updated_at
    BEFORE UPDATE ON public.mate_post
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mate_comment_updated_at
    BEFORE UPDATE ON public.mate_comment
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 