import Image from 'next/image';
import Link from 'next/link';

export default function SignupComplete() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
            <Image
              src="/check-circle.svg"
              alt="회원가입 완료"
              width={32}
              height={32}
              className="text-indigo-600"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            회원가입 완료
          </h2>
          <p className="mt-2 text-center text-gray-600">
            KBO 팬 커뮤니티의 새로운 회원이 되신 것을 환영합니다!
          </p>
          <div className="mt-4 text-center text-sm text-gray-500 space-y-1">
            <p>이메일 인증을 완료하시면 모든 서비스를 이용하실 수 있습니다.</p>
            <p>함께 KBO 리그의 열정을 나누어보세요!</p>
          </div>
        </div>
        <div className="mt-6">
          <Link 
            href="/"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            홈으로 이동
          </Link>
        </div>
      </div>
    </div>
  );
} 