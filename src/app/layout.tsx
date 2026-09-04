import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "건국대학교 메이커스페이스 | 출근 & 오픈 매뉴얼 (SOP)",
  description: "건국대학교 메이커스페이스 센터 운영진 및 근로장학생을 위한 일일 오픈 점검 절차 안내 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
