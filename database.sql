CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('video', 'audio')) NOT NULL,
  file_url TEXT NOT NULL, -- S3 key or CDN URL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE media_view_logs (
  id BIGSERIAL PRIMARY KEY,
  media_id UUID REFERENCES media_assets(id) ON DELETE CASCADE,
  viewed_by_ip INET,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);
