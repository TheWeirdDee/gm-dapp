-- GM DAPP SUPABASE SETUP SCRIPT
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create the posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    address TEXT NOT NULL,           -- Author's Stacks Address
    content TEXT DEFAULT 'Said GM!', -- Post content
    tx_id TEXT,                      -- Stacks Transaction ID
    points INT4 DEFAULT 5,           -- Points awarded
    is_pro BOOLEAN DEFAULT false,    -- Whether user was Pro at post time
    gm_count INT4 DEFAULT 0,         -- Reactions
    fire_count INT4 DEFAULT 0,
    laugh_count INT4 DEFAULT 0,
    comments_count INT4 DEFAULT 0,
    reposts_count INT4 DEFAULT 0,
    avatar_url TEXT,                 -- Cache for author's identity avatar
    media_url TEXT,                  -- URL for attached image or video
    poll_data JSONB,                 -- JSON object for poll options and status
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Add performance indexes
CREATE INDEX IF NOT EXISTS idx_posts_address ON posts(address);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- 3. Set up Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read posts
CREATE POLICY "Allow public read access" 
ON posts FOR SELECT 
TO anon 
USING (true);

-- Only authenticated users matching the address claim can insert/update their posts
CREATE POLICY "Secure post creation" 
ON posts FOR INSERT 
TO anon 
WITH CHECK (address = (current_setting('request.jwt.claims', true)::json->>'address'));

CREATE POLICY "Secure post deletion" 
ON posts FOR DELETE 
TO anon 
USING (address = (current_setting('request.jwt.claims', true)::json->>'address'));


-- 4. Create the profiles table
CREATE TABLE IF NOT EXISTS profiles (
    address TEXT PRIMARY KEY,
    username TEXT,
    bio TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Profiles Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read profiles
CREATE POLICY "Allow public read profiles" 
ON profiles FOR SELECT TO anon USING (true);

-- Only the owner can UPSERT or UPDATE their profile
CREATE POLICY "Secure profile management" 
ON profiles FOR ALL 
TO anon 
USING (address = (current_setting('request.jwt.claims', true)::json->>'address'))
WITH CHECK (address = (current_setting('request.jwt.claims', true)::json->>'address'));

-- 5. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE posts;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
