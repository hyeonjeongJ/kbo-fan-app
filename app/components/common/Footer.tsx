import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">회사 정보</h3>
            <p className="text-gray-400">KBO 팬 커뮤니티</p>
            <p className="text-gray-400">contact@kbofan.com</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">소셜 미디어</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-white">YouTube</a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">사이트 맵</h3>
            <div className="flex flex-col space-y-2">
              <Link href="/" className="text-gray-400 hover:text-white">홈</Link>
              <Link href="/chat" className="text-gray-400 hover:text-white">채팅방</Link>
              <Link href="/games" className="text-gray-400 hover:text-white">경기 정보</Link>
              <Link href="/fan-activities" className="text-gray-400 hover:text-white">팬 활동</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© 2024 KBO Fan Community. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 