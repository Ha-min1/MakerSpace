"use client";

import React, { useState, useEffect } from "react";
import {
  Printer,
  RefreshCw,
  HelpCircle,
  Mail,
  MapPin,
  Info,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Lock,
  Clock,
  CheckSquare,
} from "lucide-react";
import { manualMeta } from "@/data/openingManual";
import { ConnectionStatus } from "@/hooks/useInspectionSync";
import { formatKSTDateDisplay, formatKSTFullTime, getKSTDateString } from "@/lib/dateUtils";

interface ManualHeaderProps {
  completedCount: number;
  totalCount: number;
  inspectorName: string;
  onInspectorNameChange: (name: string) => void;
  connectionStatus: ConnectionStatus;
  onReset: () => void;
  onOpenGuide: () => void;
  // 날짜 관련
  selectedDate: string;
  isToday: boolean;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  onSelectDate: (date: string) => void;
}

export const ManualHeader: React.FC<ManualHeaderProps> = ({
  completedCount,
  totalCount,
  inspectorName,
  onInspectorNameChange,
  connectionStatus,
  onReset,
  onOpenGuide,
  selectedDate,
  isToday,
  onPrevDay,
  onNextDay,
  onToday,
  onSelectDate,
}) => {
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");

  useEffect(() => {
    const updateClock = () => {
      setCurrentTimeStr(formatKSTFullTime(new Date()));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const formattedSelectedDate = formatKSTDateDisplay(selectedDate);
  const todayDateStr = getKSTDateString();
  const progressPercent = Math.round((completedCount / (totalCount || 1)) * 100);

  return (
    <header className="mb-8">
      {/* Screen Only Modern Header */}
      <div className="no-print relative overflow-hidden rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 shadow-sm p-6 sm:p-8 backdrop-blur-md">
        {/* Subtle accent gradient bar at the top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-700 via-emerald-500 to-teal-400"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3.5">
            {/* Top Row: System Badges & KST Clock */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                건국대학교 메이커스페이스
              </span>
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                조교 · 근로장학생 전용
              </span>

              {/* 진행 현황 배지 */}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                <CheckSquare className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>{completedCount} / {totalCount} ({progressPercent}%)</span>
              </span>

              {/* Supabase 실시간 연동 상태 뱃지 */}
              {connectionStatus === "connected" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  실시간 DB 연동 중
                </span>
              )}
              {connectionStatus === "connecting" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                  DB 연결 중...
                </span>
              )}
              {connectionStatus === "local_only" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700">
                  💾 로컬 모드
                </span>
              )}

              {/* KST 실시간 시계 뱃지 */}
              {currentTimeStr && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-semibold rounded-full bg-emerald-50/70 dark:bg-neutral-800 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-neutral-700">
                  <Clock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  KST {currentTimeStr}
                </span>
              )}

              <span className="px-2 py-0.5 text-[11px] font-mono text-neutral-400">
                {manualMeta.version}
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                {manualMeta.title}
              </h1>
              <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                {manualMeta.subTitle}
              </p>
            </div>

            {/* KST Date Navigator Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="inline-flex items-center bg-neutral-100/90 dark:bg-neutral-800/90 p-1 rounded-2xl border border-neutral-200/80 dark:border-neutral-700 shadow-2xs">
                <button
                  type="button"
                  onClick={onPrevDay}
                  title="이전 날짜 기록 조회"
                  className="p-1.5 hover:bg-white dark:hover:bg-neutral-700 rounded-xl transition-colors text-neutral-600 dark:text-neutral-300 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 px-3 py-1">
                  <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      if (e.target.value) onSelectDate(e.target.value);
                    }}
                    className="bg-transparent text-xs sm:text-sm font-bold text-neutral-900 dark:text-white outline-hidden cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                    ({formattedSelectedDate.split("(")[1] || "KST"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onNextDay}
                  title="다음 날짜 조회"
                  className="p-1.5 hover:bg-white dark:hover:bg-neutral-700 rounded-xl transition-colors text-neutral-600 dark:text-neutral-300 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {!isToday && (
                <button
                  type="button"
                  onClick={onToday}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <span>오늘({todayDateStr})로 이동</span>
                </button>
              )}

              {/* 과거 기록 보존 모드 표시 */}
              {!isToday && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-xs font-medium border border-amber-200 dark:border-amber-800">
                  <Lock className="w-3 h-3" />
                  과거 누적 기록 조회 모드 (읽기 전용)
                </span>
              )}
            </div>

            {/* Meta tags & 점검자 이름 입력란 */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 pt-1">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                {manualMeta.location}
              </span>

              {/* 당일 점검자 이름 기입란 */}
              <div className="inline-flex items-center gap-1.5 bg-neutral-50 dark:bg-neutral-800/80 px-2.5 py-1 rounded-lg border border-neutral-200/80 dark:border-neutral-700">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">오늘 점검자:</span>
                <input
                  type="text"
                  value={inspectorName}
                  onChange={(e) => onInspectorNameChange(e.target.value)}
                  placeholder="근로장학생 (기본)"
                  disabled={!isToday}
                  className={`bg-transparent border-b border-neutral-300 dark:border-neutral-600 focus:border-emerald-600 dark:focus:border-emerald-400 outline-hidden px-1 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 w-24 sm:w-28 text-center ${
                    !isToday ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                />
              </div>

              <span className="inline-flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-medium">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                사이트 담당: {manualMeta.managerName}
              </span>
            </div>

            {/* DB 기록 안내 문구 */}
            <div className="flex items-start gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 pt-0.5 font-medium leading-relaxed">
              <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                출퇴근 내역은 <strong>대한민국 표준시(KST)</strong> 기준으로 DB에 매일 영구 누적 저장됩니다. (매일 자정 00:00에 새 날짜 점검표가 자동 시작되므로 수동 초기화가 필요 없습니다)
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>PDF 저장 / 인쇄</span>
            </button>

            <button
              onClick={onOpenGuide}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-medium text-xs transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-neutral-500" />
              <span>사진 등록 가이드</span>
            </button>

            {/* 오늘 세션의 체크 초기화 (진행 중 실수 초기화용) */}
            {isToday && completedCount > 0 && (
              <button
                onClick={onReset}
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-neutral-500 hover:text-red-600 dark:hover:text-red-400 text-xs hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                title="오늘 체크 상태만 다시하기 (과거 기록은 안전하게 보존됨)"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>오늘 체크 초기화</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Print Only Letterhead */}
      <div className="print-only mb-6 border-b-2 border-neutral-900 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[10px] font-bold tracking-widest text-neutral-600 uppercase">
              Konkuk University MakerSpace Center • SOP
            </div>
            <h1 className="text-xl font-bold text-neutral-900 mt-1">
              건국대학교 메이커스페이스 일일 자가점검 리스트
            </h1>
            <p className="text-xs text-neutral-600 mt-1">
              장소: {manualMeta.location} | 담당: {manualMeta.managerName} ({manualMeta.managerEmail})
            </p>
          </div>
          <div className="border border-neutral-400 rounded-md p-2 text-[10px] text-right space-y-1 min-w-[220px]">
            <div><strong>점검 일자(KST):</strong> {selectedDate}</div>
            <div><strong>출력 일시(KST):</strong> {todayDateStr} {currentTimeStr}</div>
            <div><strong>점검자(성명):</strong> {inspectorName.trim() || "근로장학생"}</div>
            <div><strong>완료 확인 서명:</strong> ________________ (인)</div>
            <div className="text-[9px] text-neutral-500 pt-0.5">※ 점검 내역은 DB에 대한민국 표준시(KST)로 기록·보존됩니다.</div>
          </div>
        </div>
      </div>
    </header>
  );
};
