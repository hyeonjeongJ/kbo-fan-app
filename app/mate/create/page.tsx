'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";
import "@/app/styles/datepicker.css";
import { supabase } from '@/lib/supabase-client';

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

export default function CreatePostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    team_id: '',
    game_date: '',
    title: '',
    content: '',
    max_participants: '2',
    location: '',
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        alert('로그인이 필요합니다.');
        router.replace('/login');
      }
    });
  }, [router]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      setFormData(prev => ({
        ...prev,
        game_date: date.toISOString()
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const uploadImageToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('이미지 업로드에 실패했습니다.');
    }

    const data = await response.json();
    return data.data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('로그인이 필요합니다.');
      }

      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImageToImgBB(imageFile);
      }

      // Store the date directly without timezone adjustment
      const gameDate = new Date(formData.game_date);

      const { error } = await supabase
        .from('mate_post')
        .insert({
          user_id: user.id,
          team_id: parseInt(formData.team_id),
          game_date: gameDate.toISOString(),  // Store directly in ISO format
          title: formData.title,
          content: formData.content,
          max_participants: parseInt(formData.max_participants),
          current_participants: 1,
          image_url: imageUrl,
          location: formData.location,
        });

      if (error) throw error;

      router.push('/mate');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('게시글 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">직관 메이트 모집하기</h1>
            <p className="text-gray-600 mt-2">함께 직관할 메이트를 모집해보세요</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                응원할 팀
              </label>
              <div className="relative">
                <select
                  name="team_id"
                  value={formData.team_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white hover:border-gray-400 transition-colors cursor-pointer"
                >
                  <option value="" disabled className="text-gray-500">팀을 선택하세요</option>
                  {TEAMS.map(team => (
                    <option 
                      key={team.id} 
                      value={team.id}
                      className="py-2 hover:bg-blue-50"
                    >
                      {team.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                  <svg className="w-5 h-5 transition-transform duration-200 ease-in-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <style jsx>{`
                select {
                  background-image: none !important;
                }
                select option {
                  padding: 8px;
                  margin: 4px;
                  border-radius: 8px;
                  cursor: pointer;
                }
                select option:checked {
                  background: linear-gradient(0deg, #EBF5FF 0%, #EBF5FF 100%);
                  color: #2563EB;
                }
                select option:hover {
                  background: linear-gradient(0deg, #F3F4F6 0%, #F3F4F6 100%);
                }
                @media (prefers-color-scheme: dark) {
                  select option:checked {
                    background: linear-gradient(0deg, #1E40AF 0%, #1E40AF 100%);
                    color: white;
                  }
                }
              `}</style>
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
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                name="title"
                value={formData.title}
                onChange={handleChange}
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
                name="location"
                value={formData.location}
                onChange={handleChange}
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
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={8}
                placeholder="메이트에게 전하고 싶은 내용을 자유롭게 작성해주세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이미지 첨부
              </label>
              <label
                htmlFor="file-upload"
                className="mt-1 flex justify-center px-4 py-4 border border-gray-300 border-dashed rounded-xl hover:border-blue-500 transition-colors duration-200 cursor-pointer"
              >
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-8 w-8 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex flex-col items-center text-sm text-gray-600">
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                    <span className="font-medium text-blue-500 hover:text-blue-600">이미지 업로드</span>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </label>
              {previewUrl && (
                <div className="mt-4 relative w-full h-40 rounded-xl overflow-hidden border border-gray-200">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null);
                      setImageFile(null);
                    }}
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
                name="max_participants"
                value={formData.max_participants}
                onChange={handleChange}
                required
                min="2"
                max="10"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6">
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
                    작성 중...
                  </>
                ) : (
                  '작성하기'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 