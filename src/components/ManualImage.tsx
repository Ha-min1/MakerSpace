"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera, ZoomIn } from "lucide-react";

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
  const [isLoaded, setIsLoaded] = useState(false);
  const imageSrc = `/manual/${imageName}`;

  if (loadError) {
    return (
      <div className="w-full h-56 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/70 dark:bg-neutral-800/40 p-6 flex flex-col items-center justify-center text-center transition-all hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60">
        <div className="w-10 h-10 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-3 shadow-xs">
          <Camera className="w-5 h-5" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-mono font-medium mb-2">
          {imageName}
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs">
          사진 파일을 <code className="text-emerald-700 dark:text-emerald-400 font-mono font-medium">public/manual/</code> 폴더에 추가하면 자동으로 표시됩니다.
        </p>
      </div>
    );
  }

  return (
    <div className="group relative w-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-xs transition-all hover:shadow-md aspect-[4/3] sm:aspect-[16/10]">
      {/* Smooth Skeleton Pulse while downloading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-neutral-200/70 dark:bg-neutral-800/70 animate-pulse flex items-center justify-center text-neutral-400 text-xs font-mono z-10">
          <span className="inline-flex items-center gap-2">
            <Camera className="w-4 h-4 animate-bounce text-neutral-400" />
            최적화 이미지 로딩 중...
          </span>
        </div>
      )}

      {/* Next.js Optimized Image with Lazy Loading */}
      <Image
        src={imageSrc}
        alt={`Step ${stepNumber}: ${stepTitle}`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 450px"
        priority={stepNumber <= 2}
        loading={stepNumber <= 2 ? "eager" : "lazy"}
        decoding="async"
        quality={80}
        onLoad={() => setIsLoaded(true)}
        onError={() => setLoadError(true)}
        className={`object-cover object-center transition-all duration-300 group-hover:scale-[1.02] ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Hover Overlay & Zoom Button */}
      {isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3.5 pointer-events-none z-20">
          <span className="text-xs font-medium text-white/95 drop-shadow-xs">
            Step {stepNumber} 현장 사진
          </span>
          {onZoom && (
            <button
              onClick={() => onZoom(imageSrc, `Step ${stepNumber}: ${stepTitle}`)}
              type="button"
              className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-neutral-900 text-xs font-semibold shadow-md backdrop-blur-xs transition-all active:scale-95 cursor-pointer"
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
