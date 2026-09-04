# 🛠️ 건국대학교 메이커스페이스 센터 웹 플랫폼 - 개발 컨텍스트 (DEV_CONTEXT)

> **최종 갱신 일시**: 2026-09-04
> **목적**: 프로젝트의 기획 의도, 아키텍처, 컴포넌트 구조, 현재 작업 현황 및 향후 로드맵을 영구 기록하여 지속 가능한 개발 컨텍스트를 유지함.

---

## 1. 프로젝트 개요

- **프로젝트명**: 건국대학교 메이커스페이스 보조 및 내부 운영 포털 (`ku-makerspace`)
- **목적**: 
  - 기존 한글(HWP) 파일로 관리되던 출근/오픈 점검 절차를 세련된 반응형 웹 매뉴얼로 전환
  - 스태프(운영진, 근로장학생)가 현장에서 모바일/PC로 체크리스트를 확인하며 안전하고 체계적으로 오픈 업무 수행
  - 필요 시 언제든 A4 규격의 공식 서식으로 **PDF 저장 및 인쇄**할 수 있는 표준 운영 절차(SOP) 제공
- **배포 플랫폼**: Vercel (Git Push 연동 자동 배포 예정)
- **주요 기술 스택**:
  - **Framework**: Next.js 16 (App Router)
  - **Language**: TypeScript (엄격 모드)
  - **Styling**: Tailwind CSS v4 + 커스텀 KU 테마
  - **Icons**: Lucide React
  - **Storage**: 브라우저 LocalStorage (출근 체크리스트 진행률 영속화)

---

## 2. 디자인 시스템 & 아이덴티티

- **Primary Color (건국대 시그니처)**:
  - `KU Forest Green` (`#004D25`) - 헤더, 주요 버튼, 브랜드 뱃지
  - `KU Green Hover` (`#0A6332`)
  - `KU Green Light/Tint` (`#E8F5ED`) - 배경 하이라이트, 태그
- **Accent Color**:
  - `Maker Amber` (`#F59E0B`) - 주의사항, 알림, 로딩 닷
  - `Cyber Green` (`#10B981`) - 완료 상태, 사용 가능 뱃지
- **Typography**: Pretendard / 시스템 산세리프 폰트
- **Print Theme (`@media print`)**:
  - A4 규격 최적화 (`@page { size: A4 portrait; margin: 12mm 12mm 15mm 12mm; }`)
  - 웹 전용 네비게이션, 체크박스 버튼, 진행률 바 자동 숨김 (`.no-print`)
  - 공식 대학 문서 헤더 및 서명란 표시 (`.print-only`)
  - 페이지 분할 시 카드 중간 잘림 방지 (`break-inside: avoid;`)

---

## 3. 프로젝트 디렉터리 및 파일 구조

```
/workspaces/MakerSpace
├── DEV_CONTEXT.md                # [본 파일] 개발 컨텍스트 및 작업 진행 기록
├── AGENTS.md                     # Next.js 에이전트 룰
├── package.json                  # 프로젝트 메타데이터 및 의존성
├── next.config.ts                # Next.js 환경 설정
├── public/                       # 정적 파일 저장소
│   └── manual/                   # 출근 매뉴얼 사진 보관 폴더
│       ├── OpeningManual_1.jpg   # 1번 설명 매칭 사진
│       ├── OpeningManual_2.jpg   # 2번 설명 매칭 사진
│       └── ...                   # OpeningManual_N.jpg
└── src/
    ├── app/
    │   ├── layout.tsx            # 메타데이터 (KU 타이틀) 및 기본 HTML 래퍼
    │   ├── page.tsx              # 메인 스태프 포털 & 매뉴얼 뷰어 페이지
    │   └── globals.css           # Tailwind v4 설정, 테마 변수, @media print 최적화
    ├── components/
    │   ├── ManualHeader.tsx      # 헤더, SOP 메타정보, PDF 인쇄/초기화 액션
    │   ├── ManualProgressBar.tsx # 스티키 진행률 바, 완료율(%), 빠른 스텝 이동 뱃지
    │   ├── ManualStepCard.tsx    # 개별 스텝 카드 (설명 + 체크포인트 + 주의/팁 + 이미지)
    │   ├── ManualImage.tsx       # 1:1 사진 매칭, 플레이스홀더, 줌 버튼
    │   ├── ImageLightboxModal.tsx# 사진 원본 확대 모달 (ESC/배경 클릭 닫기)
    │   └── UploadGuideModal.tsx  # 사진 등록 및 PDF 출력 가이드 모달
    └── data/
        └── openingManual.ts      # 매뉴얼 데이터 구조 (제목, 본문, 체크포인트, 이미지명 등)
```

