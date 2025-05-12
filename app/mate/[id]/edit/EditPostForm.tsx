'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { Post } from '@/types/post';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";
import "@/app/styles/datepicker.css";

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

interface EditPostFormProps {
  id: string;
}

export default function EditPostForm({ id }: EditPostFormProps) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    team_id: '',
    game_date: '',
    title: '',
    content: '',
    max_participants: '2',
    location: '',
    image_url: '',
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log('Fetching post with ID:', id);
        const { data: postData, error: postError } = await supabase
          .from('mate_post')
          .select('*')
          .eq('id', id)
          .single();

        if (postError) {
          console.error('Supabase error:', postError);
          throw new Error(`데이터베이스 오류: ${postError.message}`);
        }

        if (!postData) {
          throw new Error('게시물을 찾을 수 없습니다.');
        }

        console.log('Fetched post data:', postData);
        setPost(postData);
        setSelectedDate(new Date(postData.game_date));
        setFormData({
          team_id: String(postData.team_id),
          game_date: postData.game_date,
          title: postData.title,
          content: postData.content,
          max_participants: String(postData.max_participants),
          location: postData.location || '',
          image_url: postData.image_url || '',
        });
      } catch (err) {
        console.error('Error details:', err);
        setError(err instanceof Error ? err.message : '게시물을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      setFormData(prev => ({
        ...prev,
        game_date: date.toISOString()
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updateData = {
        team_id: parseInt(formData.team_id),
        game_date: new Date(formData.game_date).toISOString(),
        title: formData.title,
        content: formData.content,
        max_participants: parseInt(formData.max_participants),
        location: formData.location,
        image_url: formData.image_url,
        updated_at: new Date().toISOString(),
      };

      console.log('Updating post with data:', updateData);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('로그인이 필요합니다.');
      }

      const { data, error } = await supabase
        .from('mate_post')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      console.log('Update successful:', data);

      // 캐시 무효화
      await fetch('/api/revalidate?path=/mate/' + id);
      
      // 상세 페이지로 이동
      router.push(`/mate/${id}`);
      router.refresh();
    } catch (err) {
      console.error('Error updating post:', err);
      setError(err instanceof Error ? err.message : '게시물 수정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <p className="text-center text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <p className="text-center text-gray-500">게시물을 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">게시물 수정</h1>
            <p className="text-gray-600 mt-2">게시물 내용을 수정해주세요</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                응원할 팀
              </label>
              <div className="relative">
                <select
                  value={formData.team_id}
                  onChange={(e) => {
                    console.log('Selected team_id:', e.target.value);
                    setFormData({ ...formData, team_id: e.target.value });
                  }}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white hover:border-gray-400 transition-colors cursor-pointer"
                >
                  <option value="">팀을 선택하세요</option>
                  {TEAMS.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                경기 일시
              </label>
              <div className="relative">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  dateFormat="yyyy년 MM월 dd일 HH:mm"
                  placeholderText="날짜와 시간을 선택하세요"
                  locale={ko}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  calendarClassName="!border-gray-200 !rounded-xl !font-sans !shadow-lg"
                  popperClassName="react-datepicker-popper"
                  minDate={new Date()}
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                제목
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                maxLength={100}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="제목을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                장소
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="예: 잠실야구장 1루 매표소 앞"
                maxLength={100}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                내용
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={8}
                placeholder="메이트에게 전하고 싶은 내용을 자유롭게 작성해주세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이미지 URL
              </label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="이미지 URL을 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formData.image_url && (
                <div className="mt-4 relative w-full h-40 rounded-xl overflow-hidden border border-gray-200">
                  <Image
                    src={formData.image_url}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image_url: '' })}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                최대 참가 인원
              </label>
              <input
                type="number"
                value={formData.max_participants}
                onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                required
                min="2"
                max="10"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-700 font-medium"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 font-medium flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    수정 중...
                  </>
                ) : (
                  '수정하기'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 