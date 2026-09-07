import fs from "fs";
import path from "path";
import { ManualStep, openingManualSteps, SPACE_LOCATIONS } from "@/data/openingManual";
import { closingManualSteps } from "@/data/closingManual";

export interface ParsedManualImage {
  fileName: string;
  locationKey: string;
  index: number;
  subParts: (number | string)[];
}

/**
 * Parses image filenames matching the new guide format:
 * - OpeningManual_{LocationKey}_{Index}.jpg (e.g. OpeningManual_FrontOpenDoor_1.jpg)
 * - Also supports legacy format: OpeningManual_{StepId}_{SubIndex}.jpg
 */
export function parseManualImageFileName(fileName: string): ParsedManualImage | null {
  // New format: OpeningManual_{LocationKey}_{Index}.(jpg|jpeg|png|webp)
  // e.g. OpeningManual_FrontOpenDoor_1.jpg, OpeningManual_3DSpace_2.jpg
  const namedMatch = fileName.match(
    /^OpeningManual_([a-zA-Z0-9]+)(?:_(\d+))?(?:_(.+))?\.(jpg|jpeg|png|webp)$/i
  );

  if (namedMatch) {
    const rawKey = namedMatch[1];
    const indexStr = namedMatch[2];
    const extraSub = namedMatch[3];

    // Check if rawKey matches one of our known space keys (case-insensitive)
    const matchedSpace = SPACE_LOCATIONS.find(
      (s) => s.key.toLowerCase() === rawKey.toLowerCase()
    );

    if (matchedSpace) {
      const index = indexStr ? parseInt(indexStr, 10) : 1;
      const subParts: (number | string)[] = extraSub
        ? extraSub.split("_").map((p) => {
            const n = parseInt(p, 10);
            return isNaN(n) ? p.toLowerCase() : n;
          })
        : [];

      return {
        fileName,
        locationKey: matchedSpace.key,
        index,
        subParts,
      };
    }
  }

  // Legacy format fallback: OpeningManual_{number}.jpg
  const legacyMatch = fileName.match(/^OpeningManual_(\d+)(?:_(.+))?\.(jpg|jpeg|png|webp)$/i);
  if (legacyMatch) {
    const stepNum = parseInt(legacyMatch[1], 10);
    const spaceByOrder = SPACE_LOCATIONS.find((s) => s.order === stepNum);
    const locationKey = spaceByOrder ? spaceByOrder.key : `Step_${stepNum}`;
    const extraSub = legacyMatch[2];
    const subParts: (number | string)[] = extraSub
      ? extraSub.split("_").map((p) => {
          const n = parseInt(p, 10);
          return isNaN(n) ? p.toLowerCase() : n;
        })
      : [];

    return {
      fileName,
      locationKey,
      index: subParts.length > 0 && typeof subParts[0] === "number" ? subParts[0] : 1,
      subParts,
    };
  }

  return null;
}

/**
 * Sort images belonging to the same location:
 * 1. Primary order by index (1 -> 2 -> 3)
 * 2. Secondary order by subParts
 */
export function compareLocationImages(fileA: string, fileB: string): number {
  const a = parseManualImageFileName(fileA);
  const b = parseManualImageFileName(fileB);

  if (!a && !b) return fileA.localeCompare(fileB);
  if (!a) return 1;
  if (!b) return -1;

  if (a.index !== b.index) {
    return a.index - b.index;
  }

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

function getManualFiles(): string[] {
  const manualDir = path.join(process.cwd(), "public", "manual");
  try {
    if (fs.existsSync(manualDir)) {
      return fs.readdirSync(manualDir);
    }
  } catch (err) {
    console.error("Failed to read public/manual:", err);
  }
  return [];
}

/**
 * Dynamically loads Opening Manual Steps and maps all photos from public/manual/
 */
export function getDynamicOpeningManualSteps(): ManualStep[] {
  const existingFiles = getManualFiles();

  // Group image files by locationKey
  const locationImageMap = new Map<string, string[]>();

  for (const file of existingFiles) {
    const parsed = parseManualImageFileName(file);
    if (parsed) {
      if (!locationImageMap.has(parsed.locationKey)) {
        locationImageMap.set(parsed.locationKey, []);
      }
      locationImageMap.get(parsed.locationKey)!.push(file);
    }
  }

  // Sort images in each location group
  for (const files of locationImageMap.values()) {
    files.sort(compareLocationImages);
  }

  // Attach images to predefined openingManualSteps
  const steps: ManualStep[] = openingManualSteps.map((step) => {
    const key = step.locationKey;
    const matchedFiles = key ? locationImageMap.get(key) : undefined;

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

  return steps;
}

/**
 * Dynamically loads Closing Manual Steps (reverse restoration routine)
 */
export function getDynamicClosingManualSteps(): ManualStep[] {
  const existingFiles = getManualFiles();

  const locationImageMap = new Map<string, string[]>();
  for (const file of existingFiles) {
    const parsed = parseManualImageFileName(file);
    if (parsed) {
      if (!locationImageMap.has(parsed.locationKey)) {
        locationImageMap.set(parsed.locationKey, []);
      }
      locationImageMap.get(parsed.locationKey)!.push(file);
    }
  }

  for (const files of locationImageMap.values()) {
    files.sort(compareLocationImages);
  }

  const steps: ManualStep[] = closingManualSteps.map((step) => {
    const key = step.locationKey;
    const matchedFiles = key ? locationImageMap.get(key) : undefined;

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

  return steps;
}