---

## 4. 현재 작업 완료 현황 (Current Progress)

### ✅ 완료된 작업
1. **Next.js 16 + TypeScript + Tailwind CSS 환경 구성**:
   - Vercel 배포를 위한 프로젝트 루트 세팅 및 `npm run build` 컴파일 검증 완료 (무결점).
2. **출근 & 오픈 매뉴얼 웹 뷰어 개발**:
   - 스텝 1번부터 순차적으로 내려가는 타임라인 카드 레이아웃 구현.
   - 좌측: 스텝 번호, 제목, 상세 설명, 세부 체크포인트(Checkpoints), 안전 주의사항(Warning), 팁(Tip).
   - 우측: 단계별 사진 뷰어 슬롯.
3. **사진 매칭 및 안전한 플레이스홀더 시스템 (`ManualImage.tsx`)**:
   - `public/manual/OpeningManual_{id}.jpg`와 자동 매칭.
   - 사진이 아직 없더라도 깨진 엑스박스 대신 "📷 OpeningManual_X.jpg 대기 중" 플레이스홀더 노출.
   - 사진 클릭 시 고화질 확대 라이트박스 모달 연동.
4. **A4 PDF 저장 및 인쇄 기능 (`window.print()` + `@media print`)**:
   - 인쇄 시 웹 UI 요소 자동 제거 및 건국대 SOP 공식 레터헤드(서명란 포함) 자동 렌더링.
5. **체크리스트 상태 및 진행률 게이지**:
   - 각 스텝 확인 완료 체크 시 진행률 실시간 반영 (0% ~ 100%).
   - 브라우저 `localStorage`에 자동 영속화되어 새로고침 후에도 유지됨.

---

## 5. 다음 작업 예정 사항 (Next Steps)

1. **실제 한글 파일 매뉴얼 텍스트 반영**:
   - 사용자가 작성한 실제 한글 파일 텍스트를 전달받아 `src/data/openingManual.ts`의 스텝 데이터 교체.
2. **실제 촬영 사진 배치**:
   - `public/manual/` 폴더에 `OpeningManual_1.jpg`, `OpeningManual_2.jpg` ... 사진 업로드.
3. **기능 확장 계획**:
   - 마감/퇴근 매뉴얼 (`ClosingManual`) 탭 추가.
   - 주요 장비(3D 프린터, 레이저 커터, CNC 등) 기초 사용법/안전 가이드 탭 추가.
   - Vercel 호스팅 연결 및 도메인 배포.

---

## 6. 개발 변경 이력 (Changelog)

| 날짜 | 구분 | 내용 |
| :--- | :--- | :--- |
| **2026-09-04** | **초기 기획** | 건국대학교 메이커스페이스 종합 기획서 및 디자인 제안서 작성 |
| **2026-09-04** | **환경 구축** | Next.js 16 + Tailwind v4 + Lucide React 프로젝트 초기화 |
| **2026-09-04** | **매뉴얼 구현**| 출근 매뉴얼 인터랙티브 뷰어, 인쇄 최적화, 라이트박스, 체크리스트 완성 |
| **2026-09-04** | **빌드 검증** | `npm run build` 정적 생성 테스트 통과 |
| **2026-09-04** | **문서화**   | 영구 개발 컨텍스트 파일 `DEV_CONTEXT.md` 작성 및 보관 체계 수립 |

## 7. 조교/근로장학생 맞춤 고도화 내역 (2026-09-04 업데이트)

1. **디자인 전면 개편 (Minimalist High-Tech UI)**:
   - 기존의 묵직한 녹색 그라디언트 박스를 걷어내고, 미니멀하고 단정한 현대식 카드 & 탭 레이아웃 적용.
   - 여백, 폰트 위계, 부드러운 호버 트랜지션, 정돈된 스텝 번호 노드와 콜아웃 블록으로 시각적 완성도 향상.
2. **연락처 정보 업데이트**:
   - 하단 비상 연락망 및 푸터에 **담당자: 조하민 (johamin3624@konkuk.ac.kr)** 반영.
3. **명칭 통일**:
   - '서명일지/운영일지' 대신 현장 취지에 맞춰 **'자가점검 리스트' (Self-Checklist)** 로 명칭 변경.
