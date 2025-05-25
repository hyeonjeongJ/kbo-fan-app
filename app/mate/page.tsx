'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from "@/contexts/AuthContext";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface MatePost {
  id: number;
  user_id: string;
  team_id: number;
  game_date: string;
  title: string;
  content: string;
  max_participants: number;
  current_participants: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

const TEAMS = [
  { id: 1, name: 'LG 트윈스' },
  { id: 2, name: 'KT 위즈' },
  { id: 3, name: 'SSG 랜더스' },
  { id: 4, name: 'NC 다이노스' },
  { id: 5, name: '두산 베어스' },
  { id: 6, name: 'KIA 타이거즈' },
  { id: 7, name: '롯데 자이언츠' },
  { id: 8, name: '삼성 라이온즈' },
  { id: 9, name: '한화 이글스' },
  { id: 10, name: '키움 히어로즈' },
];

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: "전체 공지 예시",
    content: "전체 사용자에게 노출되는 공지입니다.",
    type: "all",
    target: "",
    start_date: "2024-05-01",
    end_date: "2024-05-31",
    priority: 1,
  },
  {
    id: 2,
    title: "LG 트윈스 응원단 공지",
    content: "LG 트윈스 팀 페이지에만 노출됩니다.",
    type: "team",
    target: "LG 트윈스",
    start_date: "2024-05-01",
    end_date: "2024-05-31",
    priority: 2,
  },
];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Seoul'
  }).format(date);
}

export default function MatePage() {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<MatePost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
    fetchAnnouncements();
  }, [currentPage, selectedTeam]);

  const fetchPosts = async () => {
    try {
      setPostsLoading(true);
      
      let query = supabase
        .from('mate_post')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * 10, currentPage * 10 - 1);

      if (selectedTeam) {
        query = query.eq('team_id', selectedTeam);
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      if (currentPage === 1) {
        setPosts(data || []);
      } else {
        setPosts(prev => [...prev, ...(data || [])]);
      }
      setHasMore((count || 0) > currentPage * 10);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('priority', { ascending: true });
    if (!error && data) setAnnouncements(data);
  };

  const handleCreatePost = () => {
    router.push('/mate/create');
  };

  const handleTeamFilter = (teamId: number | null) => {
    setSelectedTeam(teamId);
    setCurrentPage(1);
  };

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const today = new Date().toISOString().slice(0, 10);
  const activeAnnouncements = announcements.filter(
    (a) => a.start_date <= today && a.end_date >= today
  ).sort((a, b) => a.priority - b.priority);
  const topAnnouncement = activeAnnouncements[0];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
          <p className="text-gray-600">직관 메이트 찾기 기능은 로그인 후 이용하실 수 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {showAnnouncement && topAnnouncement && (
          <div className="bg-yellow-100 border-b border-yellow-300 p-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-lg mb-1">{topAnnouncement.title}</div>
              <div className="text-sm">{topAnnouncement.content}</div>
            </div>
            <button
              className="ml-4 text-yellow-700 hover:text-yellow-900 text-xl"
              onClick={() => setShowAnnouncement(false)}
              aria-label="공지 닫기"
            >
              ×
            </button>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">직관 메이트 찾기</h1>
              <p className="text-gray-600 mt-2">함께 야구를 즐길 메이트를 찾아보세요</p>
            </div>
            <button
              onClick={handleCreatePost}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              새 글 작성
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => handleTeamFilter(null)}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedTeam === null
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            {TEAMS.map((team) => (
              <button
                key={team.id}
                onClick={() => handleTeamFilter(team.id)}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedTeam === team.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {team.name}
              </button>
            ))}
          </div>

          {postsLoading && currentPage === 1 ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="group border border-gray-200 hover:border-gray-300 rounded-xl p-6 cursor-pointer bg-white transition-all hover:shadow-lg"
                    onClick={() => router.push(`/mate/${post.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                            {TEAMS.find(team => team.id === post.team_id)?.name}
                          </span>
                          <span className="text-gray-400">·</span>
                          <span className="text-gray-600 text-sm">
                            {formatDate(post.game_date)}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-blue-500 transition-colors">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>{post.current_participants}/{post.max_participants}명</span>
                          </div>
                          <span className="text-gray-300">|</span>
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {posts.length === 0 && (
                  <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium">등록된 글이 없습니다.</p>
                    <p className="text-sm text-gray-400 mt-1">새로운 메이트 모집 글을 작성해보세요!</p>
                  </div>
                )}
              </div>
              
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={postsLoading}
                    className="px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors text-gray-700 font-medium flex items-center gap-2"
                  >
                    {postsLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                        로딩 중...
                      </>
                    ) : (
                      <>
                        더 보기
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 