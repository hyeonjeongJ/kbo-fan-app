'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "../auth/AuthModal";
import { supabase } from "lib/supabase-client";
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { user, signOut } = useAuth();
  const [nickname, setNickname] = useState<string | null>(null);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchNickname = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from('user')
          .select('nickname')
          .eq('id', user.id)
          .single();
        if (data?.nickname) setNickname(data.nickname);
      }
    };
    fetchNickname();
  }, [user]);

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  // 어드민 네비게이션 바
  if (pathname.startsWith('/admin')) {
    if (!mounted) return null;
    return (
      <nav className="fixed top-0 w-full bg-black bg-opacity-40 backdrop-blur-sm shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/logo.png"
                  alt="KBO Fan Logo"
                  width={48}
                  height={48}
                  className="mr-6"
                />
              </Link>
              <span className="text-white text-xl font-bold ml-2">관리자 대시보드</span>
            </div>
            <div className="flex-1 flex justify-center">
              <Link href="/admin/reports" className="text-white hover:text-blue-400 transition-colors mx-2">신고 관리</Link>
              <Link href="/admin/users" className="text-white hover:text-blue-400 transition-colors mx-2">사용자 관리</Link>
              <Link href="/admin/dashboard" className="text-white hover:text-blue-400 transition-colors mx-2">통계</Link>
              <Link href="/admin/roles" className="text-white hover:text-blue-400 transition-colors mx-2">권한 관리</Link>
              <Link href="/admin/announcements" className="text-white hover:text-blue-400 transition-colors mx-2">공지사항 관리</Link>
            </div>
            <div className="flex items-center space-x-4 flex-shrink-0">
              {user ? (
                <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <span className="text-white text-sm sm:text-base truncate max-w-[150px]">
                    {nickname ? (<><b>{nickname}</b>님 안녕하세요!</>) : `${user.email}`}
                  </span>
                  <button
                    onClick={signOut}
                    className="bg-red-500 bg-opacity-70 text-white px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md hover:bg-red-600 hover:bg-opacity-90 transition-colors whitespace-nowrap"
                  >
                    로그아웃
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  if (!mounted) return null;

  return (
    <>
      <nav className="fixed top-0 w-full bg-black bg-opacity-40 backdrop-blur-sm shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/logo.png"
                  alt="KBO Fan Logo"
                  width={48}
                  height={48}
                  className="mr-6"
                />
              </Link>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-white hover:text-blue-400 transition-colors">홈</Link>
              <a
                href="https://sports.news.naver.com/kbaseball/index"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-400 transition-colors"
              >
                뉴스
              </a>
              <Link href="/youtube" className="text-white hover:text-blue-400 transition-colors">영상 요약하기</Link>
              <Link href="/weather" className="text-white hover:text-blue-400 transition-colors">구장별 날씨 정보</Link>
              <Link href="/mate" className="text-white hover:text-blue-400 transition-colors">직관 메이트 찾기</Link>
            </div>
            <div className="flex items-center space-x-4">
              {process.env.NEXT_PUBLIC_ENV === "development" && (
                <Link href="/admin">
                  <button
                    className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    style={{ fontWeight: 'bold' }}
                  >
                    관리자 페이지 접속
                  </button>
                </Link>
              )}
              {user ? (
                <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <span className="text-white text-sm sm:text-base truncate max-w-[150px]">
                    {nickname ? (<><b>{nickname}</b>님 안녕하세요!</>) : `${user.email}`}
                  </span>
                  <button
                    onClick={signOut}
                    className="bg-red-500 bg-opacity-70 text-white px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md hover:bg-red-600 hover:bg-opacity-90 transition-colors whitespace-nowrap"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleAuthClick('signin')}
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    로그인
                  </button>
                  <button
                    onClick={() => handleAuthClick('signup')}
                    className="bg-blue-500 bg-opacity-70 text-white px-4 py-2 rounded-md hover:bg-blue-600 hover:bg-opacity-90 transition-colors"
                  >
                    회원가입
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  );
} 