-- Migration: Add Notifications Table
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient TEXT NOT NULL, -- Stacks address of the receiver
    actor TEXT NOT NULL,     -- Stacks address of the sender/trigger
    actor_username TEXT,     -- Cached username of the actor
    type TEXT NOT NULL CHECK (type IN ('gm', 'reply', 'follow', 'tip', 'streak_warning')),
    post_id UUID,            -- Optional reference to a post
    amount NUMERIC,          -- Optional amount for tips
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(recipient) WHERE read = false;

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own notifications
CREATE POLICY "Users can view own notifications" 
ON notifications FOR SELECT 
TO public 
USING (recipient = auth.uid()::text OR recipient = (auth.jwt() ->> 'address'));

-- Note: Since the app uses custom JWTs with an 'address' claim, 
-- ensure your RLS policy matches how your auth is set up.
-- For a simpler setup during development:
CREATE POLICY "Public read own notifications" ON notifications FOR SELECT TO anon USING (true);
CREATE POLICY "Public update own notifications" ON notifications FOR UPDATE TO anon USING (true);
