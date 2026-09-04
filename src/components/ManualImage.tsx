"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera, ZoomIn } from "lucide-react";

interface ManualImageProps {
  imageName: string;
  stepNumber: number;
  stepTitle: string;
  onZoom?: (src: string, title: string) => void;
  aspectRatioClass?: string;
  badgeText?: string;
  priority?: boolean;
}

export const ManualImage: React.FC<ManualImageProps> = ({
  imageName,
  stepNumber,
  stepTitle,
  onZoom,
  aspectRatioClass = "aspect-[4/3] sm:aspect-[16/10]",
  badgeText,
  priority,
}) => {
  const [loadError, setLoadError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imageSrc = `/manual/${imageName}`;

  if (loadError) {
    return (
      <div className={`w-full ${aspectRatioClass} min-h-[160px] rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/70 dark:bg-neutral-800/40 p-4 flex flex-col items-center justify-center text-center transition-all hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60`}>
        <div className="w-8 h-8 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-2 shadow-2xs">
          <Camera className="w-4 h-4" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-[11px] font-mono font-medium mb-1 truncate max-w-full">
          {imageName}
        </div>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight max-w-xs">
          사진 대기 중
        </p>
      </div>
    );
  }

  const isPriority = priority !== undefined ? priority : stepNumber <= 2;

  return (
    <div className={`group relative w-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-2xs transition-all hover:shadow-md ${aspectRatioClass}`}>
      {/* Optional Top Badge for multi-image distinction */}
      {badgeText && (
        <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-black/65 text-white backdrop-blur-xs shadow-xs border border-white/15">
            {badgeText}
          </span>
        </div>
      )}

      {/* Smooth Skeleton Pulse while downloading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-neutral-200/70 dark:bg-neutral-800/70 animate-pulse flex items-center justify-center text-neutral-400 text-xs font-mono z-10">
          <span className="inline-flex items-center gap-1.5 text-[11px]">
            <Camera className="w-3.5 h-3.5 animate-bounce text-neutral-400" />
            로딩 중...
          </span>
        </div>
      )}

      {/* Next.js Image with unoptimized flag to prevent stale cache during file updates */}
      <Image
        key={imageSrc}
        src={imageSrc}
        alt={`Step ${stepNumber}: ${stepTitle}${badgeText ? ` (${badgeText})` : ""}`}
        fill
        unoptimized
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 450px"
        priority={isPriority}
        loading={isPriority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setLoadError(true)}
        className={`object-cover object-center transition-all duration-300 group-hover:scale-[1.02] ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Hover Overlay & Zoom Button */}
      {isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5 sm:p-3 pointer-events-none z-20">
          <span className="text-[11px] sm:text-xs font-medium text-white/95 drop-shadow-xs truncate max-w-[60%]">
            {badgeText || `Step ${stepNumber} 현장 사진`}
          </span>
          {onZoom && (
            <button
              onClick={() => onZoom(imageSrc, `Step ${stepNumber}: ${stepTitle}${badgeText ? ` (${badgeText})` : ""}`)}
              type="button"
              className="pointer-events-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-neutral-900 text-[11px] sm:text-xs font-semibold shadow-md backdrop-blur-xs transition-all active:scale-95 cursor-pointer"
            >
              <ZoomIn className="w-3 h-3" />
              크게 보기
            </button>
          )}
        </div>
      )}
    </div>
  );
};
