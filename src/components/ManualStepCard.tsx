"use client";

import React from "react";
import { Clock, AlertTriangle, Lightbulb, CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { ManualStep } from "@/data/openingManual";
import { ManualImage } from "./ManualImage";

interface ManualStepCardProps {
  step: ManualStep;
  isCompleted: boolean;
  onToggleComplete: (id: number) => void;
  onZoomImage: (src: string, title: string, stepImages?: string[], initialIndex?: number) => void;
}

export const ManualStepCard: React.FC<ManualStepCardProps> = ({
  step,
  isCompleted,
  onToggleComplete,
  onZoomImage,
}) => {
  return (
    <section
      id={`step-${step.id}`}
      className={`manual-step-card break-inside-avoid relative rounded-3xl transition-all duration-200 border ${
        isCompleted
          ? "bg-white/60 dark:bg-neutral-900/60 border-emerald-300 dark:border-emerald-800/80 shadow-xs"
          : "bg-white dark:bg-neutral-900 border-neutral-200/90 dark:border-neutral-800 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700"
      } p-6 sm:p-7`}
    >
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-neutral-100 dark:border-neutral-800/80">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Step Pill */}
          <span
            className={`inline-flex items-center justify-center w-8 h-8 rounded-xl text-xs font-mono font-bold tracking-tight transition-colors ${
              isCompleted
                ? "bg-emerald-700 text-white"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            }`}
          >
            {step.id < 10 ? `0${step.id}` : step.id}
          </span>

          {/* Category Tag */}
          <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
            {step.category}
          </span>
        </div>

        {/* Interactive Checkbox for Web */}
        <button
          onClick={() => onToggleComplete(step.id)}
          type="button"
          className={`no-print inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            isCompleted
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
              : "bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-200 dark:bg-neutral-800/80 dark:text-neutral-300 dark:border-neutral-700"
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>점검 완료</span>
            </>
          ) : (
            <>
              <Circle className="w-4 h-4 text-neutral-400" />
              <span>미확인</span>
            </>
          )}
        </button>

        {/* Print Only Box */}
        <div className="print-only text-xs font-mono text-neutral-700 font-semibold">
          [ &nbsp; &nbsp; ] 점검 완료
        </div>
      </div>

      {/* Main Grid Content */}
      {(() => {
        const images =
          step.imageNames && step.imageNames.length > 0
            ? step.imageNames
            : step.imageName
            ? [step.imageName]
            : [];
        const imageCount = images.length;

        // Dynamic column width depending on image count
        const textColSpan =
          imageCount <= 1
            ? "lg:col-span-7"
            : imageCount === 2
            ? "lg:col-span-6"
            : "lg:col-span-5";

        const imageColSpan =
          imageCount <= 1
            ? "lg:col-span-5"
            : imageCount === 2
            ? "lg:col-span-6"
            : "lg:col-span-7";

        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Instructions & Details */}
            <div className={`${textColSpan} space-y-4`}>
              <h2
                className={`text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white ${
                  isCompleted ? "text-neutral-500 dark:text-neutral-400" : ""
                }`}
              >
                {step.title}
              </h2>

              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 whitespace-pre-line">
                {step.description}
              </p>

              {/* External Link Button if provided */}
              {step.linkUrl && (
                <div className="pt-1">
                  <a
                    href={step.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold transition-all shadow-2xs hover:shadow-xs"
                  >
                    <span>{step.linkText || "관련 사이트 바로가기"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Check Points */}
              {step.checkPoints.length > 0 && (
                <div className="rounded-2xl bg-neutral-50/80 dark:bg-neutral-800/40 p-4 border border-neutral-100 dark:border-neutral-800/80">
                  <div className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2.5">
                    세부 점검 체크 항목
                  </div>
                  <ul className="space-y-2">
                    {step.checkPoints.map((cp, idx) => (
                      <li
                        key={idx}
                        className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 flex items-start gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                        <span>{cp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warning Banner */}
              {step.warning && (
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border-l-4 border-amber-500 text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block mb-0.5">안전 주의사항</strong>
                    {step.warning}
                  </div>
                </div>
              )}

              {/* Tip Banner */}
              {step.tip && (
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border-l-4 border-emerald-600 text-emerald-900 dark:text-emerald-200 text-xs leading-relaxed">
                  <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block mb-0.5">운영 안내 (Tip)</strong>
                    {step.tip}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Image Frame(s) */}
            <div className={`${imageColSpan} w-full`}>
              {imageCount <= 1 ? (
                /* 단일 이미지: 기존대로 꽉 찬 단독 화면 */
                <ManualImage
                  imageName={images[0] || step.imageName}
                  stepNumber={step.id}
                  stepTitle={step.title}
                  aspectRatioClass="aspect-[4/3] sm:aspect-[16/10]"
                  onZoom={() =>
                    onZoomImage(
                      `/manual/${images[0] || step.imageName}`,
                      `Step ${step.id}: ${step.title}`,
                      images,
                      0
                    )
                  }
                />
              ) : imageCount === 2 ? (
                /* 2개 이미지: 양옆 2분할 (기본 왼쪽, 서브 오른쪽) */
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 px-1 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      양옆 2분할 사진 (좌: 기본 / 우: 세부)
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      2장 등록
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <ManualImage
                      imageName={images[0]}
                      stepNumber={step.id}
                      stepTitle={step.title}
                      badgeText={`${images[0].replace(/\.[^.]+$/, "")} (기본)`}
                      aspectRatioClass="aspect-[3/4]"
                      onZoom={() =>
                        onZoomImage(
                          `/manual/${images[0]}`,
                          `Step ${step.id}: ${step.title} (${images[0]})`,
                          images,
                          0
                        )
                      }
                    />
                    <ManualImage
                      imageName={images[1]}
                      stepNumber={step.id}
                      stepTitle={step.title}
                      badgeText={`${images[1].replace(/\.[^.]+$/, "")} (세부)`}
                      aspectRatioClass="aspect-[3/4]"
                      onZoom={() =>
                        onZoomImage(
                          `/manual/${images[1]}`,
                          `Step ${step.id}: ${step.title} (${images[1]})`,
                          images,
                          1
                        )
                      }
                    />
                  </div>
                </div>
              ) : imageCount === 3 ? (
                /* 3개 이미지: 3중 분할 (양옆 3분할 뷰) */
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 px-1 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      3중 분할 비교 사진
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      3장 등록
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                    {images.map((imgName, idx) => (
                      <ManualImage
                        key={imgName}
                        imageName={imgName}
                        stepNumber={step.id}
                        stepTitle={step.title}
                        badgeText={imgName.replace(/\.[^.]+$/, "")}
                        aspectRatioClass="aspect-[3/4]"
                        onZoom={() =>
                          onZoomImage(
                            `/manual/${imgName}`,
                            `Step ${step.id}: ${step.title} (${imgName})`,
                            images,
                            idx
                          )
                        }
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* 4개 이상 이미지: 다분할 그리드 */
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 px-1 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      다분할 점검 사진 ({imageCount}장)
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      {imageCount}장 등록
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {images.map((imgName, idx) => (
                      <ManualImage
                        key={imgName}
                        imageName={imgName}
                        stepNumber={step.id}
                        stepTitle={step.title}
                        badgeText={`사진 ${idx + 1}`}
                        aspectRatioClass="aspect-[3/4]"
                        onZoom={() =>
                          onZoomImage(
                            `/manual/${imgName}`,
                            `Step ${step.id}: ${step.title} (사진 ${idx + 1}/${imageCount})`,
                            images,
                            idx
                          )
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </section>
  );
};
