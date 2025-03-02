-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  size BIGINT NOT NULL,
  path TEXT NOT NULL,
  url TEXT NOT NULL,
  user_id TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create file_shares table
CREATE TABLE IF NOT EXISTS file_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  access_token TEXT NOT NULL UNIQUE,
  expiry_date TIMESTAMP WITH TIME ZONE,
  password_protected BOOLEAN DEFAULT FALSE,
  prevent_download BOOLEAN DEFAULT TRUE,
  track_views BOOLEAN DEFAULT TRUE,
  watermark_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create file_views table
CREATE TABLE IF NOT EXISTS file_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  share_id UUID REFERENCES file_shares(id) ON DELETE CASCADE,
  viewer_ip TEXT,
  viewer_device TEXT,
  viewer_browser TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stored procedures for table creation (used in the app)
CREATE OR REPLACE FUNCTION create_files_table()
RETURNS VOID AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    size BIGINT NOT NULL,
    path TEXT NOT NULL,
    url TEXT NOT NULL,
    user_id TEXT NOT NULL,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_file_shares_table()
RETURNS VOID AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS file_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID REFERENCES files(id) ON DELETE CASCADE,
    recipient_email TEXT NOT NULL,
    access_token TEXT NOT NULL UNIQUE,
    expiry_date TIMESTAMP WITH TIME ZONE,
    password_protected BOOLEAN DEFAULT FALSE,
    prevent_download BOOLEAN DEFAULT TRUE,
    track_views BOOLEAN DEFAULT TRUE,
    watermark_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_file_views_table()
RETURNS VOID AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS file_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    share_id UUID REFERENCES file_shares(id) ON DELETE CASCADE,
    viewer_ip TEXT,
    viewer_device TEXT,
    viewer_browser TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Create storage bucket for files
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
