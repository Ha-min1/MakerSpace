"use client";

import React from "react";
import { X, FolderPlus, FileText, Printer, HelpCircle } from "lucide-react";
import { manualMeta } from "@/data/openingManual";

interface UploadGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadGuideModal: React.FC<UploadGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                사진 등록 & 인쇄 가이드
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                조교 및 근로장학생 안내
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-4 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800">
            <div className="font-bold text-neutral-900 dark:text-white mb-1 flex items-center gap-1.5">
              <span>1. 사진 저장 폴더</span>
            </div>
            <p>
              프로젝트 내부 <code className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono">public/manual/</code> 경로에 사진 파일을 저장합니다.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800">
            <div className="font-bold text-neutral-900 dark:text-white mb-1 flex items-center gap-1.5">
              <span>2. 파일 이름 규칙 (단일 및 다중 분할)</span>
            </div>
            <p className="mb-2 text-xs">
              각 단계 번호에 맞춰 언더바(_) 형식으로 지정하며, 같은 항목에 사진이 여러 장일 경우 언더바 뒤에 서브 번호를 붙이면 자동으로 양옆 분할(2분할, 3중 분할 등)되어 표시됩니다:
            </p>
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px] mb-2">
              <span className="px-2 py-0.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">OpeningManual_1.jpg (단독 1장)</span>
              <span className="px-2 py-0.5 rounded bg-white dark:bg-neutral-900 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300">OpeningManual_2.jpg (2번 기본 좌측)</span>
              <span className="px-2 py-0.5 rounded bg-white dark:bg-neutral-900 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300">OpeningManual_2_1.jpg (2번 세부 우측)</span>
              <span className="px-2 py-0.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">OpeningManual_2_1_2.jpg (3중 분할 3번째)</span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              ※ 1장만 있을 때는 전체 크기로 표시되고, 2장이면 양옆 2분할, 3장 이상이면 3중 분할 등으로 자동 전환됩니다.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800">
            <div className="font-bold text-neutral-900 dark:text-white mb-1 flex items-center gap-1.5">
              <span>3. 담당자 문의</span>
            </div>
            <p>
              오픈 매뉴얼 절차 및 장비 문의: <strong>{manualMeta.managerName}</strong> (<a href={`mailto:${manualMeta.managerEmail}`} className="text-emerald-700 dark:text-emerald-400 underline">{manualMeta.managerEmail}</a>)
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
