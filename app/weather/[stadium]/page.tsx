"use client";
import { use, useEffect, useState } from 'react';
import { getHourlyWeatherData } from '@/utils/weather';
import { stadiums } from '@/types/weather';

function groupByDate(list: any[]) {
  return list.reduce((acc: any, item: any) => {
    const date = item.dt_txt.slice(0, 10);
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});
}

function getDayOfWeek(dateStr: string) {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const d = new Date(dateStr);
  return days[d.getDay()];
}

export default function StadiumWeatherPage({ params }: { params: Promise<{ stadium: string }> }) {
  const { stadium } = use(params);
  const [hourly, setHourly] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 구장 정보 찾기
  const stadiumInfo = stadiums.find(s => s.city.toLowerCase() === stadium.toLowerCase());

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const h = await getHourlyWeatherData(stadium);
      setHourly(h);
      setLoading(false);
    }
    fetchData();
  }, [stadium]);

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  const byDate = groupByDate(hourly);
  const todayHourly = byDate[todayStr] || [];
  const tomorrowHourly = byDate[tomorrowStr] || [];

  const dailySummary = Object.entries(byDate).slice(0, 5).map(([date, arr]: [string, any[]]) => {
    const noon = arr.find(item => {
      const hour = Number(item.dt_txt.slice(11, 13));
      return hour >= 12 && hour <= 15;
    }) || arr[0];
    return { date, ...noon };
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 pt-24">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md border border-gray-200 p-8 flex flex-col gap-6 overflow-hidden">
        {/* 구장 이름/주소 표시 */}
        <div className="mb-2">
          <h2 className="text-2xl font-bold text-blue-900">
            {stadiumInfo ? stadiumInfo.name : stadium} {stadiumInfo ? `(${stadiumInfo.team})` : ''}
          </h2>
          <div className="text-gray-500 text-sm">{stadiumInfo?.address}</div>
        </div>
        {/* 이하 기존 날씨 UI */}
        {loading ? (
          <div className="text-center text-gray-400">날씨 정보를 불러오는 중...</div>
        ) : (
          <>
            <section>
              <h3 className="text-lg font-semibold mb-2">오늘 시간별</h3>
              <div className="mb-3 text-lg font-bold text-center text-gray-800">
                {todayStr} ({getDayOfWeek(todayStr)})
              </div>
              <div className="flex justify-center flex-wrap gap-4 pb-2">
                {todayHourly.map((h: any, i: number) => (
                  <div key={i} className="flex flex-col items-center min-w-[60px]">
                    <div className="text-xs text-gray-500">{h.dt_txt.slice(11, 16)}</div>
                    <img src={h.icon} alt={h.desc} className="w-8 h-8" />
                    <div className="font-bold text-blue-700">{h.temp}°</div>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h3 className="text-lg font-semibold mb-2">내일 시간별</h3>
              <div className="mb-3 text-lg font-bold text-center text-gray-800">
                {tomorrowStr} ({getDayOfWeek(tomorrowStr)})
              </div>
              <div className="flex justify-center flex-wrap gap-4 pb-2">
                {tomorrowHourly.map((h: any, i: number) => (
                  <div key={i} className="flex flex-col items-center min-w-[60px]">
                    <div className="text-xs text-gray-500">{h.dt_txt.slice(11, 16)}</div>
                    <img src={h.icon} alt={h.desc} className="w-8 h-8" />
                    <div className="font-bold text-blue-700">{h.temp}°</div>
                  </div>
                ))}
              </div>
            </section>
            <section className="mt-6">
              <h3 className="text-lg font-semibold mb-2">5일치 요약</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {dailySummary.map((d, i) => (
                  <div key={i} className="flex flex-col items-center bg-blue-50 rounded-lg p-2">
                    <div className="text-xs text-gray-500">{d.date} ({getDayOfWeek(d.date)})</div>
                    <img src={d.icon} alt={d.desc} className="w-8 h-8" />
                    <div className="font-bold text-blue-700">{d.temp}°</div>
                    <div className="text-xs text-gray-500">{d.desc}</div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
} 