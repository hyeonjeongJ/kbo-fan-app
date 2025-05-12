-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  logo_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert initial team data
INSERT INTO teams (name, logo_url) VALUES
  ('두산 베어스', '/images/teams/doosan.png'),
  ('LG 트윈스', '/images/teams/lg.png'),
  ('키움 히어로즈', '/images/teams/kiwoom.png'),
  ('SSG 랜더스', '/images/teams/ssg.png'),
  ('NC 다이노스', '/images/teams/nc.png'),
  ('KIA 타이거즈', '/images/teams/kia.png'),
  ('롯데 자이언츠', '/images/teams/lotte.png'),
  ('삼성 라이온즈', '/images/teams/samsung.png'),
  ('한화 이글스', '/images/teams/hanwha.png'),
  ('KT 위즈', '/images/teams/kt.png')
ON CONFLICT (name) DO NOTHING; 