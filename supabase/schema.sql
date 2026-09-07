-- ====================================================================
-- 건국대학교 메이커스페이스 자가점검(Self-Check) Supabase 스키마 (KST 표준화)
-- ====================================================================
-- 특징:
-- 1. 모든 날짜 및 타임스탬프의 기본값을 대한민국 표준시(Asia/Seoul, UTC+9)로 처리
-- 2. 일자별(inspection_date) 및 유형별(opening/closing) 고유 세션으로 데이터 누적 보장
-- 3. 실시간 Realtime 동기화 및 RLS 보안 정책 내장
-- ====================================================================

-- 1. 일별 점검 세션 테이블 (Daily Inspections)
CREATE TABLE IF NOT EXISTS public.daily_inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- 기본값을 한국 표준시(KST) 당일 날짜로 설정
    inspection_date DATE NOT NULL DEFAULT ((now() AT TIME ZONE 'Asia/Seoul')::date),
    inspection_type TEXT NOT NULL CHECK (inspection_type IN ('opening', 'closing')),
    
    -- 기본 점검자 이름 (공란 허용, 기본값: '근로장학생')
    inspector_name TEXT DEFAULT '근로장학생',
    
    -- 추후 Supabase Auth 연동을 위한 외래키 (선택적)
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT (now() AT TIME ZONE 'Asia/Seoul'),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT (now() AT TIME ZONE 'Asia/Seoul'),

    -- 하루에 동일한 유형(오픈/마감)의 세션은 하나만 존재하도록 유니크 제약
    CONSTRAINT uq_daily_inspection UNIQUE (inspection_date, inspection_type)
);

-- 2. 세부 스텝 체크 상태 테이블 (Inspection Checks)
CREATE TABLE IF NOT EXISTS public.inspection_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_id UUID NOT NULL REFERENCES public.daily_inspections(id) ON DELETE CASCADE,
    step_id INTEGER NOT NULL CHECK (step_id >= 1 AND step_id <= 100),
    is_checked BOOLEAN NOT NULL DEFAULT FALSE,
    checked_at TIMESTAMPTZ NOT NULL DEFAULT (now() AT TIME ZONE 'Asia/Seoul'),
    
    -- 해당 항목을 체크한 사람의 이름 (공란 허용, 기본값: '근로장학생')
    checked_by TEXT DEFAULT '근로장학생',
    
    -- 추후 Supabase Auth 연동을 위한 외래키 (선택적)
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- 한 세션 내에서 스텝 번호는 유일해야 함
    CONSTRAINT uq_inspection_step UNIQUE (inspection_id, step_id)
);

-- 3. 인덱스 생성 (조회 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_daily_inspections_date ON public.daily_inspections (inspection_date, inspection_type);
CREATE INDEX IF NOT EXISTS idx_inspection_checks_session ON public.inspection_checks (inspection_id);

-- 4. 관리자용 일자별 누적 현황 조회 뷰 (KST 포맷팅)
CREATE OR REPLACE VIEW public.v_daily_inspection_summary AS
SELECT 
    d.id AS session_id,
    d.inspection_date,
    d.inspection_type,
    d.inspector_name,
    d.is_completed,
    to_char(d.completed_at AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD HH24:MI:SS') AS completed_at_kst,
    to_char(d.created_at AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD HH24:MI:SS') AS created_at_kst,
    COUNT(c.id) FILTER (WHERE c.is_checked = true) AS checked_count,
    COUNT(c.id) AS total_step_records
FROM public.daily_inspections d
LEFT JOIN public.inspection_checks c ON d.id = c.inspection_id
GROUP BY d.id, d.inspection_date, d.inspection_type, d.inspector_name, d.is_completed, d.completed_at, d.created_at
ORDER BY d.inspection_date DESC, d.inspection_type ASC;

-- 5. 실시간 동기화(Realtime) 및 복제 모드 설정
ALTER TABLE public.daily_inspections REPLICA IDENTITY FULL;
ALTER TABLE public.inspection_checks REPLICA IDENTITY FULL;

-- Supabase Realtime 게시(Publication)에 테이블 추가
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'daily_inspections'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_inspections;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'inspection_checks'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.inspection_checks;
  END IF;
END $$;

-- 6. Row Level Security (RLS) 보안 정책 설정
ALTER TABLE public.daily_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_checks ENABLE ROW LEVEL SECURITY;

-- 기존 정책 충돌 방지 및 신규 정책 등록
DROP POLICY IF EXISTS "Allow public read access on daily_inspections" ON public.daily_inspections;
CREATE POLICY "Allow public read access on daily_inspections"
ON public.daily_inspections FOR SELECT TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Allow public insert on daily_inspections" ON public.daily_inspections;
CREATE POLICY "Allow public insert on daily_inspections"
ON public.daily_inspections FOR INSERT TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on daily_inspections" ON public.daily_inspections;
CREATE POLICY "Allow public update on daily_inspections"
ON public.daily_inspections FOR UPDATE TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on daily_inspections" ON public.daily_inspections;
CREATE POLICY "Allow public delete on daily_inspections"
ON public.daily_inspections FOR DELETE TO anon, authenticated
USING (true);

-- 세부 체크 항목 정책
DROP POLICY IF EXISTS "Allow public read access on inspection_checks" ON public.inspection_checks;
CREATE POLICY "Allow public read access on inspection_checks"
ON public.inspection_checks FOR SELECT TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Allow public insert on inspection_checks" ON public.inspection_checks;
CREATE POLICY "Allow public insert on inspection_checks"
ON public.inspection_checks FOR INSERT TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on inspection_checks" ON public.inspection_checks;
CREATE POLICY "Allow public update on inspection_checks"
ON public.inspection_checks FOR UPDATE TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on inspection_checks" ON public.inspection_checks;
CREATE POLICY "Allow public delete on inspection_checks"
ON public.inspection_checks FOR DELETE TO anon, authenticated
USING (true);
