import axios from 'axios';
import { WeatherData } from '@/types/weather';

export async function getWeatherData(city: string): Promise<WeatherData> {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching weather data for ${city}:`, error);
    throw error;
  }
}

export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// 시간별 예보 (5일치, 3시간 단위)
export async function getHourlyWeatherData(city: string): Promise<any[]> {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
    );
    return response.data.list.map((item: any) => ({
      dt_txt: item.dt_txt,
      temp: Math.round(item.main.temp),
      icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
      desc: item.weather[0].description,
    }));
  } catch (error) {
    console.error(`Error fetching hourly weather for ${city}:`, error);
    return [];
  }
}

// 주간 예보 (7일치, 일별)
export async function getWeeklyWeatherData(city: string): Promise<any[]> {
  try {
    // 위도/경도 필요: 먼저 현재 날씨로부터 위경도 추출
    const current = await getWeatherData(city);
    const { lat, lon } = current.coord;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts,current&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
    );
    // response.data.daily: [{dt, temp, weather, ...}, ...]
    return response.data.daily.slice(0, 7).map((item: any) => {
      const date = new Date(item.dt * 1000);
      const day = `${date.getMonth() + 1}/${date.getDate()}`;
      return {
        day,
        tempMin: Math.round(item.temp.min),
        tempMax: Math.round(item.temp.max),
        icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
        desc: item.weather[0].description,
      };
    });
  } catch (error) {
    console.error(`Error fetching weekly weather for ${city}:`, error);
    return [];
  }
} 