'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function SignupComplete() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-3xl font-bold">회원가입 완료!</h1>
        <p className="text-gray-600">
          KBO 팬 앱의 회원이 되신 것을 환영합니다.
          이제 모든 서비스를 이용하실 수 있습니다.
        </p>
        <div className="space-y-4">
          <Button
            onClick={() => router.push('/')}
            className="w-full"
          >
            홈으로 이동
          </Button>
          <Button
            onClick={() => router.push('/profile')}
            variant="outline"
            className="w-full"
          >
            프로필 설정하기
          </Button>
        </div>
      </div>
    </div>
  );
} 