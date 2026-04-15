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

-- Only allow SELECT for public read.
-- ALL mutations (Insert/Update/Delete) must flow through the Backend Proxy via service_role.
-- This ensures that anonymous users cannot spoof identity or spam the database.
CREATE POLICY "Public read only" 
ON posts FOR SELECT 
TO anon 
USING (true);

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

-- 5. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE posts;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
