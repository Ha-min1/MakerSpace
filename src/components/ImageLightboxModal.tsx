"use client";

import React, { useEffect } from "react";
import { X, ExternalLink, Download } from "lucide-react";

interface ImageLightboxModalProps {
  src: string | null;
  title: string | null;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  src,
  title,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
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
  }, [src, onClose]);

  if (!src) return null;

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
          </div>

          <div className="flex items-center gap-2">
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-300 hover:text-white bg-neutral-700/60 hover:bg-neutral-700 rounded-md transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              새 탭에서 열기
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-700 transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-neutral-950/60 min-h-[300px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={title || "매뉴얼 상세 사진"}
            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-md"
          />
        </div>

        <div className="px-5 py-2.5 bg-neutral-900 text-xs text-neutral-400 border-t border-neutral-800 text-center">
          단축키 <kbd className="px-1.5 py-0.5 bg-neutral-800 text-neutral-200 rounded border border-neutral-700 font-mono">ESC</kbd> 또는 바깥 영역을 누르면 닫힙니다.
        </div>
      </div>
    </div>
  );
};
