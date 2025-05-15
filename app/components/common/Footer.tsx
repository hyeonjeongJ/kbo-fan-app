import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">회사 정보</h3>
            <p className="text-gray-400">KBO 팬 커뮤니티</p>
            <p className="text-gray-400">lucy2166@naver.com</p>
          </div>
          <div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">사이트 맵</h3>
            <div className="flex flex-col space-y-2">
              <Link href="/" className="text-gray-400 hover:text-white">홈</Link>
              <Link href="/youtube" className="text-gray-400 hover:text-white">영상 요약하기</Link>
              <Link href="/weather" className="text-gray-400 hover:text-white">구장별 날씨 정보</Link>
              <Link href="/fan-activities" className="text-gray-400 hover:text-white">팬 활동</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© 2025 KBO Fan Community. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 