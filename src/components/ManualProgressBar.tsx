"use client";

import React from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { ManualStep } from "@/data/openingManual";

interface ManualProgressBarProps {
  steps: ManualStep[];
  completedIds: number[];
  onStepClick: (id: number) => void;
}

export const ManualProgressBar: React.FC<ManualProgressBarProps> = ({
  steps,
  completedIds,
  onStepClick,
}) => {
  const total = steps.length;
  const completed = completedIds.length;
  const percentage = Math.round((completed / total) * 100);
  const isAllCompleted = completed === total;

  return (
    <div className="no-print sticky top-20 z-30 mb-8 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-sm p-4 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
              isAllCompleted
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
            }`}
          >
            {isAllCompleted ? (
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wide">
                자가점검 진행률
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50">
                {percentage}%
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              전체 {total}개 항목 중 <span className="font-semibold text-neutral-800 dark:text-neutral-200">{completed}개</span> 점검 완료
            </p>
          </div>
        </div>

        {/* Quick step jump buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-neutral-400 font-medium mr-1 hidden md:inline">항목 바로가기:</span>
          {steps.map((s) => {
            const isDone = completedIds.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => onStepClick(s.id)}
                type="button"
                className={`w-7 h-7 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-center cursor-pointer ${
                  isDone
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
                }`}
                title={`Step ${s.id}: ${s.title}`}
              >
                {s.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-emerald-600 dark:bg-emerald-500 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isAllCompleted && (
        <div className="mt-2.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            모든 오픈 점검을 완료했습니다. 이제 안전하게 이용자를 맞이할 수 있습니다.
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            점검 완료 상태
          </span>
        </div>
      )}
    </div>
  );
};
