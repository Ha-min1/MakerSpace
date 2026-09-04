"use client";

import React from "react";
import {
  Clock,
  UserCheck,
  Calendar,
  MessageSquare,
  PhoneCall,
  Sparkles,
  Printer,
  CheckCircle2,
  AlertCircle,
  FileText,
  Boxes,
  HelpCircle,
  Building,
  ShieldCheck,
  Check
} from "lucide-react";
import { staffManualData } from "@/data/staffManual";

interface StaffManualViewProps {
  onPrint?: () => void;
}

export const StaffManualView: React.FC<StaffManualViewProps> = ({ onPrint }) => {
  const handlePrint = () => {
    if (onPrint) onPrint();
    else window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <section className="rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                센터 운영 표준
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                개정일: {staffManualData.lastUpdated}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              {staffManualData.title}
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
              {staffManualData.subTitle}
            </p>
          </div>

          <div className="no-print shrink-0">
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>매뉴얼 인쇄 / PDF</span>
            </button>
          </div>
        </div>
      </section>

      {/* 1. 근무 시간 안내 카드 */}
      <section className="rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm p-6 sm:p-7">
        <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-neutral-100 dark:border-neutral-800">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              1. 근무 시간 규정
            </h2>
            <p className="text-xs text-neutral-400">근로학생 및 조교의 정규 운영 시간표</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {staffManualData.workSchedules.map((schedule, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-neutral-50/80 dark:bg-neutral-800/40 border border-neutral-200/70 dark:border-neutral-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  {schedule.role}
                </span>
                {schedule.note && (
                  <span className="text-[11px] text-neutral-400 font-medium">
                    {schedule.note}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-700/60 text-center">
                  <span className="text-[11px] font-sans text-neutral-400 block mb-0.5">
                    학기 중
                  </span>
                  <strong className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 font-bold">
                    {schedule.semesterTime}
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-700/60 text-center">
                  <span className="text-[11px] font-sans text-neutral-400 block mb-0.5">
                    방학 중
                  </span>
                  <strong className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-200 font-bold">
                    {schedule.vacationTime}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. 근로 기본 수칙 4대 원칙 */}
      <section className="rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm p-6 sm:p-7">
        <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-neutral-100 dark:border-neutral-800">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              2. 근로 기본 수칙
            </h2>
            <p className="text-xs text-neutral-400">근무 태도 및 대인 응대 표준 지침</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {staffManualData.basicRules.map((rule, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-mono font-bold flex items-center justify-center text-neutral-700 dark:text-neutral-300">
                    0{idx + 1}
                  </span>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    {rule.title}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                  {rule.tag}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {rule.description}
              </p>

              <div className="pt-1">
                <ul className="space-y-1.5">
                  {rule.details.map((detail, dIdx) => (
                    <li
                      key={dIdx}
                      className="text-xs text-neutral-500 dark:text-neutral-400 flex items-start gap-2"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 주요 담당 업무 (공간 미화 및 환경 정비) */}
      <section className="rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm p-6 sm:p-7">
        <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-neutral-100 dark:border-neutral-800">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              3. 주요 담당 업무 (공간 미화 & 환경 정비)
            </h2>
            <p className="text-xs text-neutral-400">시간대별 공간 관리 및 정비 루틴</p>
          </div>
        </div>

        <div className="space-y-4">
          {staffManualData.cleaningRoutines.map((routine, rIdx) => (
            <div
              key={rIdx}
              className="p-5 rounded-2xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-emerald-700 text-white">
                    {routine.timing}
                  </span>
                  <strong className="text-sm font-bold text-neutral-900 dark:text-white">
                    {routine.title}
                  </strong>
                </div>
              </div>

              <ul className="space-y-1.5 pt-1">
                {routine.tasks.map((task, tIdx) => (
                  <li
                    key={tIdx}
                    className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 flex items-start gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Additional duty callout */}
          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-300">
            <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>기타 센터 행정 업무 보조 및 방문자 질서 유지를 병행합니다.</span>
          </div>
        </div>
      </section>

      {/* 4. 공간 사용 관련 안내 */}
      <section className="rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm p-6 sm:p-7">
        <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-neutral-100 dark:border-neutral-800">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <Boxes className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              4. 공간별 사용 절차 및 학생 안내 지침
            </h2>
            <p className="text-xs text-neutral-400">시설 이용 희망자에게 필수 안내해야 할 사항</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {staffManualData.spaceGuides.map((guide, gIdx) => (
            <div
              key={gIdx}
              className="p-5 rounded-2xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-1">
                  <strong className="text-sm font-extrabold text-neutral-900 dark:text-white">
                    {guide.spaceName}
                  </strong>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
                    {guide.badge}
                  </span>
                </div>

                <ul className="space-y-2">
                  {guide.requirements.map((req, rIdx) => (
                    <li
                      key={rIdx}
                      className="text-xs text-neutral-600 dark:text-neutral-300 flex items-start gap-2 leading-relaxed"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-neutral-200/70 dark:border-neutral-700/60 text-[11px] text-neutral-500 dark:text-neutral-400">
                <strong className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-0.5">
                  문의 안내 창구:
                </strong>
                {guide.inquiryTarget}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
