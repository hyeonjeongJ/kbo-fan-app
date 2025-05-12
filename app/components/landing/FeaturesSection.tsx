export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">주요 기능</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Team Chat Feature */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">팀별 채팅</h3>
            <p className="text-gray-600 mb-4">
              실시간 팀별 채팅방에 참여하고 팬들과 소통하세요!
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              채팅방 참여하기
            </button>
          </div>

          {/* Game Information Feature */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">경기 정보</h3>
            <p className="text-gray-600 mb-4">
              경기 일정, 결과, 선수 기록을 한눈에 확인하세요!
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              경기 정보 확인하기
            </button>
          </div>

          {/* Fan Activities Feature */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">직관 메이트 모집</h3>
            <p className="text-gray-600 mb-4">
              같은 경기를 보러갈 팬을 찾으세요!
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              직관 메이트 모집하기
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 