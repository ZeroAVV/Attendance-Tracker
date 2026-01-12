-- Attendance Tracker Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- Lectures table
CREATE TABLE IF NOT EXISTS public.lectures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,  -- Clerk user ID
    name TEXT NOT NULL,
    course_code TEXT,
    professor TEXT,
    schedules JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_lectures INTEGER,
    start_date DATE,
    end_date DATE,
    target_percentage INTEGER,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance records table
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,  -- Clerk user ID
    lecture_id UUID REFERENCES public.lectures(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    notes TEXT,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lecture_id, date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lectures_user ON public.lectures(user_id);
CREATE INDEX IF NOT EXISTS idx_lectures_user_name ON public.lectures(user_id, name);
CREATE INDEX IF NOT EXISTS idx_attendance_user ON public.attendance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_lecture ON public.attendance_records(lecture_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_attendance_user_lecture ON public.attendance_records(user_id, lecture_id);
CREATE INDEX IF NOT EXISTS idx_attendance_user_date ON public.attendance_records(user_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_user_lecture_date ON public.attendance_records(user_id, lecture_id, date);

-- Enable RLS
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own lectures" ON public.lectures;
DROP POLICY IF EXISTS "Users can insert own lectures" ON public.lectures;
DROP POLICY IF EXISTS "Users can update own lectures" ON public.lectures;
DROP POLICY IF EXISTS "Users can delete own lectures" ON public.lectures;

DROP POLICY IF EXISTS "Users can view own attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Users can insert own attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Users can update own attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Users can delete own attendance" ON public.attendance_records;

-- RLS Policies for Lectures table
CREATE POLICY "Users can view own lectures" ON public.lectures
    FOR SELECT TO authenticated
    USING (auth.jwt()->>'sub'::text = user_id);

CREATE POLICY "Users can insert own lectures" ON public.lectures
    FOR INSERT TO authenticated
    WITH CHECK (auth.jwt()->>'sub'::text = user_id);

CREATE POLICY "Users can update own lectures" ON public.lectures
    FOR UPDATE TO authenticated
    USING (auth.jwt()->>'sub'::text = user_id)
    WITH CHECK (auth.jwt()->>'sub'::text = user_id);

CREATE POLICY "Users can delete own lectures" ON public.lectures
    FOR DELETE TO authenticated
    USING (auth.jwt()->>'sub'::text = user_id);

-- RLS Policies for Attendance table
CREATE POLICY "Users can view own attendance" ON public.attendance_records
    FOR SELECT TO authenticated
    USING (auth.jwt()->>'sub'::text = user_id);

CREATE POLICY "Users can insert own attendance" ON public.attendance_records
    FOR INSERT TO authenticated
    WITH CHECK (auth.jwt()->>'sub'::text = user_id);

CREATE POLICY "Users can update own attendance" ON public.attendance_records
    FOR UPDATE TO authenticated
    USING (auth.jwt()->>'sub'::text = user_id)
    WITH CHECK (auth.jwt()->>'sub'::text = user_id);

CREATE POLICY "Users can delete own attendance" ON public.attendance_records
    FOR DELETE TO authenticated
    USING (auth.jwt()->>'sub'::text = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
DROP TRIGGER IF EXISTS update_lectures_updated_at ON public.lectures;
CREATE TRIGGER update_lectures_updated_at
    BEFORE UPDATE ON public.lectures
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_attendance_records_updated_at ON public.attendance_records;
CREATE TRIGGER update_attendance_records_updated_at
    BEFORE UPDATE ON public.attendance_records
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
