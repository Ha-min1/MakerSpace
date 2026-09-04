export interface ManualStep {
  id: number;
  title: string;
  category: string;
  description: string;
  checkPoints: string[];
  warning?: string;
  tip?: string;
  linkUrl?: string;
  linkText?: string;
  imageName: string;
  imageNames?: string[];
  estimatedMinutes?: number;
}

export interface ManualMeta {
  title: string;
  subTitle: string;
  version: string;
  lastUpdated: string;
  targetRole: string;
  location: string;
  address: string;
  tel: string;
  officialSiteUrl: string;
  managerName: string;
  managerEmail: string;
}

export const manualMeta: ManualMeta = {
  title: "출근 & 오픈 자가점검 리스트",
  subTitle: "건국대학교 메이커스페이스 조교 및 근로장학생 일일 오픈 표준 운영 절차 (SOP)",
  version: "v2.0",
  lastUpdated: "2026-09-04",
  targetRole: "조교 / 근로장학생 / 운영 스태프",
  location: "건국대학교 신공학관 메이커스페이스",
  address: "05029 서울시 광진구 능동로 120 건국대학교",
  tel: "02-450-3114",
  officialSiteUrl: "https://kusf.konkuk.ac.kr/kusf/index.do",
  managerName: "조하민",
  managerEmail: "johamin3624@konkuk.ac.kr",
};

export const openingManualSteps: ManualStep[] = [
  {
    id: 1,
    title: "사무실 좌측 기둥 불키기",
    category: "조명 점등",
    description:
      "메이커스페이스 출근 후 가장 먼저 사무실(117호 행정실) 좌측 오렌지색 기둥에 위치한 전등 스위치를 켭니다.\n\n※ 이용자 및 외부 방문객의 행정 문의는 공식 웹사이트(https://kusf.konkuk.ac.kr/kusf/index.do)에 기재된 연락처(TEL. 02-450-3114)로 안내해 주시기 바랍니다.",
    checkPoints: [
      "사무실(117호) 좌측 기둥 스위치 위치 확인",
      "스위치 ON 조작 및 복도 조명 점등 확인",
      "방문객 행정 문의 시 공식 사이트 연락처로 안내",
    ],
    linkUrl: "https://kusf.konkuk.ac.kr/kusf/index.do",
    linkText: "건국대 메이커스페이스센터 공식 행정문의 사이트",
    tip: "행정 문의 대표 번호: 02-450-3114 (서울시 광진구 능동로 120 건국대학교)",
    imageName: "OpeningManual_1.jpg",
    estimatedMinutes: 2,
  },
  {
    id: 2,
    title: "마주보는 반대편 기둥 불키기",
    category: "조명 점등",
    description:
      "사무실 맞은편에 마주보고 서 있는 반대편 기둥으로 이동하여 벽면 스위치를 켭니다. 중앙 오픈 작업 공간의 메인 라인 조명이 정상적으로 켜지는지 확인합니다.",
    checkPoints: [
      "마주보는 반대편 기둥 스위치 위치 확인",
      "스위치 ON 조작 및 메인 통로/테이블 라인 조명 점등 확인",
    ],
    imageName: "OpeningManual_2.jpg",
    imageNames: ["OpeningManual_2.jpg", "OpeningManual_2_1.jpg"],
    estimatedMinutes: 2,
  },
  {
    id: 3,
    title: "직진후 좌회전 VR실 문 열기",
    category: "공간 개방",
    description:
      "통로를 따라 직진한 후 좌회전하여 VR실 출입구로 이동합니다. VR실 도어락 잠금을 해제하고 출입문을 활짝 개방합니다.",
    checkPoints: [
      "통로 직진 후 좌회전하여 VR실 입구 도달",
      "VR실 출입문 잠금 해제 및 개방 상태 유지",
    ],
    imageName: "OpeningManual_3.jpg",
    estimatedMinutes: 2,
  },
  {
    id: 4,
    title: "문 열면 정면에 VR실 불 키는 버튼",
    category: "조명 점등",
    description:
      "VR실 문을 열고 들어가 정면에 바로 보이는 조명 스위치 버튼을 눌러 VR실 실내 조명을 켭니다.",
    checkPoints: [
      "VR실 문 열고 정면 스위치 버튼 확인",
      "버튼 조작 및 VR실 내부 조명 정상 점등 확인",
    ],
    imageName: "OpeningManual_4.jpg",
    estimatedMinutes: 1,
  },
  {
    id: 5,
    title: "나와서 좌회전 출입구 열려있는지 확인 및 불 키기",
    category: "출입구/조명",
    description:
      "VR실에서 나와 좌회전하여 외부 주 출입구 방향으로 이동합니다. 출입구가 정상적으로 열려있는지 확인하고, 출입구 부근 조명 스위치를 켭니다.",
    checkPoints: [
      "VR실 퇴실 후 좌회전하여 출입구 이동",
      "외부 출입구 잠금 해제 및 개방 상태 확인",
      "출입구 구역 조명 스위치 점등",
    ],
    warning: "출입구가 잠겨있을 경우 자동문 스위치를 켜고 개방 상태로 전환하세요.",
    imageName: "OpeningManual_5.jpg",
    estimatedMinutes: 2,
  },
  {
    id: 6,
    title: "유턴해서 직진 후 왼쪽 기둥 코너에서 에어컨 3개 및 불 모두 키기",
    category: "냉난방/조명",
    description:
      "출입구에서 유턴하여 직진한 뒤, 왼쪽 기둥 코너로 이동합니다. 해당 코너에 위치한 컨트롤러 및 스위치에서 에어컨 3대와 주변 조명을 모두 켭니다.",
    checkPoints: [
      "유턴 후 직진하여 왼쪽 기둥 코너 도달",
      "기둥 코너 조명 스위치 전체 점등",
      "에어컨 3대 전원 ON 가동 (적정 온도 24~26℃ 확인)",
    ],
    tip: "여름철/겨울철 쾌적한 실내 환경 유지를 위해 3대 모두 정상 송풍되는지 확인합니다.",
    imageName: "OpeningManual_6.jpg",
    estimatedMinutes: 3,
  },
  {
    id: 7,
    title: "왼쪽 2단 좌석 좌측 끝쪽 기둥에서 좌석 하단 불 키기",
    category: "특화 조명",
    description:
      "왼편의 2단 계단형 좌석 구역으로 이동하여, 좌측 끝쪽에 위치한 기둥 스위치를 조작해 좌석 하단 간접 조명을 켭니다.",
    checkPoints: [
      "왼쪽 2단 좌석 구역 좌측 끝 기둥 위치 확인",
      "스위치 조작 후 좌석 하단 라인 조명 정상 점등 확인",
      "안전 보행을 위한 하단 조도 이상 유무 점검",
    ],
    imageName: "OpeningManual_7.jpg",
    estimatedMinutes: 2,
  },
];
