'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import axios from 'axios';

interface Comment {
  id: string;
  content: string;
  created_at: string;
}

interface Summary {
  id: string;
  content: string;
  created_at: string;
}

export default function SummaryPage() {
  const params = useParams();
  const mateId = parseInt(params.id as string, 10);
  const supabase = createClientComponentClient();
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [mateId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('mate_comment')
        .select('*')
        .eq('post_id', mateId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      setError('댓글을 불러오는 중 오류가 발생했습니다.');
      console.error('Error fetching comments:', err);
    }
  };

  const generateSummary = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 댓글 내용을 하나의 텍스트로 합치기
      const commentsText = comments.map(comment => comment.content).join('\n');

      // OpenAI API 호출
      const response = await axios.post('/api/summarize', {
        text: commentsText,
        mateId: mateId
      });

      // 요약 결과를 Supabase에 저장
      const { data: summaryData, error: summaryError } = await supabase
        .from('summaries')
        .insert([
          {
            mate_id: mateId,
            content: response.data.summary
          }
        ])
        .select()
        .single();

      if (summaryError) throw summaryError;
      setSummary(summaryData);
    } catch (err) {
      setError('요약을 생성하는 중 오류가 발생했습니다.');
      console.error('Error generating summary:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">댓글 요약</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">댓글 목록</h2>
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-800">{comment.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(comment.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={generateSummary}
        disabled={isLoading || comments.length === 0}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? '요약 생성 중...' : '요약 생성하기'}
      </button>

      {summary && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">요약 결과</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-800 whitespace-pre-line">{summary.content}</p>
            <p className="text-sm text-gray-500 mt-4">
              생성일: {new Date(summary.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 