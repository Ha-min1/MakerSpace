"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { DailyInspection, InspectionCheck, InspectionType } from "@/lib/supabase/types";

interface UseInspectionSyncProps {
  type?: InspectionType;
  totalSteps?: number;
}

export type ConnectionStatus = "connected" | "connecting" | "local_only" | "error";

export function useInspectionSync({
  type = "opening",
  totalSteps = 24,
}: UseInspectionSyncProps = {}) {
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [inspectorName, setInspectorNameState] = useState<string>("근로장학생");
  const [session, setSession] = useState<DailyInspection | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [checkDetails, setCheckDetails] = useState<Record<number, { checkedBy?: string | null; checkedAt?: string }>>({});

  const isMountedRef = useRef<boolean>(false);
  const todayStr = new Date().toISOString().split("T")[0];
  const localKey = `ku_makerspace_${type}_checks`;
  const inspectorKey = "ku_inspector_name";

  // 1. 점검자 이름 초기화 (로컬 스토리지에서 복원)
  useEffect(() => {
    try {
      const savedName = localStorage.getItem(inspectorKey);
      if (savedName !== null) {
        setInspectorNameState(savedName);
      }
    } catch {
      // ignore
    }
  }, []);

  // 점검자 이름 변경 핸들러 (공란 허용)
  const setInspectorName = useCallback((name: string) => {
    setInspectorNameState(name);
    try {
      localStorage.setItem(inspectorKey, name);
    } catch {
      // ignore
    }

    // Supabase 세션의 점검자 이름도 업데이트 (세션이 있는 경우)
    const supabase = getSupabaseClient();
    if (supabase && session?.id) {
      const dbName = name.trim() || "근로장학생";
      supabase
        .from("daily_inspections")
        .update({ inspector_name: dbName, updated_at: new Date().toISOString() })
        .eq("id", session.id)
        .then();
    }
  }, [session?.id]);

  // 2. 세션 및 체크 데이터 초기 로딩
  useEffect(() => {
    isMountedRef.current = true;
    const supabase = getSupabaseClient();

    // Supabase 환경변수가 없는 경우: 순수 LocalStorage 모드로 동작
    if (!supabase) {
      try {
        const saved = localStorage.getItem(localKey);
        if (saved) {
          setCompletedIds(JSON.parse(saved));
        }
      } catch {
        // ignore
      }
      setConnectionStatus("local_only");
      setIsLoading(false);
      return;
    }

    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function initSupabaseData() {
      if (!supabase) return;
      setIsLoading(true);

      try {
        // 당일 세션 조회
        const { data: existingSessions, error: sessionError } = await supabase
          .from("daily_inspections")
          .select("*")
          .eq("inspection_date", todayStr)
          .eq("inspection_type", type)
          .limit(1);

        if (sessionError) {
          console.warn("Supabase session load warning:", sessionError.message);
          setConnectionStatus("error");
          loadFromLocalStorage();
          return;
        }

        let currentSession: DailyInspection;

        if (existingSessions && existingSessions.length > 0) {
          currentSession = existingSessions[0] as DailyInspection;
        } else {
          // 당일 세션 자동 생성
          const currentSavedName = localStorage.getItem(inspectorKey) || "근로장학생";
          const { data: newSession, error: createError } = await supabase
            .from("daily_inspections")
            .insert({
              inspection_date: todayStr,
              inspection_type: type,
              inspector_name: currentSavedName,
              is_completed: false,
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
        }

        if (!isMountedRef.current) return;
        setSession(currentSession);
        if (currentSession.inspector_name) {
          setInspectorNameState(currentSession.inspector_name);
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
          // 로컬스토리지에도 백업 동기화
          try {
            localStorage.setItem(localKey, JSON.stringify(checkedSteps));
          } catch {
            // ignore
          }
        }

        setConnectionStatus("connected");

        // 3. Supabase Realtime 채널 구독
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
                try {
                  localStorage.setItem(localKey, JSON.stringify(next));
                } catch {
                  // ignore
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

    function loadFromLocalStorage() {
      try {
        const saved = localStorage.getItem(localKey);
        if (saved) {
          setCompletedIds(JSON.parse(saved));
        }
      } catch {
        // ignore
      }
      setIsLoading(false);
    }

    initSupabaseData();

    return () => {
      isMountedRef.current = false;
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [type, todayStr, localKey, inspectorKey]);

  // 4. 체크 토글 핸들러 (낙관적 UI 업데이트)
  const toggleStep = useCallback(
    async (stepId: number) => {
      const isCurrentlyCompleted = completedIds.includes(stepId);
      const nextCompleted = !isCurrentlyCompleted;

      // 1) 낙관적 즉시 업데이트 (로컬 상태)
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
          checkedAt: nextCompleted ? new Date().toISOString() : undefined,
        },
      }));

      // 2) Supabase 비동기 동기화
      const supabase = getSupabaseClient();
      if (!supabase || !session?.id) return;

      try {
        const { error } = await supabase.from("inspection_checks").upsert(
          {
            inspection_id: session.id,
            step_id: stepId,
            is_checked: nextCompleted,
            checked_at: new Date().toISOString(),
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

        // 전체 완료 여부 체크 및 업데이트
        const allDone = nextIds.length >= totalSteps;
        if (allDone !== session.is_completed) {
          await supabase
            .from("daily_inspections")
            .update({
              is_completed: allDone,
              completed_at: allDone ? new Date().toISOString() : null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", session.id);
        }
      } catch (err) {
        console.error("Supabase upsert error:", err);
      }
    },
    [completedIds, inspectorName, localKey, session, totalSteps]
  );

  // 5. 전체 초기화 핸들러
  const resetChecks = useCallback(async () => {
    if (!confirm("당일 자가점검 리스트를 모두 초기화하시겠습니까?")) {
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
    if (!supabase || !session?.id) return;

    try {
      await supabase
        .from("inspection_checks")
        .update({ is_checked: false, checked_by: null })
        .eq("inspection_id", session.id);

      await supabase
        .from("daily_inspections")
        .update({ is_completed: false, completed_at: null, updated_at: new Date().toISOString() })
        .eq("id", session.id);
    } catch (err) {
      console.error("Failed to reset Supabase checks:", err);
    }
  }, [localKey, session?.id]);

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
  };
}
