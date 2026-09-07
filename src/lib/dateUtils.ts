/**
 * 대한민국 표준시 (KST, Asia/Seoul, UTC+9) 전용 날짜/시간 유틸리티
 */

const KST_TIMEZONE = "Asia/Seoul";

/**
 * 주어진 Date(기본값: 현재)를 기준으로 대한민국 표준시(KST) 'YYYY-MM-DD' 문자열을 반환합니다.
 * Intl.DateTimeFormat 'en-CA' 로케일을 사용하여 타임존 오차 없이 항상 YYYY-MM-DD 형식을 보장합니다.
 */
export function getKSTDateString(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: KST_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * 대한민국 표준시(KST) 타임존 오프셋(+09:00)이 포함된 완전한 ISO-8601 문자열을 반환합니다.
 * 예: '2026-09-07T15:30:45+09:00'
 */
export function getKSTISOString(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: KST_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const map: Record<string, string> = {};
  for (const part of parts) {
    map[part.type] = part.value;
  }

  return `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}:${map.second}+09:00`;
}

/**
 * ISO 타임스탬프 또는 Date 객체를 KST 기준 시:분(HH:mm)으로 포맷팅합니다.
 * 예: '15:30'
 */
export function formatKSTTime(isoOrDate?: string | Date | null): string {
  if (!isoOrDate) return "";
  const date = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: KST_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/**
 * ISO 타임스탬프 또는 Date 객체를 KST 기준 시:분:초(HH:mm:ss)로 포맷팅합니다.
 */
export function formatKSTFullTime(isoOrDate?: string | Date | null): string {
  if (!isoOrDate) return "";
  const date = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: KST_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

/**
 * 'YYYY-MM-DD' 날짜 문자열을 한국어 형식으로 포맷팅합니다.
 * 예: '2026년 9월 7일 (월)'
 */
export function formatKSTDateDisplay(dateStr: string): string {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  const [y, m, d] = dateStr.split("-").map(Number);
  // KST 정오 기준 Date 객체 생성
  const date = new Date(Date.UTC(y, m - 1, d, 3, 0, 0)); // UTC 03:00 = KST 12:00

  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dayName = days[date.getUTCDay()];

  return `${y}년 ${m}월 ${d}일 (${dayName})`;
}

/**
 * 다음 한국 표준시(KST) 자정(00:00:00)까지 남은 밀리초(ms)를 계산합니다.
 * 자정이 지나면 오늘 날짜를 새로고침/자동 리셋하기 위한 타이머에 사용됩니다.
 */
export function getTimeUntilNextKSTMidnight(): number {
  const now = new Date();
  
  // 현재 KST 시/분/초 구하기
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: KST_TIMEZONE,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const map: Record<string, number> = {};
  for (const part of parts) {
    map[part.type] = Number(part.value);
  }

  const currentSecondsInDay =
    (map.hour || 0) * 3600 + (map.minute || 0) * 60 + (map.second || 0);
  const totalSecondsInDay = 86400; // 24 * 3600
  const remainingSeconds = totalSecondsInDay - currentSecondsInDay;

  // 다음 자정 + 1초 버퍼
  return Math.max(1000, remainingSeconds * 1000 + 1000);
}

/**
 * 특정 KST 'YYYY-MM-DD' 날짜에서 일수를 가감한 날짜를 반환합니다.
 * 예: shiftKSTDate('2026-09-07', -1) -> '2026-09-06'
 */
export function shiftKSTDate(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days, 3, 0, 0));
  return getKSTDateString(date);
}
