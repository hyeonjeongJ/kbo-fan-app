'use client';

import { useState, useEffect } from 'react';
import { stadiums } from '@/types/weather';
import { getWeatherData, getWeatherIconUrl } from '@/utils/weather';
import { WeatherData } from '@/types/weather';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

function Arrow(props: any) {
  const { className, style, onClick, direction } = props;
  return (
    <button
      className={
        `slick-arrow z-10 flex items-center justify-center transition-colors duration-200 absolute` +
        (direction === 'left' ? ' left-0' : ' right-0')
      }
      style={{
        ...style,
        background: 'rgba(255,255,255,0.7)',
        borderRadius: '50%',
        border: 'none',
        width: 48,
        height: 48,
        boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
        color: '#2563eb',
        fontSize: 32,
        top: '50%',
        left: direction === 'left' ? 0 : undefined,
        right: direction === 'right' ? 0 : undefined,
        transform: 'translateY(-50%)',
        outline: 'none',
        transition: 'background 0.2s',
      }}
      onClick={onClick}
      aria-label={direction === 'left' ? '이전' : '다음'}
      tabIndex={0}
      onMouseOver={e => (e.currentTarget.style.background = '#2563eb')}
      onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.7)')}
    >
      {direction === 'left' ? (
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ) : (
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      )}
    </button>
  );
}

function getTodayString() {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const day = days[now.getDay()];
  return `${yyyy}.${mm}.${dd}(${day})`;
}

export default function WeatherPage() {
  const [weatherList, setWeatherList] = useState<(WeatherData | null)[]>(Array(stadiums.length).fill(null));
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchAllWeather = async () => {
      setLoading(true);
      const results: (WeatherData | null)[] = await Promise.all(
        stadiums.map(async (stadium) => {
          try {
            return await getWeatherData(stadium.city);
          } catch {
            return null;
          }
        })
      );
      setWeatherList(results);
      setLoading(false);
    };
    fetchAllWeather();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    centerMode: true,
    centerPadding: '48px',
    focusOnSelect: true,
    arrows: true,
    beforeChange: (_: number, next: number) => setCurrent(next),
    nextArrow: <Arrow direction="right" />, 
    prevArrow: <Arrow direction="left" />, 
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3, centerMode: true, centerPadding: '32px' }
      },
      {
        breakpoint: 800,
        settings: { slidesToShow: 1, centerMode: true, centerPadding: '0px' }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 pt-24">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-md border border-gray-200 p-12 flex flex-col gap-6 overflow-hidden" style={{ minHeight: 600 }}>
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">구장별 날씨 정보</h2>
          <p className="text-gray-500 text-base mb-4">구장의 실시간 날씨와 예보를 한눈에 확인하세요.</p>
          <div className="flex justify-center items-center gap-2 font-semibold text-lg">
            <CalendarDaysIcon className="w-6 h-6 text-blue-400" />
            <span className="text-black">{getTodayString()}</span>
          </div>
        </div>
        <div className="w-full py-6 relative">
          <Slider {...settings}>
            {stadiums.map((stadium, idx) => (
              <div key={stadium.name} className="px-1">
                <Link
                  href={`/weather/${encodeURIComponent(stadium.city)}`}
                  className={`bg-white rounded-2xl shadow flex flex-col items-center justify-between transition-all duration-300 mx-auto cursor-pointer ${current === idx ? 'scale-105 border-2 border-blue-400 shadow-lg z-10' : 'opacity-80'} hover:shadow-2xl hover:-translate-y-1`}
                  style={{ width: 180, height: 360, minWidth: 180, minHeight: 360, maxWidth: 180, maxHeight: 360 }}
                >
                  <div className="flex flex-col items-center w-full px-2 pt-6 pb-4">
                    <div className="text-base font-bold text-blue-800 mb-1 text-center break-keep leading-tight truncate w-full" title={stadium.name}>{stadium.name}</div>
                    <div className="text-sm font-medium text-blue-500 mb-1 text-center break-keep truncate w-full" title={stadium.team}>{stadium.team}</div>
                    <div className="text-xs text-gray-400 mb-3 text-center break-keep truncate w-full" title={stadium.address}>{stadium.address}</div>
                  </div>
                  {loading || !weatherList[idx] ? (
                    <div className="h-24 flex items-center justify-center text-gray-400">날씨 정보를 불러오는 중...</div>
                  ) : (
                    <>
                      <div className="flex flex-col items-center mb-2">
                        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                          <img
                            src={getWeatherIconUrl(weatherList[idx]!.weather[0].icon)}
                            alt={weatherList[idx]!.weather[0].description}
                            className="w-12 h-12"
                          />
                        </div>
                        <div className="text-3xl font-extrabold text-blue-900 mb-1">
                          {Math.round(weatherList[idx]!.main.temp)}°C
                        </div>
                        <div className="text-sm font-semibold text-blue-600 mb-1">
                          {weatherList[idx]!.weather[0].description}
                        </div>
                      </div>
                      <div className="w-full border-t border-gray-100 my-2" />
                      <div className="flex gap-4 justify-center w-full pb-2">
                        <div className="text-center">
                          <div className="text-xs text-gray-500">체감</div>
                          <div className="text-base font-bold">{Math.round(weatherList[idx]!.main.feels_like)}°C</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">습도</div>
                          <div className="text-base font-bold">{weatherList[idx]!.main.humidity}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">풍속</div>
                          <div className="text-base font-bold">{weatherList[idx]!.wind.speed} m/s</div>
                        </div>
                      </div>
                    </>
                  )}
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <style jsx global>{`
        .slick-list {
          overflow: visible !important;
          padding-left: 32px !important;
          padding-right: 32px !important;
        }
        html, body, #__next {
          overflow-y: auto !important;
        }
      `}</style>
    </div>
  );
} 