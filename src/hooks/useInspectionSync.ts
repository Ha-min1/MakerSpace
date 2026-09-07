"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { DailyInspection, InspectionCheck, InspectionType } from "@/lib/supabase/types";
import {
  getKSTDateString,
  getKSTISOString,
  getTimeUntilNextKSTMidnight,
  shiftKSTDate,
} from "@/lib/dateUtils";

interface UseInspectionSyncProps {
  type?: InspectionType;
  totalSteps?: number;
  initialDate?: string;
}

export type ConnectionStatus = "connected" | "connecting" | "local_only" | "error";

const inspectorKey = "ku_inspector_name";

export function useInspectionSync({
  type = "opening",
  totalSteps = 24,
  initialDate,
}: UseInspectionSyncProps = {}) {
  // 1. KST 오늘 날짜 및 선택된 점검 일자 상태
  const [todayKST, setTodayKST] = useState<string>(() => getKSTDateString());
  const [selectedDate, setSelectedDateState] = useState<string>(() => initialDate || getKSTDateString());
  const isToday = selectedDate === todayKST;

  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [inspectorName, setInspectorNameState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem(inspectorKey) || "근로장학생";
      } catch {
        return "근로장학생";
      }
    }
    return "근로장학생";
  });

  const [session, setSession] = useState<DailyInspection | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(() => {
    return getSupabaseClient() ? "connecting" : "local_only";
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [checkDetails, setCheckDetails] = useState<Record<number, { checkedBy?: string | null; checkedAt?: string }>>({});

  const isMountedRef = useRef<boolean>(false);
  const localKey = `ku_makerspace_${type}_checks_${selectedDate}`;
  const sessionId = session?.id;

  // 2. 자정(KST 00:00:00) 자동 롤오버 및 주기적 날짜 갱신
  useEffect(() => {
    let midnightTimer: NodeJS.Timeout | null = null;
    let intervalTimer: NodeJS.Timeout | null = null;

    function handleMidnightRollover() {
      const newToday = getKSTDateString();
      setTodayKST((prevToday) => {
        if (prevToday !== newToday) {
          // 사용자가 '오늘'을 보고 있었다면 자동으로 새 오늘 날짜로 전환
          setSelectedDateState((prevSelected) =>
            prevSelected === prevToday ? newToday : prevSelected
          );
          return newToday;
        }
        return prevToday;
      });

      // 다음 자정 타이머 재설정
      const nextDelay = getTimeUntilNextKSTMidnight();
      midnightTimer = setTimeout(handleMidnightRollover, nextDelay);
    }

    // 초기 다음 자정 타이머 실행
    const delay = getTimeUntilNextKSTMidnight();
    midnightTimer = setTimeout(handleMidnightRollover, delay);

    // 슬립/화면 잠금 해제 대비 60초마다 KST 날짜 체크
    intervalTimer = setInterval(() => {
      const currentToday = getKSTDateString();
      setTodayKST((prev) => {
        if (prev !== currentToday) {
          setSelectedDateState((prevSelected) =>
            prevSelected === prev ? currentToday : prevSelected
          );
          return currentToday;
        }
        return prev;
      });
    }, 60000);

    return () => {
      if (midnightTimer) clearTimeout(midnightTimer);
      if (intervalTimer) clearInterval(intervalTimer);
    };
  }, []);

  // 점검자 이름 변경 핸들러
  const setInspectorName = useCallback(
    (name: string) => {
      setInspectorNameState(name);
      try {
        localStorage.setItem(inspectorKey, name);
      } catch {
        // ignore
      }

      const supabase = getSupabaseClient();
      if (supabase && sessionId && isToday) {
        const dbName = name.trim() || "근로장학생";
        supabase
          .from("daily_inspections")
          .update({
            inspector_name: dbName,
            updated_at: getKSTISOString(),
          })
          .eq("id", sessionId)
          .then();
      }
    },
    [isToday, sessionId]
  );

  // 3. 세션 및 체크 데이터 로딩 (선택된 날짜 기준)
  useEffect(() => {
    isMountedRef.current = true;
    const supabase = getSupabaseClient();

    function loadFromLocalStorage() {
      Promise.resolve().then(() => {
        if (!isMountedRef.current) return;
        try {
          const saved = localStorage.getItem(localKey);
          setCompletedIds(saved ? JSON.parse(saved) : []);
        } catch {
          setCompletedIds([]);
        }
        setIsLoading(false);
      });
    }

    // Supabase 환경변수가 없는 경우: 순수 LocalStorage 모드로 동작
    if (!supabase) {
      loadFromLocalStorage();
      return;
    }

    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function initSupabaseData() {
      if (!supabase) return;
      setIsLoading(true);

      try {
        // 해당 일자 및 유형의 세션 조회
        const { data: existingSessions, error: sessionError } = await supabase
          .from("daily_inspections")
          .select("*")
          .eq("inspection_date", selectedDate)
          .eq("inspection_type", type)
          .limit(1);

        if (sessionError) {
          console.warn("Supabase session load warning:", sessionError.message);
          setConnectionStatus("error");
          loadFromLocalStorage();
          return;
        }

        let currentSession: DailyInspection | null = null;

        if (existingSessions && existingSessions.length > 0) {
          currentSession = existingSessions[0] as DailyInspection;
        } else if (isToday) {
          // 당일이고 아직 세션이 없으면 자동 생성 (KST 기준)
          const currentSavedName = localStorage.getItem(inspectorKey) || "근로장학생";
          const nowKST = getKSTISOString();

          const { data: newSession, error: createError } = await supabase
            .from("daily_inspections")
            .insert({
              inspection_date: selectedDate,
              inspection_type: type,
              inspector_name: currentSavedName,
              is_completed: false,
              created_at: nowKST,
              updated_at: nowKST,
            })
            .select()
            .single();

          if (createError) {
            console.warn("Failed to create today session:", createError.message);
            setConnectionStatus("error");
            loadFromLocalStorage();
            return;
          }
          currentSession = newSession as DailyInspection;
        } else {
          // 과거 또는 미래 날짜인데 세션이 없는 경우: 기록 없음
          currentSession = null;
        }

        if (!isMountedRef.current) return;

        setSession(currentSession);
        if (currentSession?.inspector_name) {
          setInspectorNameState(currentSession.inspector_name);
        }

        if (!currentSession) {
          // 해당 날짜 세션이 없으면 체크 목록 비움
          setCompletedIds([]);
          setCheckDetails({});
          setConnectionStatus("connected");
          setIsLoading(false);
          return;
        }

        // 해당 세션의 체크 목록 조회
        const { data: checks, error: checksError } = await supabase
          .from("inspection_checks")
          .select("*")
          .eq("inspection_id", currentSession.id);

        if (checksError) {
          console.warn("Failed to load checks:", checksError.message);
        } else if (checks) {
          const checkedSteps: number[] = [];
          const details: Record<number, { checkedBy?: string | null; checkedAt?: string }> = {};

          checks.forEach((c) => {
            if (c.is_checked) {
              checkedSteps.push(c.step_id);
            }
            details[c.step_id] = {
              checkedBy: c.checked_by,
              checkedAt: c.checked_at,
            };
          });

          setCompletedIds(checkedSteps);
          setCheckDetails(details);

          // 로컬스토리지에도 당일 백업 동기화
          if (isToday) {
            try {
              localStorage.setItem(localKey, JSON.stringify(checkedSteps));
            } catch {
              // ignore
            }
          }
        }

        setConnectionStatus("connected");

        // 4. Supabase Realtime 채널 구독
        channel = supabase
          .channel(`inspection-${currentSession.id}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "inspection_checks",
              filter: `inspection_id=eq.${currentSession.id}`,
            },
            (payload) => {
              const row = payload.new as InspectionCheck;
              if (!row || typeof row.step_id !== "number") return;

              setCompletedIds((prev) => {
                let next: number[];
                if (row.is_checked) {
                  next = prev.includes(row.step_id) ? prev : [...prev, row.step_id];
                } else {
                  next = prev.filter((id) => id !== row.step_id);
                }
                if (isToday) {
                  try {
                    localStorage.setItem(localKey, JSON.stringify(next));
                  } catch {
                    // ignore
                  }
                }
                return next;
              });

              setCheckDetails((prev) => ({
                ...prev,
                [row.step_id]: {
                  checkedBy: row.checked_by,
                  checkedAt: row.checked_at,
                },
              }));
            }
          )
          .subscribe();
      } catch (err) {
        console.error("Supabase sync initialization error:", err);
        setConnectionStatus("error");
        loadFromLocalStorage();
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    }

    initSupabaseData();

    return () => {
      isMountedRef.current = false;
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [type, selectedDate, isToday, localKey]);

  // 5. 체크 토글 핸들러 (과거 기록 보호 및 KST 시간 저장)
  const toggleStep = useCallback(
    async (stepId: number) => {
      if (!isToday) {
        alert("과거 또는 미래 날짜의 점검 기록은 수정할 수 없습니다. (보존 모드)");
        return;
      }

      const isCurrentlyCompleted = completedIds.includes(stepId);
      const nextCompleted = !isCurrentlyCompleted;
      const nowKST = getKSTISOString();

      // 1) 낙관적 즉시 업데이트
      const nextIds = nextCompleted
        ? [...completedIds, stepId]
        : completedIds.filter((id) => id !== stepId);

      setCompletedIds(nextIds);
      try {
        localStorage.setItem(localKey, JSON.stringify(nextIds));
      } catch {
        // ignore
      }

      const effectiveInspector = inspectorName.trim() || "근로장학생";

      setCheckDetails((prev) => ({
        ...prev,
        [stepId]: {
          checkedBy: nextCompleted ? effectiveInspector : null,
          checkedAt: nextCompleted ? nowKST : undefined,
        },
      }));

      // 2) Supabase 비동기 동기화 (KST 타임스탬프 저장)
      const supabase = getSupabaseClient();
      if (!supabase || !sessionId) return;

      try {
        const { error } = await supabase.from("inspection_checks").upsert(
          {
            inspection_id: sessionId,
            step_id: stepId,
            is_checked: nextCompleted,
            checked_at: nowKST,
            checked_by: nextCompleted ? effectiveInspector : null,
          },
          { onConflict: "inspection_id,step_id" }
        );

        if (error) {
          console.error("Failed to sync step to Supabase:", error.message);
          // 에러 시 롤백
          setCompletedIds(completedIds);
          try {
            localStorage.setItem(localKey, JSON.stringify(completedIds));
          } catch {
            // ignore
          }
          return;
        }

        // 전체 완료 여부 체크 및 업데이트 (KST 시간 반영)
        const allDone = nextIds.length >= totalSteps;
        if (session && allDone !== session.is_completed) {
          await supabase
            .from("daily_inspections")
            .update({
              is_completed: allDone,
              completed_at: allDone ? nowKST : null,
              updated_at: nowKST,
            })
            .eq("id", sessionId);
        }
      } catch (err) {
        console.error("Supabase upsert error:", err);
      }
    },
    [completedIds, inspectorName, isToday, localKey, session, sessionId, totalSteps]
  );

  // 6. 당일 전체 초기화 핸들러 (오직 당일 세션만 초기화 허용)
  const resetChecks = useCallback(async () => {
    if (!isToday) {
      alert("당일(오늘) 점검 리스트만 초기화할 수 있습니다. 과거 날짜의 기록은 안전하게 보존됩니다.");
      return;
    }

    if (
      !confirm(
        `오늘(${selectedDate}) 점검 체크 리스트를 초기화하시겠습니까?\n(이전 날짜의 누적 출퇴근 기록은 안전하게 DB에 보존됩니다)`
      )
    ) {
      return;
    }

    setCompletedIds([]);
    setCheckDetails({});
    try {
      localStorage.removeItem(localKey);
    } catch {
      // ignore
    }

    const supabase = getSupabaseClient();
    if (!supabase || !sessionId) return;

    try {
      const nowKST = getKSTISOString();

      await supabase
        .from("inspection_checks")
        .update({
          is_checked: false,
          checked_by: null,
          checked_at: nowKST,
        })
        .eq("inspection_id", sessionId);

      await supabase
        .from("daily_inspections")
        .update({
          is_completed: false,
          completed_at: null,
          updated_at: nowKST,
        })
        .eq("id", sessionId);
    } catch (err) {
      console.error("Failed to reset Supabase checks:", err);
    }
  }, [isToday, localKey, selectedDate, sessionId]);

  // 7. 날짜 네비게이션 헬퍼
  const setSelectedDate = useCallback((dateStr: string) => {
    setSelectedDateState(dateStr);
  }, []);

  const goToToday = useCallback(() => {
    setSelectedDateState(getKSTDateString());
  }, []);

  const goToPrevDay = useCallback(() => {
    setSelectedDateState((prev) => shiftKSTDate(prev, -1));
  }, []);

  const goToNextDay = useCallback(() => {
    setSelectedDateState((prev) => shiftKSTDate(prev, 1));
  }, []);

  return {
    completedIds,
    checkDetails,
    inspectorName,
    setInspectorName,
    session,
    connectionStatus,
    isLoading,
    toggleStep,
    resetChecks,
    // 날짜 상태 및 핸들러
    todayKST,
    selectedDate,
    setSelectedDate,
    isToday,
    goToToday,
    goToPrevDay,
    goToNextDay,
  };
}
