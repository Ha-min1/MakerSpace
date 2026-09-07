import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/client";
import {
  getKSTDateString,
  getKSTISOString,
  shiftKSTDate,
} from "@/lib/dateUtils";

export const dynamic = "force-dynamic";

/**
 * 매일 한국 시간 자정(KST 00:00:00 = UTC 15:00:00)에 실행되는 자동 점검 세션 생성 Cron 핸들러
 * Vercel Cron 또는 외부 스케줄러(GitHub Actions, Cloudflare Worker 등)에서 호출 가능합니다.
 */
export async function GET(request: Request) {
  return handleDailyCron(request);
}

export async function POST(request: Request) {
  return handleDailyCron(request);
}

async function handleDailyCron(request: Request) {
  // 1. Vercel Cron 보안 인증 (CRON_SECRET 환경변수가 설정되어 있을 경우 검증)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or missing CRON_SECRET" },
      { status: 401 }
    );
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      {
        error: "Supabase client not initialized. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      },
      { status: 500 }
    );
  }

  try {
    const todayKST = getKSTDateString();
    const yesterdayKST = shiftKSTDate(todayKST, -1);
    const nowKST = getKSTISOString();

    const types: Array<"opening" | "closing"> = ["opening", "closing"];
    const results: Array<{ type: string; status: "created" | "already_exists" | "error"; error?: string }> = [];

    // 2. 금일(KST 오늘) 오픈/마감 세션 선제 생성
    for (const type of types) {
      // 기존 세션 존재 여부 확인
      const { data: existing } = await supabase
        .from("daily_inspections")
        .select("id, inspection_date, inspection_type")
        .eq("inspection_date", todayKST)
        .eq("inspection_type", type)
        .maybeSingle();

      if (existing) {
        results.push({ type, status: "already_exists" });
      } else {
        const { error: insertError } = await supabase
          .from("daily_inspections")
          .insert({
            inspection_date: todayKST,
            inspection_type: type,
            inspector_name: "근로장학생",
            is_completed: false,
            created_at: nowKST,
            updated_at: nowKST,
          });

        if (insertError) {
          results.push({ type, status: "error", error: insertError.message });
        } else {
          results.push({ type, status: "created" });
        }
      }
    }

    // 3. 전일(KST 어제) 세션 마감 상태 감사 리포트
    const { data: yesterdaySessions } = await supabase
      .from("daily_inspections")
      .select("id, inspection_type, is_completed, completed_at, inspector_name")
      .eq("inspection_date", yesterdayKST);

    return NextResponse.json({
      ok: true,
      message: "Daily inspection session rollover executed successfully.",
      kst_today: todayKST,
      kst_yesterday: yesterdayKST,
      executed_at: nowKST,
      today_sessions: results,
      yesterday_summary: yesterdaySessions || [],
    });
  } catch (error) {
    console.error("Cron daily rollover error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 }
    );
  }
}
