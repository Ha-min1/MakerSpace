"use client";

import React from "react";
import { X, FolderPlus, FileText, CheckCircle2, Image as ImageIcon, Printer } from "lucide-react";

interface UploadGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadGuideModal: React.FC<UploadGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative max-w-xl w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                매뉴얼 사진 등록 & PDF 출력 가이드
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                사진 파일 저장 위치 및 인쇄 최적화 안내
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

        <div className="py-5 space-y-4 text-sm text-neutral-700 dark:text-neutral-300">
          {/* Step 1: Directory */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
            <ImageIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <strong className="text-emerald-950 dark:text-emerald-200 text-xs block">
                1. 사진 파일 위치
              </strong>
              <p className="text-xs">
                프로젝트의 <code className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 font-mono text-emerald-900 dark:text-emerald-200 font-semibold">public/manual/</code> 폴더에 사진을 복사/저장하세요.
              </p>
            </div>
          </div>

          {/* Step 2: Naming convention */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800">
            <FileText className="w-5 h-5 text-neutral-600 dark:text-neutral-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <strong className="text-neutral-900 dark:text-neutral-100 text-xs block">
                2. 파일 이름 규칙
              </strong>
              <p className="text-xs leading-relaxed">
                각 스텝 번호와 일치하도록 언더바(_)를 넣어 이름을 지정합니다:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200">
                  OpeningManual_1.jpg
                </span>
                <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200">
                  OpeningManual_2.jpg
                </span>
                <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200">
                  ... OpeningManual_8.jpg
                </span>
              </div>
            </div>
          </div>

          {/* Step 3: PDF Print */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800">
            <Printer className="w-5 h-5 text-neutral-600 dark:text-neutral-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <strong className="text-neutral-900 dark:text-neutral-100 text-xs block">
                3. PDF 저장 및 출력 팁
              </strong>
              <p className="text-xs leading-relaxed">
                상단의 <strong>[PDF 저장 / 인쇄]</strong> 버튼을 누르면 인쇄 설정 창이 뜹니다.
                <br />
                • 대상: <strong>'PDF로 저장'</strong> 선택
                <br />
                • 설정: <strong>'배경 그래픽(Background Graphics)'</strong> 체크 권장
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            확인 완료
          </button>
        </div>
      </div>
    </div>
  );
};
