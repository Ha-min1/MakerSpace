-- ====================================================================
-- 건국대학교 메이커스페이스 일일 자가점검 pg_cron 스케줄러 설정 가이드
-- ====================================================================
-- 목적: 매일 대한민국 표준시(KST) 자정(00:00, UTC 15:00)에 자동으로
--       당일의 오픈/마감 점검 세션을 생성하여 출퇴근 내역이 안전하게 누적되도록 함.
--
-- 적용 방법:
-- Supabase 대시보드 > SQL Editor 에서 본 쿼리를 실행하시면 됩니다.
-- ====================================================================

-- 1. pg_cron 확장 활성화 (Supabase Postgres 기본 지원)
CREATE EXTENSION IF NOT EXISTS pg_cron;
GRANT USAGE ON SCHEMA cron TO postgres;

-- 2. 매일 자정에 실행할 저장 프로시저(함수) 정의
CREATE OR REPLACE FUNCTION public.create_daily_inspection_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    today_kst DATE;
    now_kst TIMESTAMPTZ;
BEGIN
    -- 현재 대한민국 표준시(KST, UTC+9) 기준 날짜 및 시각 산출
    today_kst := (now() AT TIME ZONE 'Asia/Seoul')::date;
    now_kst := (now() AT TIME ZONE 'Asia/Seoul');

    -- 오픈 자가점검 당일 세션 선제 생성 (이미 존재하면 무시)
    INSERT INTO public.daily_inspections (
        inspection_date,
        inspection_type,
        inspector_name,
        is_completed,
        created_at,
        updated_at
    )
    VALUES (
        today_kst,
        'opening',
        '근로장학생',
        false,
        now_kst,
        now_kst
    )
    ON CONFLICT (inspection_date, inspection_type) DO NOTHING;

    -- 마감 자가점검 당일 세션 선제 생성 (이미 존재하면 무시)
    INSERT INTO public.daily_inspections (
        inspection_date,
        inspection_type,
        inspector_name,
        is_completed,
        created_at,
        updated_at
    )
    VALUES (
        today_kst,
        'closing',
        '근로장학생',
        false,
        now_kst,
        now_kst
    )
    ON CONFLICT (inspection_date, inspection_type) DO NOTHING;

    RAISE NOTICE 'Daily inspection sessions initialized for KST date: %', today_kst;
END;
$$;

-- 3. 매일 한국 시간 자정(00:00 KST = UTC 15:00)에 실행되는 크론 잡 등록
-- cron 문법: 분 시 일 월 요일 (UTC 기준이므로 0 15 * * * = KST 00:00)
SELECT cron.unschedule('daily-inspection-rollover') 
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'daily-inspection-rollover');

SELECT cron.schedule(
    'daily-inspection-rollover',
    '0 15 * * *',
    'SELECT public.create_daily_inspection_sessions();'
);

-- 4. 등록된 크론 작업 확인 쿼리
-- SELECT * FROM cron.job;

-- 5. 크론 실행 이력 로그 확인 쿼리
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
