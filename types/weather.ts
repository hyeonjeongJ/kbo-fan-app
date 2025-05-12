export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
}

export interface Stadium {
  team: string;
  name: string;
  address: string;
  city: string;
}

export const stadiums: Stadium[] = [
  {
    team: "LG 트윈스 / 두산 베어스",
    name: "잠실 야구장",
    address: "서울특별시 송파구 올림픽로 25",
    city: "Seoul"
  },
  {
    team: "키움 히어로즈",
    name: "고척 스카이돔",
    address: "서울특별시 구로구 경인로 430",
    city: "Seoul"
  },
  {
    team: "SSG 랜더스",
    name: "인천 SSG 랜더스필드",
    address: "인천광역시 미추홀구 매소홀로 618",
    city: "Incheon"
  },
  {
    team: "KT 위즈",
    name: "수원 KT 위즈파크",
    address: "경기도 수원시 장안구 경수대로 893",
    city: "Suwon"
  },
  {
    team: "한화 이글스",
    name: "한화생명 이글스파크",
    address: "대전광역시 중구 대종로 373",
    city: "Daejeon"
  },
  {
    team: "삼성 라이온즈",
    name: "대구 삼성 라이온즈파크",
    address: "대구광역시 수성구 야구전설로 1",
    city: "Daegu"
  },
  {
    team: "NC 다이노스",
    name: "창원NC파크",
    address: "경상남도 창원시 마산회원구 삼호로 63",
    city: "Changwon"
  },
  {
    team: "롯데 자이언츠",
    name: "사직야구장",
    address: "부산광역시 동래구 사직로 45",
    city: "Busan"
  },
  {
    team: "KIA 타이거즈",
    name: "광주-기아 챔피언스 필드",
    address: "광주광역시 북구 서림로 10",
    city: "Gwangju"
  }
]; 