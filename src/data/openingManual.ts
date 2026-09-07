export interface ManualStep {
  id: number;
  locationKey?: string;
  locationName?: string;
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

export interface SpaceLocationMeta {
  key: string;
  order: number;
  name: string;
  category: string;
}

export const SPACE_LOCATIONS: SpaceLocationMeta[] = [
  { key: "FrontOpenDoor", order: 1, name: "앞쪽 출입구", category: "출입/보안/조명" },
  { key: "VRSpace", order: 2, name: "VR실", category: "공간 개방/냉난방/조명" },
  { key: "ConferenceHall", order: 3, name: "컨퍼런스홀", category: "전원/조명" },
  { key: "Office", order: 4, name: "행정실", category: "업무 공간/출근 세팅" },
  { key: "ProjectSpace", order: 5, name: "프로젝트 공간", category: "메인 홀/조명/에어컨" },
  { key: "3DSpace", order: 6, name: "3D프린터실", category: "특수 장비/항온항습/보안" },
  { key: "BackOpenDoor", order: 7, name: "뒤쪽 출입구", category: "출입/보안/조명" },
  { key: "InfiniteImagination", order: 8, name: "무한상상실", category: "창의 공간/시설 점검" },
  { key: "OpenedLecture", order: 9, name: "오픈형 강의장", category: "강의실/조명/좌석" },
  { key: "SecondFloorHall", order: 10, name: "설계실 근처 2층 복도", category: "2층 복도/이동 동선" },
];

export const manualMeta: ManualMeta = {
  title: "출근 & 오픈 자가점검 리스트",
  subTitle: "건국대학교 메이커스페이스 조교 및 근로장학생 일일 오픈 표준 운영 절차 (SOP)",
  version: "v2.1",
  lastUpdated: "2026-09-07",
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
    locationKey: "FrontOpenDoor",
    locationName: "앞쪽 출입구",
    title: "앞쪽 출입구 개방 및 복도 전등 점등",
    category: "출입/보안/조명",
    description:
      "두 개의 출입구 중 먼저 신공학관의 정문으로 들어왔을 때, 메인 홀과 바로 연결된 앞쪽 출입구를 개방합니다.\n\n문 우측 보안 장치에 카드를 접촉하면 보안이 해제됩니다. 문을 개방한 뒤 문 오른쪽에 위치한 복도용 전등 스위치를 켭니다.",
    checkPoints: [
      "신공학관 정문 통과 후 메인 홀 앞쪽 출입구 도착",
      "문 우측 보안 장치에 카드 접촉하여 보안 해제",
      "앞쪽 출입문 개방 상태 유지",
      "문 오른쪽에 위치한 복도용 전등 스위치 ON 점등",
    ],
    imageName: "OpeningManual_FrontOpenDoor_1.jpg",
    imageNames: ["OpeningManual_FrontOpenDoor_1.jpg", "OpeningManual_FrontOpenDoor_2.jpg"],
    estimatedMinutes: 2,
  },
  {
    id: 2,
    locationKey: "VRSpace",
    locationName: "VR실",
    title: "VR실 보안 해제 및 냉난방/조명 확인",
    category: "공간 개방/냉난방",
    description:
      "정면으로 쭉 들어오면 왼쪽에 위치한 VR실을 확인할 수 있습니다.\n\n1번과 마찬가지로 보안 장치를 해제하여 문을 열고, 필요한 경우 에어컨과 불을 켜놓습니다.",
    checkPoints: [
      "메인 통로 직진 후 좌측 VR실 출입문 도착",
      "보안 장치 카드 태깅으로 잠금 해제 및 문 개방",
      "VR실 실내 조명 점등 확인",
      "필요한 경우 실내 에어컨 가동",
    ],
    imageName: "OpeningManual_VRSpace_1.jpg",
    imageNames: ["OpeningManual_VRSpace_1.jpg", "OpeningManual_VRSpace_2.jpg"],
    estimatedMinutes: 2,
  },
  {
    id: 3,
    locationKey: "ConferenceHall",
    locationName: "컨퍼런스홀",
    title: "컨퍼런스홀 전원 스위치 ON",
    category: "전원/조명",
    description:
      "VR실에서 나와 정면을 보면 사진과 같이 컨퍼런스홀의 전원 스위치를 확인할 수 있습니다.\n\n스위치 오른쪽으로 눌러 전원을 켭니다.",
    checkPoints: [
      "VR실 퇴실 후 정면 컨퍼런스홀 벽면 전원 스위치 확인",
      "오른쪽으로 눌러 컨퍼런스홀 메인 전원 ON",
      "내부 조명 및 전원 정상 공급 점검",
    ],
    imageName: "OpeningManual_ConferenceHall_1.jpg",
    imageNames: ["OpeningManual_ConferenceHall_1.jpg", "OpeningManual_ConferenceHall_2.jpg"],
    estimatedMinutes: 1,
  },
  {
    id: 4,
    locationKey: "Office",
    locationName: "행정실",
    title: "행정실 문 개방 및 출근 세팅",
    category: "행정실/출근 세팅",
    description:
      "행정실의 문을 열고 불을 켜고, 필요한 경우 출근 세팅을 진행합니다.\n\n※ 이용자 및 외부 방문객의 행정 문의는 공식 웹사이트(https://kusf.konkuk.ac.kr/kusf/index.do) 및 센터 대표 번호(TEL. 02-450-3114)로 안내해 주시기 바랍니다.",
    checkPoints: [
      "행정실 출입문 개방 및 실내 조명 점등",
      "업무용 PC, 행정 서식 등 일일 출근 세팅 진행",
      "방문객 행정 문의 시 공식 사이트 연락처(02-450-3114) 안내",
    ],
    linkUrl: "https://kusf.konkuk.ac.kr/kusf/index.do",
    linkText: "건국대 메이커스페이스센터 공식 행정문의 사이트",
    tip: "행정 문의 대표 번호: 02-450-3114 (서울시 광진구 능동로 120 건국대학교)",
    imageName: "OpeningManual_Office_1.jpg",
    imageNames: ["OpeningManual_Office_1.jpg"],
    estimatedMinutes: 3,
  },
  {
    id: 5,
    locationKey: "ProjectSpace",
    locationName: "프로젝트 공간",
    title: "프로젝트 공간 기둥 조명 / 2층 좌석 / 에어컨 가동",
    category: "메인 홀/조명/에어컨",
    description:
      "프로젝트 공간에서는 행정실 왼쪽 기둥에 있는 불 스위치를 엽니다.\n\n★ 중요: 이 스위치와 마주보는 기둥의 스위치는 절대 건드리지 않습니다. 마주보는 스위치는 항상 오른쪽을 눌러 켜져 있는 상태가 유지되어야 합니다.\n\n세 번째 사진의 2층 좌석 하단 조명은 보통 켜놓습니다. 4번째 사진의 불 스위치와 3개의 에어컨 스위치도 켜놓습니다.",
    checkPoints: [
      "행정실 왼쪽 기둥 조명 스위치 ON",
      "★ 마주보는 반대편 기둥 스위치 조작 금지 (항상 오른쪽 눌러 켜진 상태 유지)",
      "2층 좌석 하단 간접 조명 점등 (보통 켜놓음)",
      "4번째 사진 코너 불 스위치 및 에어컨 3대 전체 ON",
    ],
    warning: "마주보는 기둥의 스위치는 절대 끄지 마세요. 항상 오른쪽이 눌려 켜져 있는 상태를 유지해야 합니다.",
    tip: "프로젝트 공간은 이용자가 가장 많은 메인 홀입니다. 에어컨 3대 모두 송풍 및 냉방이 정상 작동하는지 확인하세요.",
    imageName: "OpeningManual_ProjectSpace_1.jpg",
    imageNames: [
      "OpeningManual_ProjectSpace_1.jpg",
      "OpeningManual_ProjectSpace_2.jpg",
      "OpeningManual_ProjectSpace_3.jpg",
      "OpeningManual_ProjectSpace_4.jpg",
    ],
    estimatedMinutes: 4,
  },
  {
    id: 6,
    locationKey: "3DSpace",
    locationName: "3D프린터실",
    title: "3D프린터실 보안 해제 및 조명/항온항습 점검",
    category: "3D프린터실/특수 장비",
    description:
      "3D 프린터실에서는 정면 우측 보안 장치를 카드 접촉으로 해제하고, 정면 좌측 VR 앞쪽 불을 켠 뒤 들어가면 책상 뒤쪽 불 켜는 스위치가 있습니다.\n\n좌측 에어컨 온도는 정밀 조형과 필라멘트 품질을 위해 항상 일정하게 유지되어야 합니다.\n\n※ 관련 문의사항이 있으면 한봉원 연구원의 연락처(010-9910-9707)로 문의하시면 됩니다.",
    checkPoints: [
      "정면 우측 보안 장치에 카드 접촉하여 잠금 해제",
      "정면 좌측 VR 앞쪽 조명 ON 후 실내 진입",
      "실내 책상 뒤쪽 전등 스위치 ON 점등",
      "좌측 에어컨 항온 유지 상태 점검 (온도 임의 조작 주의)",
      "장비 이상이나 문의 시 한봉원 연구원(010-9910-9707) 핫라인 연락",
    ],
    tip: "3D 프린터실 온·습도 유지 및 장비 관련 문의: 한봉원 연구원 (010-9910-9707)",
    imageName: "OpeningManual_3DSpace_1.jpg",
    imageNames: [
      "OpeningManual_3DSpace_1.jpg",
      "OpeningManual_3DSpace_2.jpg",
      "OpeningManual_3DSpace_3.jpg",
    ],
    estimatedMinutes: 3,
  },
  {
    id: 7,
    locationKey: "BackOpenDoor",
    locationName: "뒤쪽 출입구",
    title: "뒤쪽 출입구 개방 및 조명 점등",
    category: "출입구/조명",
    description:
      "VR실을 나와 왼쪽으로 들어가면 뒤쪽 출입구가 위치해 있습니다.\n\n오른쪽 불 켜는 스위치를 통해 불을 켜고, 만약 문이 잠겨있으면 잠금을 해제하여 열어주면 됩니다.",
    checkPoints: [
      "VR실 나와 좌측 통로 진입 후 뒤쪽 출입구 도착",
      "문 오른쪽 전등 스위치 눌러 조명 점등",
      "출입문 잠금 상태 점검 및 잠겨있을 경우 개방 조치",
    ],
    imageName: "OpeningManual_BackOpenDoor_1.jpg",
    imageNames: ["OpeningManual_BackOpenDoor_1.jpg"],
    estimatedMinutes: 2,
  },
  {
    id: 8,
    locationKey: "InfiniteImagination",
    locationName: "무한상상실",
    title: "무한상상실 개방 및 시설 점검",
    category: "무한상상실/창의 공간",
    description:
      "아이디어 구상 및 메이커 협업 공간인 무한상상실의 출입구를 확인하고 조명을 켭니다.\n\n실내 테이블, 화이트보드, 공용 작업대의 청결 상태와 기본 비품을 점검합니다.",
    checkPoints: [
      "무한상상실 출입구 잠금 해제 및 개방",
      "실내 메인 조명 스위치 점등",
      "작업대 및 공용 비품 정돈 상태 육안 확인",
    ],
    imageName: "OpeningManual_InfiniteImagination_1.jpg",
    imageNames: [
      "OpeningManual_InfiniteImagination_1.jpg",
      "OpeningManual_InfiniteImagination_2.jpg",
    ],
    estimatedMinutes: 2,
  },
  {
    id: 9,
    locationKey: "OpenedLecture",
    locationName: "오픈형 강의장",
    title: "오픈형 강의장 조명 및 좌석 점검",
    category: "강의장/세미나",
    description:
      "메이커스페이스 내 교육 및 세미나가 열리는 오픈형 강의장의 조명을 켭니다.\n\n수강용 책걸상 배치와 주변 통로의 통행 환경이 바르게 정돈되어 있는지 확인합니다.",
    checkPoints: [
      "오픈형 강의장 구역 조명 스위치 ON",
      "강의용 좌석 및 테이블 정돈 상태 확인",
      "주변 환기 및 냉난방 기기 가동 확인",
    ],
    imageName: "OpeningManual_OpenedLecture_1.jpg",
    imageNames: [
      "OpeningManual_OpenedLecture_1.jpg",
      "OpeningManual_OpenedLecture_2.jpg",
    ],
    estimatedMinutes: 2,
  },
  {
    id: 10,
    locationKey: "SecondFloorHall",
    locationName: "설계실 근처 2층 복도",
    title: "설계실 근처 2층 복도 조명 및 이동 동선 점검",
    category: "2층 복도/이동 동선",
    description:
      "설계실과 연결된 2층 복도 구역으로 이동하여 조명 스위치를 켭니다.\n\n학생들의 주요 이동 동선 상에 장애물이나 안전 위험 요소가 없는지, 비상구 표시등이 정상 점등되는지 점검합니다.",
    checkPoints: [
      "설계실 근처 2층 복도 전등 스위치 ON 점등",
      "계단 및 2층 통로 보행 안전 상태 점검",
      "비상 대피로 및 소화 시설 주변 환경 확인",
    ],
    imageName: "OpeningManual_SecondFloorHall_1.jpg",
    imageNames: [
      "OpeningManual_SecondFloorHall_1.jpg",
      "OpeningManual_SecondFloorHall_2.jpg",
    ],
    estimatedMinutes: 2,
  },
];
