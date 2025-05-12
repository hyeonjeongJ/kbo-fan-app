'use client';

import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/background.jpg"
          alt="Baseball Stadium Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="relative z-10 text-center text-white max-w-4xl px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          KBO 팬들을 위한 최고의 커뮤니티!
        </h1>
        <p className="text-lg md:text-xl mb-8">
          팀별 채팅, 실시간 응원, 팬펀딩 광고 등 다양한 기능을 즐겨보세요!
        </p>
        <button className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors">
          지금 가입하고 나만의 팬 활동 시작하기
        </button>
      </div>
    </section>
  );
} 