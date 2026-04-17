-- Migration: Add Follows and Profile Metadata
-- Run this in the Supabase SQL Editor

-- 1. Update Profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website TEXT;

-- 2. Create Follows table (On-Chain Index)
CREATE TABLE IF NOT EXISTS follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_address TEXT NOT NULL,
    following_address TEXT NOT NULL,
    tx_id TEXT, -- Stacks Transaction ID
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed')),
    created_at TIMESTAMPTZ DEFAULT now(),
    -- Constraint: Prevent duplicate follows
    UNIQUE(follower_address, following_address)
);

-- 3. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_address);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_address);

-- 4. Enable RLS
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read follows" ON follows FOR SELECT TO anon USING (true);
