export interface WorkSchedule {
  role: string;
  semesterTime: string;
  vacationTime: string;
  note?: string;
}

export interface CleaningRoutine {
  timing: string;
  title: string;
  tasks: string[];
}

export interface SpaceGuide {
  spaceName: string;
  badge: string;
  requirements: string[];
  inquiryTarget: string;
}

export interface StaffManualData {
  title: string;
  subTitle: string;
  lastUpdated: string;
  workSchedules: WorkSchedule[];
  basicRules: {
    title: string;
    description: string;
    details: string[];
    tag: string;
  }[];
  cleaningRoutines: CleaningRoutine[];
  spaceGuides: SpaceGuide[];
}

export const staffManualData: StaffManualData = {
  title: "조교 · 근로학생 표준 업무 매뉴얼",
  subTitle: "건국대학교 메이커스페이스센터 원활한 현장 운영 및 이용자 지원 표준 가이드",
  lastUpdated: "2026-09-04",
  workSchedules: [
    {
      role: "근로학생",
      semesterTime: "09:00 ~ 17:30",
      vacationTime: "10:00 ~ 17:00",
      note: "학기 중 / 방학 중 근무 시간 상이함에 주의",
    },
    {
      role: "조교",
      semesterTime: "09:00 ~ 20:00",
      vacationTime: "09:00 ~ 20:00",
      note: "마감 시(20시) 전체 소등 및 최종 문단속 담당",
    },
  ],
  basicRules: [
    {
      title: "근무 태도",
      tag: "기본 자세",
      description: "출퇴근 시 밝게 인사하기 및 정규 근무 시간을 철저히 준수합니다.",
      details: [
        "출근 시 센터 스태프 및 조교에게 인사",
        "근무 시작 시간 및 종료 시간 엄수 (지각 및 조퇴 금지)",
      ],
    },
    {
      title: "근무 일정 조정",
      tag: "사전 조율",
      description:
        "개인 사정(시험, 학과 행사 등)으로 근무가 불가능할 경우, 최소 일주일 전 담당자에게 사전 연락하여 일정을 조정합니다.",
      details: [
        "최소 일주일 전 사전 보고 원칙 (업무 공백 방지)",
        "대체 근무자 지정 필요 시 조교 및 담당자와 협의",
      ],
    },
    {
      title: "방문객 응대 매뉴얼",
      tag: "친절 응대",
      description:
        "학생이나 외부 손님이 사무실/센터를 방문할 경우, 먼저 다가가 친절하게 안내합니다.",
      details: [
        "방문객 발견 즉시 \"어떤 일로 오셨나요?\" 먼저 인사 및 응대",
        "용건 확인 후 담당 부서, 연구원 또는 행정실로 정확히 연결",
      ],
    },
    {
      title: "부재중 전화 수신 요령",
      tag: "전화 업무",
      description:
        "담당자 부재 중 전화가 걸려올 경우, 핵심 사항을 누락 없이 메모하여 전달합니다.",
      details: [
        "발신자 성함, 소속 확인",
        "연락 가능한 휴대폰 번호 기재",
        "통화 전달 내용 및 요청 사항 꼼꼼히 메모 남기기",
      ],
    },
  ],
  cleaningRoutines: [
    {
      timing: "오전 출근 시",
      title: "공간 개방 및 환경 설비 가동",
      tasks: [
        "전체 공간 문 열기, 실내 조명 점등, 냉난방기 가동 (※ 금속실, 목공실은 안전상 제외)",
        "1층 및 중층 쓰레기통 비우기 및 분리수거함 정돈",
      ],
    },
    {
      timing: "출근 직후 공통 관리",
      title: "1층 메인 홀 청결 유지",
      tasks: [
        "1층 전체 공용 공간 바닥 청소 및 이물질 정리",
        "오픈 작업대 및 안내 데스크 테이블 물티슈로 깨끗이 닦기",
        "의자 정렬 및 공용 물품 제자리 정돈",
      ],
    },
    {
      timing: "퇴근 시 (20:00 마감)",
      title: "안전 소등 및 장비실 잠금 점검",
      tasks: [
        "전 구역 냉난방기 전원 OFF 확인",
        "실내 전체 조명 소등",
        "3D프린터실, VR실 등 각 장비실 및 외부 출입문 잠금 상태 최종 확인 후 퇴근",
      ],
    },
  ],
  spaceGuides: [
    {
      spaceName: "3D프린터실",
      badge: "K-MOOC 교육 필수",
      requirements: [
        "이용 전, 프린터실 내부 QR코드(K-MOOC) 기초교육 4개 강의 이수 필수 안내",
        "교육 이수 완료 후, 행정실에서 '공간대여신청서' 작성 후 사용 가능",
      ],
      inquiryTarget: "자세한 장비 사용 및 설정 문의는 프린터실 내 기재된 전담 연구원에게 안내",
    },
    {
      spaceName: "VR실",
      badge: "신청서 작성 & 1주일 연장",
      requirements: [
        "행정실에서 'VR실 사용 신청서' 작성 후 사용 가능",
        "지속 사용 시 1주일 단위로 'VR실 사용 신청서' 및 '장비사용안내' 연장 갱신 필수 안내",
      ],
      inquiryTarget: "VR 기기 결함 및 라이선스 관련 문의는 담당 조교에게 문의",
    },
    {
      spaceName: "컨퍼런스홀 · 오픈형강의장 · 무한상상실",
      badge: "사전 대관 승인",
      requirements: [
        "학과 행사, 캡스톤 발표, 세미나 등 사전 대관 승인 필요",
        "이용 희망 시 일정 및 인원 확인 후 담당자에게 직접 문의 안내",
      ],
      inquiryTarget: "센터 담당자 문의",
    },
  ],
};
