export interface ManualStep {
  id: number;
  title: string;
  category: string;
  description: string;
  checkPoints: string[];
  warning?: string;
  tip?: string;
  imageName: string; // 예: OpeningManual_1.jpg
  estimatedMinutes?: number;
}

export interface ManualMeta {
  title: string;
  subTitle: string;
  version: string;
  lastUpdated: string;
  targetRole: string;
  location: string;
}

export const manualMeta: ManualMeta = {
  title: "건국대학교 메이커스페이스 출근 & 오픈 매뉴얼",
  subTitle: "운영 스태프 및 근로장학생을 위한 일일 개방 점검 표준 운영 절차 (SOP)",
  version: "v1.2",
  lastUpdated: "2026-09-04",
  targetRole: "운영 매니저 / 근로장학생 / 테크니컬 스태프",
  location: "건국대학교 신공학관 / 메이커스페이스 센터",
};

export const openingManualSteps: ManualStep[] = [
  {
    id: 1,
    title: "센터 출입문 개방 및 보안 시스템 해제",
    category: "출입 & 보안",
    description:
      "메이커스페이스 출입구의 도어락 비밀번호를 입력하거나 마스터 카드키를 태그하여 보안 시스템을 해제합니다. 출입문 자동문 스위치가 정상 작동하는지 확인하고, 외부 이용자 안내 팻말을 '운영 중'으로 전환합니다.",
    checkPoints: [
      "도어락 마스터 키 태그 및 경비 보안 해제 확인",
      "자동문 열림 스위치 ON 및 동작 테스트",
      "출입문 앞 '오늘의 운영 시간' 안내 배너 거치",
    ],
    warning: "보안 해제 후 경비 벨이 오작동할 경우 즉시 중앙경비실(02-450-XXXX)로 연락하세요.",
    tip: "카드키 분실 시 행정실 비상 보관함을 확인하세요.",
    imageName: "OpeningManual_1.jpg",
    estimatedMinutes: 3,
  },
  {
    id: 2,
    title: "메인 배전반 전원 및 실내 조명 일괄 점등",
    category: "전력 & 설비",
    description:
      "사무실 및 실습실 입구 우측에 위치한 메인 배전반(전기 분전함)을 열고, '조명', '콘센트 메인', '공조기' 차단기 레버가 모두 정상 위치(올림)에 있는지 확인한 후 각 구역별 조명 스위치를 켭니다.",
    checkPoints: [
      "배전반 차단기 누전 트립 여부 확인",
      "공용 메인 작업 공간, 3D 프린터실, 레이저 가공실 조명 점등",
      "작업대 개별 LED 스탠드 전원 확인",
    ],
    warning: "배전반 내부를 만지거나 물 묻은 손으로 조작하지 마세요.",
    imageName: "OpeningManual_2.jpg",
    estimatedMinutes: 5,
  },
  {
    id: 3,
    title: "환기 공조 시스템 및 집진 설비 가동",
    category: "환경 & 안전",
    description:
      "화학 수지 냄새 및 미세 분진 배출을 위해 메인 환기 공조 시스템(덕트)을 가동합니다. 특히 레이저 가공실과 후가공 샌딩 부스의 배기 팬이 정상적으로 바람을 흡입하고 있는지 배기구 인디케이터를 점검합니다.",
    checkPoints: [
      "벽면 공조 컨트롤러 '환기 모드' 강(High)으로 작동",
      "레이저 가공실 독립 배기 닥트 댐퍼 개방 및 작동 확인",
      "비상 대피로 유도등 및 소화기 배치 상태 이상 유무 확인",
    ],
    tip: "날씨가 쌀쌀한 환절기에도 3D 프린팅 냄새 방지를 위해 환기팬은 필수 가동합니다.",
    imageName: "OpeningManual_3.jpg",
    estimatedMinutes: 5,
  },
  {
    id: 4,
    title: "3D 프린터 구역 예열 및 베드 상태 점검",
    category: "장비 점검",
    description:
      "3D 프린팅 팜의 개별 프린터 전원을 켜고, 전날 야간에 예약된 장기 출력이 정상 종료되었는지 확인합니다. 완료된 출력물은 지정된 수령 보관함으로 이동시키고, 빌드 플레이트(베드) 잔여물을 스크래퍼로 깨끗이 청소한 후 레벨링 및 노즐 막힘 여부를 점검합니다.",
    checkPoints: [
      "야간 출력 완료물 확인 및 수령 대기 트레이로 이동",
      "빌드 플레이트 이물질 제거 및 이소프로필 알코올(IPA) 탈지 클리닝",
      "필라멘트 잔량(스풀 무게 20% 이상) 확인 및 튜브 꼬임 검사",
      "출력 대기 프린터 예열(Preheat PLA/PETG) 세팅",
    ],
    warning: "노즐 및 히팅 베드는 고온이므로 반드시 내열 장갑을 착용하고 잔여물을 제거하세요.",
    imageName: "OpeningManual_4.jpg",
    estimatedMinutes: 10,
  },
  {
    id: 5,
    title: "레이저 가공기 냉각 칠러(Chiller) 수온 및 렌즈 확인",
    category: "장비 점검",
    description:
      "레이저 커터 본체 전원을 켜기 전, 수냉식 칠러의 전원을 먼저 켜서 냉각수 수위와 현재 수온(권장: 18℃~22℃)을 확인합니다. 레이저 포커스 렌즈와 반사 미러에 분진이나 그을음이 묻어있지 않은지 렌즈 페이퍼로 가볍게 점검합니다.",
    checkPoints: [
      "칠러 냉각수 탱크 수위 게이지 Normal(초록선) 확인",
      "칠러 냉각수 순환 알람(삐- 소리) 없는지 확인",
      "컴프레서 에어 어시스트(Air Assist) 압력 0.2~0.4MPa 유지 확인",
      "허니컴 베드 아래 아크릴/MDF 파편 트레이 비우기",
    ],
    warning: "칠러가 켜지지 않은 상태에서 레이저를 조사하면 레이저 발진관이 영구 파손됩니다. 칠러 선 가동 필수!",
    imageName: "OpeningManual_5.jpg",
    estimatedMinutes: 7,
  },
  {
    id: 6,
    title: "안내 데스크 PC 부팅 및 예약 관리 시스템 로그인",
    category: "전산 & 운영",
    description:
      "안내 카운터의 메인 관리용 PC를 부팅하고, 메이커스페이스 포털 및 예약 관리 시스템에 접속합니다. 금일 장비 예약자 명단(타임테이블)을 출력하거나 태블릿에 띄우고, 특별 요청 사항이나 정기 안전 점검 일정을 확인합니다.",
    checkPoints: [
      "안내 데스크 PC 부팅 및 관리자 계정 로그인",
      "금일 3D 프린터 및 레이저 가공기 타임별 예약 리스트 확인",
      "현장 출입 QR 태블릿 또는 수기 방문자 명부 세팅",
    ],
    imageName: "OpeningManual_6.jpg",
    estimatedMinutes: 5,
  },
  {
    id: 7,
    title: "공용 수공구함 & 소모품 선반 정돈",
    category: "공간 정리",
    description:
      "학생들이 공용으로 사용하는 니퍼, 라디오 펜치, 버니어 캘리퍼스, 보안경, 납땜 인두기 스탠드가 지정된 홀더에 올바르게 정렬되어 있는지 점검합니다. 부족한 테이프, 샌드페이퍼, 알코올 솜 등 소모품을 보충합니다.",
    checkPoints: [
      "공구 벽면 섀도우 보드(공구 그림 위치)에 전 도구 제자리 반납 확인",
      "학생용 보안경 비치함 세척 및 소독 티슈 비치",
      "인두기 전원 스위치 OFF 및 팁 클리너 수분 보충",
    ],
    tip: "도구 분실 방지를 위해 오픈 시 번호표가 부착된 키박스를 함께 확인하세요.",
    imageName: "OpeningManual_7.jpg",
    estimatedMinutes: 5,
  },
  {
    id: 8,
    title: "오픈 체크리스트 최종 완료 서명 및 개방 선언",
    category: "업무 시작",
    description:
      "1번부터 7번까지의 모든 점검 항목이 완료되었음을 재확인하고, 일일 운영 점검 일지에 당일 출근 근무자(이름, 학번, 출근 시각) 서명을 기재합니다. 이후 센터 메인 안내 방송 또는 안내 전광판을 활성화하여 이용자 입실을 시작합니다.",
    checkPoints: [
      "본 웹사이트 출근 체크리스트 전 항목 체크 완료",
      "일일 점검 일지 출근 서명 작성",
      "입구 대기 이용자에게 친절한 인사와 함께 개방 안내",
    ],
    imageName: "OpeningManual_8.jpg",
    estimatedMinutes: 2,
  },
];
