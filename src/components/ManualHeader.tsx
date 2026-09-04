"use client";

import React from "react";
import { Printer, RefreshCw, HelpCircle, CheckCircle2, Clock, Calendar, ShieldCheck, MapPin } from "lucide-react";
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
      {/* Screen Only Top Bar */}
      <div className="no-print bg-gradient-to-r from-emerald-900 via-[#004d25] to-emerald-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        {/* Background Subtle Deco */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-700/80 text-emerald-100 border border-emerald-500/40 tracking-wider">
                건국대학교 메이커스페이스
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                내부 스태프 전용 SOP
              </span>
              <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-white/10 text-neutral-300">
                {manualMeta.version}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
              {manualMeta.title}
            </h1>
            <p className="text-sm md:text-base text-emerald-100/80 max-w-2xl font-light">
              {manualMeta.subTitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200/70 pt-1">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                {manualMeta.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-300" />
                업데이트: {manualMeta.lastUpdated}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                대상: {manualMeta.targetRole}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap md:flex-col lg:flex-row items-center gap-2.5 pt-2 md:pt-0">
            <button
              onClick={handlePrint}
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-sm shadow-md hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer"
              title="브라우저 인쇄 다이얼로그를 열어 PDF로 저장하거나 종이로 인쇄합니다."
            >
              <Printer className="w-4 h-4 text-emerald-800" />
              <span>PDF 저장 / 인쇄</span>
            </button>

            <button
              onClick={onOpenGuide}
              type="button"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-medium text-xs border border-emerald-600/40 hover:border-emerald-500 active:scale-95 transition-all cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-300" />
              <span>사진 등록 안내</span>
            </button>

            {completedCount > 0 && (
              <button
                onClick={onReset}
                type="button"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-neutral-800/70 hover:bg-neutral-800 text-neutral-200 font-medium text-xs border border-neutral-700/60 active:scale-95 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
                <span>체크 초기화</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Print Only Official Letterhead (visible only when printing to PDF/paper) */}
      <div className="print-only mb-6 border-b-2 border-neutral-800 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
              Konkuk University Makerspace Center - Standard Operating Procedure
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mt-1">
              건국대학교 메이커스페이스 일일 오픈 점검 매뉴얼
            </h1>
            <p className="text-xs text-neutral-600 mt-1">
              장소: {manualMeta.location} | 버전: {manualMeta.version} | 개정일자: {manualMeta.lastUpdated}
            </p>
          </div>
          <div className="border border-neutral-300 rounded p-2 text-[10px] text-right">
            <div><strong>출력 일시:</strong> {new Date().toLocaleDateString("ko-KR")}</div>
            <div><strong>문서 번호:</strong> KU-MS-SOP-01</div>
            <div><strong>담당 서명:</strong> ______________ (인)</div>
          </div>
        </div>
      </div>
    </header>
  );
};
