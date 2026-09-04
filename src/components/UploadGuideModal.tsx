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
              <span>2. 파일 이름 규칙</span>
            </div>
            <p className="mb-2">
              각 단계 번호에 맞춰 언더바(_) 형식으로 지정합니다:
            </p>
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
              <span className="px-2 py-0.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">OpeningManual_1.jpg</span>
              <span className="px-2 py-0.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">OpeningManual_2.jpg</span>
              <span className="px-2 py-0.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">... OpeningManual_8.jpg</span>
            </div>
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
