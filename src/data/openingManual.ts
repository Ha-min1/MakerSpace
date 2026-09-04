export interface ManualStep {
  id: number;
  title: string;
  category: string;
  description: string;
  checkPoints: string[];
  warning?: string;
  tip?: string;
  imageName: string;
  estimatedMinutes?: number;
}

export interface ManualMeta {
  title: string;
  subTitle: string;
  version: string;
  lastUpdated: string;
  targetRole: string;
  location: string;
  managerName: string;
  managerEmail: string;
}

export const manualMeta: ManualMeta = {
  title: "출근 & 오픈 자가점검 리스트",
  subTitle: "건국대학교 메이커스페이스 조교 및 근로장학생 일일 운영 표준 절차",
  version: "v1.3",
  lastUpdated: "2026-09-04",
  targetRole: "조교 / 근로장학생 / 운영 스태프",
  location: "건국대학교 신공학관 메이커스페이스",
  managerName: "조하민",
  managerEmail: "johamin3624@konkuk.ac.kr",
};

export const openingManualSteps: ManualStep[] = [
  {
    id: 1,
    title: "행정 문의 안내 및 117호 행정실 확인",
    category: "행정/안내",
    description:
      "행정 관련 문의는 공식 사이트에 기재된 연락처로 할 것을 안내 및 요청합니다. 신공학관 117호 행정실 앞 안내사항을 점검하고, 방문객의 일반 행정/운영 문의 시 공식 사이트 연락처로 안내하세요.",
    checkPoints: [
      "행정 문의는 공식 사이트 기재 연락처로 진행하도록 안내",
      "신공학관 117호 메이커스페이스 행정실 앞 상태 확인",
      "점심시간(12:00~13:00) 및 운영시간 준수 확인",
    ],
    tip: "건국대학교 메이커스페이스 공식 사이트(https://kusf.konkuk.ac.kr) 또는 지정 행정 연락처 안내",
    imageName: "OpeningManual_1.jpg",
    estimatedMinutes: 2,
  },
  {
    id: 2,
    title: "메인 배전반 전원 및 실내 조명 일괄 점등",
    category: "전력/설비",
    description:
      "사무실 및 실습실 입구 우측에 위치한 전기 배전반(분전함)을 열고 조명, 콘센트, 공조 설비의 차단기가 정상 위치(올림)에 있는지 점검한 후 전체 구역 조명을 켭니다.",
    checkPoints: [
      "배전반 차단기 누전 트립 여부 육안 확인",
      "메인 홀, 3D 프린터실, 레이저 가공실 조명 점등",
      "작업대 개별 LED 스탠드 전원 상태 확인",
    ],
    warning: "반드시 건조한 손으로 조작하며, 트립 발생 시 무리하게 올리지 말고 관리자에게 보고하세요.",
    imageName: "OpeningManual_2.jpg",
    estimatedMinutes: 5,
  },
  {
    id: 3,
    title: "환기 공조 시스템 및 집진 덕트 가동",
    category: "환경/안전",
    description:
      "실내 쾌적한 공기질 유지와 화학 수지 냄새 배출을 위해 메인 환기 공조 시스템을 가동합니다. 레이저 가공실 및 후가공실의 배기 덕트 댐퍼가 열려 있는지 확인합니다.",
    checkPoints: [
      "벽면 공조 컨트롤러 '환기 모드' 정상 가동",
      "레이저 가공실 독립 배기 덕트 흡입력 확인",
      "소화기 및 비상 대피로 유도등 점검",
    ],
    tip: "3D 프린터 연속 가동 시 미세 분진 배출을 위해 환기 시설은 항시 켜두는 것이 기본 원칙입니다.",
    imageName: "OpeningManual_3.jpg",
    estimatedMinutes: 5,
  },
  {
    id: 4,
    title: "3D 프린터 구역 예열 및 베드 청결 점검",
    category: "장비 점검",
    description:
      "3D 프린팅 팜 장비 전원을 켜고, 전날 야간에 예약된 장기 출력물의 완료 여부를 점검합니다. 수령 보관함으로 완료물을 이동하고, 빌드 플레이트(베드) 잔여물을 청소한 후 예열을 진행합니다.",
    checkPoints: [
      "전일 야간 출력 완료물 확인 및 수령 대기 트레이 이동",
      "빌드 플레이트 이물질 제거 및 IPA 알코올 탈지",
      "필라멘트 잔량(스풀 무게 확인) 및 노즐 상태 점검",
      "출력 대기 장비 기본 예열(Preheat) 세팅",
    ],
    warning: "노즐 및 히팅베드는 고온(200℃ 이상)이므로 반드시 전용 도구를 사용하세요.",
    imageName: "OpeningManual_4.jpg",
    estimatedMinutes: 10,
  },
  {
    id: 5,
    title: "레이저 가공기 냉각 칠러(Chiller) 수온 및 미러 확인",
    category: "장비 점검",
    description:
      "레이저 커터 본체를 켜기 전에 반드시 수냉식 칠러 전원을 먼저 켜서 냉각수 수온(18℃~22℃)을 확인합니다. 반사 미러 및 포커스 렌즈 표면의 오염 여부를 확인합니다.",
    checkPoints: [
      "칠러 전원 선가동 및 수온 게이지 정상 범위(18~22℃) 확인",
      "컴프레서 에어 어시스트 압력 게이지 확인",
      "허니컴 베드 하단 분진 트레이 청소 상태 점검",
    ],
    warning: "칠러가 작동하지 않는 상태에서 레이저를 가동하면 레이저 튜브가 즉시 파손됩니다. 필수 확인!",
    imageName: "OpeningManual_5.jpg",
    estimatedMinutes: 7,
  },
  {
    id: 6,
    title: "안내 데스크 PC 부팅 및 예약 시스템 확인",
    category: "운영/전산",
    description:
      "안내 카운터 관리용 PC를 부팅하고 메이커스페이스 관리 포털에 접속합니다. 당일 장비 예약 타임테이블과 안전교육 이수자 목록을 확인하고 현장 체크인 기기를 준비합니다.",
    checkPoints: [
      "안내 데스크 PC 부팅 및 포털 로그인",
      "금일 3D 프린터 / 레이저 커터 시간대별 예약자 명단 확인",
      "출입 태블릿 및 현장 방문자 체크인 준비",
    ],
    imageName: "OpeningManual_6.jpg",
    estimatedMinutes: 5,
  },
  {
    id: 7,
    title: "공용 수공구함 & 소모품 선반 정돈",
    category: "공간 관리",
    description:
      "학생들이 사용하는 공용 수공구(니퍼, 인두기, 버니어 캘리퍼스 등)가 섀도우 보드 위치에 올바르게 제자리에 있는지 점검하고, 부족한 테이프 및 사포 등 소모품을 채웁니다.",
    checkPoints: [
      "공구 벽면 섀도우 보드 전 도구 제자리 반납 확인",
      "학생용 보안경 소독 및 비치함 정돈",
      "납땜 작업대 인두기 팁 클리너 수분 보충",
    ],
    tip: "공구 분실이 잦은 품목은 오픈 시 번호표 확인 후 불출합니다.",
    imageName: "OpeningManual_7.jpg",
    estimatedMinutes: 5,
  },
  {
    id: 8,
    title: "오픈 자가점검 리스트 완료 확인 및 개방",
    category: "업무 시작",
    description:
      "1번부터 7번까지의 모든 점검 항목이 빠짐없이 완료되었는지 본 자가점검 리스트를 최종 확인합니다. 확인 후 센터 메인 출입문을 활성화하여 이용자 입실을 시작합니다.",
    checkPoints: [
      "본 웹 자가점검 리스트 100% 완료 체크",
      "특이사항 발생 시 인수인계 메모 기록",
      "출입문 개방 및 이용자 친절 응대 시작",
    ],
    imageName: "OpeningManual_8.jpg",
    estimatedMinutes: 2,
  },
];
