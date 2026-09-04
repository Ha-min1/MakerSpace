"use client";

import React from "react";
import { CheckCircle2, Sparkles, ListOrdered } from "lucide-react";
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
    <div className="no-print sticky top-4 z-30 mb-8 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-md p-4 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl flex items-center justify-center transition-colors ${
            isAllCompleted
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
          }`}>
            {isAllCompleted ? (
              <Sparkles className="w-5 h-5 text-emerald-600 animate-bounce" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                출근 점검 진행률
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-mono">
                {percentage}%
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              총 {total}단계 중 <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">{completed}개</strong> 완료됨
            </p>
          </div>
        </div>

        {/* Quick jump step badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-neutral-400 font-medium hidden md:inline">빠른 이동:</span>
          {steps.map((s) => {
            const isDone = completedIds.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => onStepClick(s.id)}
                type="button"
                className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-all flex items-center justify-center cursor-pointer ${
                  isDone
                    ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/30"
                    : "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                }`}
                title={`Step ${s.id}: ${s.title}`}
              >
                {s.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2.5 overflow-hidden shadow-inner">
        <div
          className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* All Complete Message */}
      {isAllCompleted && (
        <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center justify-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>모든 오픈 점검 단계가 완료되었습니다! 일지에 서명 후 입실을 시작해 주세요.</span>
        </div>
      )}
    </div>
  );
};
