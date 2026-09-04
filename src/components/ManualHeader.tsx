"use client";

import React from "react";
import { Printer, RefreshCw, HelpCircle, ShieldCheck, Mail, MapPin, CheckCircle2 } from "lucide-react";
import { manualMeta } from "@/data/openingManual";

interface ManualHeaderProps {
  completedCount: number;
  totalCount: number;
  onReset: () => void;
  onOpenGuide: () => void;
}

export const ManualHeader: React.FC<ManualHeaderProps> = ({
  completedCount,
  totalCount,
  onReset,
  onOpenGuide,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="mb-8">
      {/* Screen Only Modern Header */}
      <div className="no-print relative overflow-hidden rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 shadow-sm p-6 sm:p-8 backdrop-blur-md">
        {/* Subtle accent gradient bar at the top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-700 via-emerald-500 to-teal-400"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                건국대학교 메이커스페이스
              </span>
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                조교 · 근로장학생 전용
              </span>
              <span className="px-2 py-0.5 text-[11px] font-mono text-neutral-400">
                {manualMeta.version}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                {manualMeta.title}
              </h1>
              <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                {manualMeta.subTitle}
              </p>
            </div>

            {/* Meta tags */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 pt-1">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                {manualMeta.location}
              </span>
              <span className="inline-flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-medium">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                담당: {manualMeta.managerName} ({manualMeta.managerEmail})
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

            {completedCount > 0 && (
              <button
                onClick={onReset}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title="체크 항목 초기화"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>체크 초기화</span>
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
              건국대학교 메이커스페이스 일일 오픈 자가점검 리스트
            </h1>
            <p className="text-xs text-neutral-600 mt-1">
              장소: {manualMeta.location} | 담당: {manualMeta.managerName} ({manualMeta.managerEmail})
            </p>
          </div>
          <div className="border border-neutral-400 rounded-md p-2 text-[10px] text-right space-y-1">
            <div><strong>출력 일시:</strong> {new Date().toLocaleDateString("ko-KR")}</div>
            <div><strong>점검자(성명/학번):</strong> ______________________</div>
            <div><strong>완료 확인 서명:</strong> ________________ (인)</div>
          </div>
        </div>
      </div>
    </header>
  );
};
