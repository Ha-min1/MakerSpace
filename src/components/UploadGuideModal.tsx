"use client";

import React from "react";
import { X, FolderPlus, MapPin } from "lucide-react";
import { manualMeta, SPACE_LOCATIONS } from "@/data/openingManual";

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
        className="relative max-w-xl w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-7 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                사진 등록 & 공간 관리 가이드
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                PhotoManageGuide 규격 기반 안내
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

        <div className="py-4 space-y-3.5 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed overflow-y-auto pr-1">
          {/* 1. 폴더 경로 */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800">
            <div className="font-bold text-neutral-900 dark:text-white mb-1 flex items-center gap-1.5">
              <span>1. 사진 저장 폴더</span>
            </div>
            <p>
              프로젝트 내부 <code className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono">public/manual/</code> 경로에 사진 파일을 저장합니다.
            </p>
          </div>

          {/* 2. 네이밍 규격 */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800">
            <div className="font-bold text-neutral-900 dark:text-white mb-1 flex items-center gap-1.5">
              <span>2. 파일 이름 규칙 (장소 이름 + 사진 순서)</span>
            </div>
            <p className="mb-2 text-xs leading-relaxed">
              <code className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-mono font-bold">
                OpeningManual_장소이름_사진순서.jpg
              </code>
              <br />
              장소 이름은 파스칼케이스(대문자로 시작)로 작성하며, 동일 장소에 사진이 여러 장일 경우 끝 번호(_1, _2...)에 따라 자동 분할 배치됩니다.
            </p>
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px] mb-2">
              <span className="px-2 py-0.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">OpeningManual_FrontOpenDoor_1.jpg</span>
              <span className="px-2 py-0.5 rounded bg-white dark:bg-neutral-900 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300">OpeningManual_FrontOpenDoor_2.jpg</span>
              <span className="px-2 py-0.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">OpeningManual_ProjectSpace_1~4.jpg</span>
            </div>
          </div>

          {/* 3. 10대 핵심 공간 키 목록 */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800">
            <div className="font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>3. 공인 10대 공간 키 (순서대로 정렬됨)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
              {SPACE_LOCATIONS.map((loc) => (
                <div
                  key={loc.key}
                  className="flex items-center justify-between p-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 font-mono"
                >
                  <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                    {loc.order}. {loc.key}
                  </span>
                  <span className="text-neutral-500 dark:text-neutral-400 font-sans text-[10px]">
                    {loc.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. 담당자 안내 */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800">
            <div className="font-bold text-neutral-900 dark:text-white mb-1 flex items-center gap-1.5">
              <span>4. 사이트 및 장비 담당 문의</span>
            </div>
            <p>
              사이트 담당: <strong>{manualMeta.managerName}</strong> (<a href={`mailto:${manualMeta.managerEmail}`} className="text-emerald-700 dark:text-emerald-400 underline">{manualMeta.managerEmail}</a>)
              <br />
              3D프린터실 문의: <strong>한봉원 연구원</strong> (010-9910-9707)
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end shrink-0">
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
