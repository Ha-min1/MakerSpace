"use client";

import React, { useEffect } from "react";
import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageLightboxModalProps {
  src: string | null;
  title: string | null;
  onClose: () => void;
  images?: string[];
  currentIndex?: number;
  onNavigate?: (index: number) => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  src,
  title,
  onClose,
  images,
  currentIndex = 0,
  onNavigate,
}) => {
  const hasMultiple = !!(images && images.length > 1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (hasMultiple && onNavigate) {
        if (e.key === "ArrowLeft") {
          const prevIndex = (currentIndex - 1 + images!.length) % images!.length;
          onNavigate(prevIndex);
        } else if (e.key === "ArrowRight") {
          const nextIndex = (currentIndex + 1) % images!.length;
          onNavigate(nextIndex);
        }
      }
    };
    if (src) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [src, onClose, hasMultiple, currentIndex, images, onNavigate]);

  if (!src) return null;

  const currentImgSrc = hasMultiple && images ? `/manual/${images[currentIndex]}` : src;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 transition-all animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl max-h-[90vh] w-full bg-neutral-900 border border-neutral-700/60 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-800/80 border-b border-neutral-700/60 text-white">
          <div className="flex items-center gap-2 text-sm font-medium truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="truncate">{title || "매뉴얼 상세 사진"}</span>
            {hasMultiple && (
              <span className="shrink-0 text-xs px-2 py-0.5 rounded-md bg-neutral-700 font-mono text-neutral-200">
                {currentIndex + 1} / {images!.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={currentImgSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-300 hover:text-white bg-neutral-700/60 hover:bg-neutral-700 rounded-md transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              새 탭에서 열기
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body with Left/Right arrows if multiple */}
        <div className="relative flex-1 overflow-auto p-4 flex items-center justify-center bg-neutral-950/60 min-h-[300px]">
          {hasMultiple && onNavigate && (
            <button
              onClick={() => onNavigate((currentIndex - 1 + images!.length) % images!.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-700 flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer"
              aria-label="이전 사진"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={currentImgSrc}
            src={currentImgSrc}
            alt={title || "매뉴얼 상세 사진"}
            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-md animate-in fade-in zoom-in-95 duration-150"
          />

          {hasMultiple && onNavigate && (
            <button
              onClick={() => onNavigate((currentIndex + 1) % images!.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-700 flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer"
              aria-label="다음 사진"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="px-5 py-2.5 bg-neutral-900 text-xs text-neutral-400 border-t border-neutral-800 flex items-center justify-between">
          <span>
            단축키 <kbd className="px-1.5 py-0.5 bg-neutral-800 text-neutral-200 rounded border border-neutral-700 font-mono">ESC</kbd> 닫기
            {hasMultiple && (
              <span className="ml-2">
                / <kbd className="px-1.5 py-0.5 bg-neutral-800 text-neutral-200 rounded border border-neutral-700 font-mono">←</kbd> <kbd className="px-1.5 py-0.5 bg-neutral-800 text-neutral-200 rounded border border-neutral-700 font-mono">→</kbd> 사진 이동
              </span>
            )}
          </span>
          {hasMultiple && (
            <span className="font-mono text-[11px] text-neutral-400">
              {images![currentIndex]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
