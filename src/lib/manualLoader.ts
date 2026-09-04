import fs from "fs";
import path from "path";
import { ManualStep, openingManualSteps } from "@/data/openingManual";

export interface ParsedImageFile {
  fileName: string;
  stepId: number;
  subParts: (number | string)[];
}

/**
 * Parses image filenames such as:
 * - OpeningManual_2.jpg -> stepId: 2, subParts: [] (기본 1번/왼쪽 사진)
 * - OpeningManual_2_1.jpg -> stepId: 2, subParts: [1] (2번 섹터 2번째 사진)
 * - OpeningManual_2_1_2.jpg -> stepId: 2, subParts: [1, 2] (3중 분할 3번째 사진)
 * - OpeningManual_2_2.jpg -> stepId: 2, subParts: [2]
 */
export function parseManualImageFileName(fileName: string): ParsedImageFile | null {
  const match = fileName.match(/^OpeningManual_(\d+)(?:_(.+))?\.(jpg|jpeg|png|webp)$/i);
  if (!match) return null;

  const stepId = parseInt(match[1], 10);
  const subStr = match[2];
  const subParts: (number | string)[] = subStr
    ? subStr.split("_").map((part) => {
        const num = parseInt(part, 10);
        return isNaN(num) ? part.toLowerCase() : num;
      })
    : [];

  return { fileName, stepId, subParts };
}

/**
 * Sorts manual image files naturally so that:
 * 1. Base image (OpeningManual_2.jpg) comes first (subParts: [])
 * 2. Sub-images follow by segments (2_1.jpg -> 2_1_2.jpg -> 2_2.jpg)
 */
export function compareManualImageFiles(fileA: string, fileB: string): number {
  const a = parseManualImageFileName(fileA);
  const b = parseManualImageFileName(fileB);

  if (!a && !b) return fileA.localeCompare(fileB);
  if (!a) return 1;
  if (!b) return -1;

  if (a.stepId !== b.stepId) {
    return a.stepId - b.stepId;
  }

  // Base image without subParts always comes first
  if (a.subParts.length === 0 && b.subParts.length > 0) return -1;
  if (a.subParts.length > 0 && b.subParts.length === 0) return 1;

  const minLen = Math.min(a.subParts.length, b.subParts.length);
  for (let i = 0; i < minLen; i++) {
    const pa = a.subParts[i];
    const pb = b.subParts[i];
    if (typeof pa === "number" && typeof pb === "number") {
      if (pa !== pb) return pa - pb;
    } else {
      const cmp = String(pa).localeCompare(String(pb), undefined, { numeric: true });
      if (cmp !== 0) return cmp;
    }
  }

  return a.subParts.length - b.subParts.length;
}

export function getDynamicOpeningManualSteps(): ManualStep[] {
  const manualDir = path.join(process.cwd(), "public", "manual");
  let existingFiles: string[] = [];

  try {
    if (fs.existsSync(manualDir)) {
      existingFiles = fs.readdirSync(manualDir);
    }
  } catch (err) {
    console.error("Failed to read public/manual:", err);
  }

  // Group files by stepId
  const imageMap = new Map<number, string[]>();

  for (const file of existingFiles) {
    const parsed = parseManualImageFileName(file);
    if (parsed) {
      if (!imageMap.has(parsed.stepId)) {
        imageMap.set(parsed.stepId, []);
      }
      imageMap.get(parsed.stepId)!.push(file);
    }
  }

  // Sort images inside each step group
  for (const files of imageMap.values()) {
    files.sort(compareManualImageFiles);
  }

  // Clone defined steps and attach matched images
  const steps: ManualStep[] = openingManualSteps.map((step) => {
    const matchedFiles = imageMap.get(step.id);
    const images =
      matchedFiles && matchedFiles.length > 0
        ? matchedFiles
        : step.imageNames && step.imageNames.length > 0
        ? step.imageNames
        : step.imageName
        ? [step.imageName]
        : [];

    return {
      ...step,
      imageName: images[0] || step.imageName,
      imageNames: images,
    };
  });

  // Automatically append newly added images that don't have defined text yet!
  const detectedIds = Array.from(imageMap.keys()).sort((a, b) => a - b);
  for (const id of detectedIds) {
    const exists = steps.some((s) => s.id === id);
    if (!exists) {
      const files = imageMap.get(id)!;
      const fileSummary = files.join(", ");
      steps.push({
        id,
        title: `점검 항목 ${id} (신규 사진 등록됨)`,
        category: "추가 점검",
        description: `사진(${fileSummary})이 등록되었습니다. 이 항목의 세부 점검 지침 및 안내 텍스트를 업데이트해 주세요.`,
        checkPoints: [
          `현장 사진(${fileSummary}) 대조 확인`,
          "해당 구역/장비 안전 상태 점검 및 확인",
        ],
        imageName: files[0],
        imageNames: files,
        estimatedMinutes: 3,
      });
    }
  }

  // Sort by id ascending
  steps.sort((a, b) => a.id - b.id);
  return steps;
}
