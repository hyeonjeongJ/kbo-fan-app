'use client';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import TeamSelectionSection from "./components/landing/TeamSelectionSection";

export default function Home() {
  const features = [
    {
      title: '뉴스',
      description: 'KBO 리그 관련 뉴스를 확인해보세요. (네이버 스포츠)',
      emoji: '⚾',
      href: 'https://sports.news.naver.com/kbaseball/index',
      external: true
    },
    {
      title: '영상 요약',
      description: 'AI로 하이라이트 영상을 요약해 줍니다.',
      emoji: '🎥',
      href: '/youtube'
    },
    {
      title: '구장별 날씨 정보',
      description: '각 경기장의 실시간 날씨와 예보를 확인하세요.',
      emoji: '🌦️',
      href: '/weather'
    },
    {
      title: '직관 메이트 찾기',
      description: '경기를 함께 관람할 직관 메이트를 찾아보세요.',
      emoji: '👥',
      href: '/mate'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="relative">
        <div className="absolute inset-0">
          <Image
            src="/images/background.jpg"
            alt="KBO 배경"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 md:py-40 lg:py-48">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              KBO 팬들을 위한 최고의 커뮤니티!
            </h1>
            <p className="mt-2 sm:mt-3 max-w-md mx-auto text-sm sm:text-base md:text-lg text-white md:mt-5 md:max-w-3xl">
              팀별 채팅, 직관 메이트 찾기 등 다양한 기능을 즐겨보세요!
            </p>
            <div className="mt-6 sm:mt-8 md:mt-10 px-4 sm:px-0">
              {/* 회원가입 버튼 삭제됨 */}
            </div>
          </div>
        </div>
      </div>

      <div className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">주요 기능</h2>
          </div>

          <div className="mt-6 sm:mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {features.map((feature) => (
                feature.external ? (
                  <a
                    key={feature.title}
                    href={feature.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative bg-white p-4 sm:p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg hover:shadow-lg transition-shadow duration-200"
                  >
                    <div>
                      <span className="rounded-lg inline-flex p-2 sm:p-3 bg-indigo-50 text-2xl sm:text-4xl">
                        {feature.emoji}
                      </span>
                    </div>
                    <div className="mt-4 sm:mt-8">
                      <h3 className="text-base sm:text-lg font-medium text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                    <span
                      className="absolute top-4 sm:top-6 right-4 sm:right-6 text-gray-300 group-hover:text-gray-400"
                      aria-hidden="true"
                    >
                      <svg className="h-4 w-4 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                      </svg>
                    </span>
                  </a>
                ) : (
                  <Link
                    key={feature.title}
                    href={feature.href}
                    className="group relative bg-white p-4 sm:p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg hover:shadow-lg transition-shadow duration-200"
                  >
                    <div>
                      <span className="rounded-lg inline-flex p-2 sm:p-3 bg-indigo-50 text-2xl sm:text-4xl">
                        {feature.emoji}
                      </span>
                    </div>
                    <div className="mt-4 sm:mt-8">
                      <h3 className="text-base sm:text-lg font-medium text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                    <span
                      className="absolute top-4 sm:top-6 right-4 sm:right-6 text-gray-300 group-hover:text-gray-400"
                      aria-hidden="true"
                    >
                      <svg className="h-4 w-4 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                      </svg>
                    </span>
                  </Link>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
      <TeamSelectionSection />
      <Footer />
    </div>
  );
}