4. **상단 조교 / 근로장학생 전용 매뉴얼 메뉴 구성 및 추천**:
   - `🌅 오픈 자가점검`: 출근 직후 시설 개방 및 장비 예열 (현재 활성화)
   - `🌙 마감 자가점검`: 퇴근 전 소등, 전력 차단, 야간 출력 안전 확인
   - `🖨️ 장비 일일점검`: 3D프린터 베드, 레이저 칠러/광학 미러, 공조 필터 점검표
   - `📋 이용자 응대·안전수칙`: 학생 출입 시 안전교육 이수 확인, 보안경 지도, 노쇼 규정
   - `🚨 비상연락 & 사고대응`: 화재/화상/약품 비상 매뉴얼 및 조하민 조교 핫라인

## 8. 실무 출근 자가점검 7단계 및 동적 이미지 확장 시스템 (2026-09-04 업데이트)

1. **사용자 요청 7단계 오픈 루틴 100% 반영**:
   - `Step 1`: 사무실 좌측 기둥 불키기 (행정문의: https://kusf.konkuk.ac.kr/kusf/index.do / TEL 02-450-3114 안내 포함)
   - `Step 2`: 마주보는 반대편 기둥 불키기
   - `Step 3`: 직진후 좌회전 VR실 문 열기
   - `Step 4`: 문 열면 정면에 VR실 불 키는 버튼
   - `Step 5`: 나와서 좌회전 출입구 열려있는지 확인 및 불 키기
   - `Step 6`: 유턴해서 직진 후 왼쪽 기둥 코너에서 에어컨 3개 및 불 모두 키기
   - `Step 7`: 왼쪽 2단 좌석 좌측 끝쪽 기둥에서 좌석 하단 불 키기
2. **사진 기반 자동 섹션 확장 엔진 (`src/lib/manualLoader.ts`)**:
   - `public/manual/` 폴더 내 `OpeningManual_N.jpg` 파일을 감지하여, 8번 이후의 사진이 추가되면 코드 수정 없이 자동으로 신규 섹션이 렌더링되도록 구현.
3. **상단 점검 메뉴 3개 단일화**:
   - `1. 🌅 오픈 자가점검` (현재 7개 항목 활성화)
   - `2. 🌙 마감 자가점검` (기획안 모달 연동)
   - `3. 📖 조교/근로학생 업무 매뉴얼` (기획안 모달 연동)
4. **공식 센터 정보 및 행정 문의 연동**:
   - 공식 사이트: https://kusf.konkuk.ac.kr/kusf/index.do
   - 주소 및 연락처: 05029 서울시 광진구 능동로 120 건국대학교 TEL. 02-450-3114
   - 사이트 담당: 조하민 (johamin3624@konkuk.ac.kr)

## 9. OpeningManual_1 ~ 24 전체 사진 규격화 완료 (2026-09-04 업데이트)

1. **카카오톡 사진 파일명 리네이밍 및 1~24번 연속성 확보**:
   - `KakaoTalk_..._18.jpg` -> `OpeningManual_19.jpg`
   - `KakaoTalk_..._19.jpg` -> `OpeningManual_20.jpg`
   - `KakaoTalk_..._20.jpg` -> `OpeningManual_21.jpg`
   - `KakaoTalk_..._21.jpg` -> `OpeningManual_22.jpg`
   - `KakaoTalk_..._22.jpg` -> `OpeningManual_23.jpg`
   - `KakaoTalk_..._23.jpg` -> `OpeningManual_24.jpg`
2. **동적 섹션 확장 동작 확인**:
   - 총 24개 사진이 `public/manual/`에 완전 정렬되어, 사이트에서 1번부터 24번까지의 자가점검 섹션이 자동으로 렌더링됨.

## 10. 이미지 로딩 최적화 및 사이트 담당 직책 수정 (2026-09-04 업데이트)

1. **사진 파일 고효율 압축 최적화 (85.5% 용량 절감)**:
   - 원본 사진 24장 전체 총 56.65 MB -> **8.23 MB**로 대폭 압축 최적화 (Sharp mozjpeg 82, 1600px 리사이징).
   - 스마트폰 원본의 EXIF 회전각을 보존(`rotate()`)하여 사진 회전 오류 방지.
2. **Next.js `<Image />` 컴포넌트 업그레이드 & 레이지 로딩**:
   - `ManualImage.tsx`에 `next/image`를 도입하여 Vercel Edge WebP 변환 및 클라이언트 뷰포트에 맞춘 반응형 서빙 적용.
   - 상위 2개 스텝을 제외한 모든 이미지에 `loading="lazy"`, `decoding="async"` 적용하여 초기 페이지 로딩 속도 극대화.
   - 로딩 중 스켈레톤 펄스 애니메이션 탑재로 레이아웃 흔들림(CLS) 방지.
3. **직책 명칭 변경**:
   - '총괄 담당'에서 **'사이트 담당'**으로 전면 수정: `사이트 담당: 조하민 (johamin3624@konkuk.ac.kr)`.
