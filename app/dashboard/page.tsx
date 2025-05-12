'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">환영합니다!</h1>
          
          {!user.email_confirmed_at ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <p className="text-yellow-700">
                이메일 인증이 필요합니다. 받으신 이메일을 확인해주세요.
                메일함에서 인증 메일을 찾을 수 없다면 스팸함을 확인해주세요.
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <p className="text-green-700">
                이메일 인증이 완료되었습니다.
              </p>
            </div>
          )}

          <div className="bg-gray-50 rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">계정 정보</h2>
            <p className="text-gray-600">이메일: {user.email}</p>
            <p className="text-gray-600">
              계정 상태: {user.email_confirmed_at ? '인증됨' : '인증 대기중'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 