'use client';

import { useState } from 'react';
import { getYoutubeTranscript } from '@/utils/youtubeTranscript';
import { summarizeTranscript } from '@/utils/gemini';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

export default function YouTubeSummary() {
  const [videoUrl, setVideoUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSummary('');

    try {
      const transcript = await getYoutubeTranscript(videoUrl);
      const result = await summarizeTranscript(transcript);
      setSummary(result);
    } catch (err) {
      setError('자막 추출 또는 요약 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 relative">
          {/* YouTube 로고 */}
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-8 right-8 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/youtube-logo.png"
              alt="YouTube"
              width={100}
              height={24}
              className="object-contain"
            />
          </a>

          {/* 제목/설명 */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">하이라이트 영상 요약</h1>
          <p className="text-gray-600 mb-8">유튜브 하이라이트 영상 링크를 입력하면 Gemini가 내용을 요약해줍니다.</p>

          {/* 입력 폼 */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-2 flex-col sm:flex-row">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="YouTube 영상 URL을 입력하세요"
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-blue-300 font-medium transition-colors"
              >
                {loading ? '요약 중...' : '영상 요약하기'}
              </button>
            </div>
          </form>

          {/* 에러 메시지 */}
          {error && (
            <div className="text-red-500 mb-4 text-center">
              {error}
            </div>
          )}

          {/* 요약 결과 카드 */}
          {summary && (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-4">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">영상 요약</h2>
              <div className="prose max-w-none prose-h2:text-xl prose-h2:font-bold prose-ul:list-disc prose-strong:text-blue-700">
                <ReactMarkdown
                  components={{
                    h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-6 mb-2 text-blue-700" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-4" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1" {...props} />,
                    strong: ({node, ...props}) => <strong className="text-blue-700" {...props} />,
                    p: ({node, ...props}) => <p className="mb-2" {...props} />,
                  }}
                >
                  {summary}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* 로딩 스피너 */}
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 