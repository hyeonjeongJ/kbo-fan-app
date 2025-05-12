-- Migrate existing auth users to user table
INSERT INTO public.user (id, email, nickname, created_at, updated_at)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'nickname', split_part(email, '@', 1)) as nickname,
    created_at,
    updated_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user)
ON CONFLICT (id) DO NOTHING; 