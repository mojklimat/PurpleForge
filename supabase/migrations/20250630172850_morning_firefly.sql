/*
  # Create early access signups table

  1. New Tables
    - `early_access_signups`
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `created_at` (timestamp with timezone, default now())

  2. Security
    - Enable RLS on `early_access_signups` table
    - Add policy for public insert access (for signup form)
    - Add policy for authenticated users to read their own data

  3. Indexes
    - Add index on email for faster lookups
    - Add index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS early_access_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE early_access_signups ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for the signup form)
CREATE POLICY "Anyone can sign up for early access"
  ON early_access_signups
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all signups (for admin purposes)
CREATE POLICY "Authenticated users can read early access signups"
  ON early_access_signups
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS early_access_signups_email_idx ON early_access_signups(email);
CREATE INDEX IF NOT EXISTS early_access_signups_created_at_idx ON early_access_signups(created_at DESC);