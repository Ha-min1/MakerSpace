"use client";

import React, { useState } from "react";
import { Image as ImageIcon, ZoomIn } from "lucide-react";

interface ManualImageProps {
  imageName: string;
  stepNumber: number;
  stepTitle: string;
  onZoom?: (src: string, title: string) => void;
}

export const ManualImage: React.FC<ManualImageProps> = ({
  imageName,
  stepNumber,
  stepTitle,
  onZoom,
}) => {
  const [loadError, setLoadError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imageSrc = `/manual/${imageName}`;

  if (loadError) {
    return (
      <div className="w-full rounded-xl border-2 border-dashed border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 p-6 flex flex-col items-center justify-center text-center transition-all hover:bg-emerald-50 dark:hover:bg-emerald-950/30">
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-3 shadow-inner">
          <ImageIcon className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 mb-2 font-mono">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          {imageName}
        </div>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-sm leading-relaxed">
          <code className="text-emerald-800 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-900/40 px-1 py-0.5 rounded text-[11px]">
            public/manual/{imageName}
          </code>
          <br />
          위치에 사진을 넣으면 여기에 자동으로 표시됩니다.
        </p>
      </div>
    );
  }

  return (
    <div className="group relative w-full overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900/5 dark:bg-neutral-900 shadow-sm transition-all hover:shadow-md">
      {!loaded && (
        <div className="w-full h-52 bg-neutral-100 dark:bg-neutral-800 animate-pulse flex items-center justify-center text-neutral-400 text-xs font-mono">
          이미지 불러오는 중 ({imageName})...
        </div>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={`Step ${stepNumber}: ${stepTitle}`}
        onLoad={() => setLoaded(true)}
        onError={() => setLoadError(true)}
        className={`w-full max-h-96 object-contain bg-neutral-950/5 dark:bg-neutral-950/40 transition-transform duration-300 group-hover:scale-[1.01] ${
          loaded ? "block" : "hidden"
        }`}
      />

      {loaded && (
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 pointer-events-none">
          <span className="text-xs font-medium text-white drop-shadow-md">
            Step {stepNumber} 참고 사진 ({imageName})
          </span>
          {onZoom && (
            <button
              onClick={() => onZoom(imageSrc, `Step ${stepNumber}: ${stepTitle}`)}
              type="button"
              className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 hover:bg-white text-neutral-900 text-xs font-semibold shadow-lg backdrop-blur-sm transition-all transform active:scale-95 cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              크게 보기
            </button>
          )}
        </div>
      )}
    </div>
  );
};
