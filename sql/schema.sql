-- Corrections table
CREATE TABLE corrections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  candidate_slug TEXT NOT NULL,
  candidate_name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  correction_text TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  url_context TEXT
);

-- Create index on candidate_slug for faster queries
CREATE INDEX corrections_candidate_slug_idx ON corrections(candidate_slug);
CREATE INDEX corrections_status_idx ON corrections(status);
CREATE INDEX corrections_created_at_idx ON corrections(created_at DESC);

-- Page views tracking (for analytics)
CREATE TABLE page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  visitor_id TEXT,
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT
);

CREATE INDEX page_views_visitor_id_idx ON page_views(visitor_id);
CREATE INDEX page_views_created_at_idx ON page_views(created_at DESC);

-- Candidate views tracking (for analytics)
CREATE TABLE candidate_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_slug TEXT PRIMARY KEY,
  candidate_name TEXT NOT NULL,
  view_count INTEGER DEFAULT 0,
  last_viewed TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row Level Security) for security
ALTER TABLE corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_views ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts to corrections (for public form)
CREATE POLICY "Allow anonymous inserts to corrections"
  ON corrections
  FOR INSERT
  WITH CHECK (true);

-- Allow anonymous inserts to page_views
CREATE POLICY "Allow anonymous inserts to page_views"
  ON page_views
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to view all data
CREATE POLICY "Allow authenticated to read corrections"
  ON corrections
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to read page_views"
  ON page_views
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to read candidate_views"
  ON candidate_views
  FOR SELECT
  USING (auth.role() = 'authenticated');
