'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import Image from 'next/image';

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
  image_url: string | null;
  location: string;
  nickname?: string;
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

export default function PostDetail({ id }: { id: string }) {
  const router = useRouter();
  const [post, setPost] = useState<MatePost | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const fetchPost = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      const { data: postData, error: postError } = await supabase
        .from('mate_post')
        .select('*, user(nickname)')
        .eq('id', id)
        .single();
      if (postError) {
        if (
          postError.code === 'PGRST116' ||
          postError.message?.includes('no rows returned') ||
          postError.message?.includes('JSON object requested')
        ) {
          setPost(null);
          return;
        }
        throw new Error(`게시물을 불러오는 중 오류가 발생했습니다: ${postError.message}`);
      }
      if (!postData) {
        setPost(null);
        return;
      }
      setPost({ ...postData, nickname: postData.user?.nickname });
      setIsOwner(user?.id === postData.user_id);
    } catch (error) {
      setPost(null);
      if (
        error instanceof Error &&
        (
          error.message.includes('no rows returned') ||
          error.message.includes('JSON object requested') ||
          error.message.includes('multiple (or no) rows returned')
        )
      ) {
        return;
      }
      if (error instanceof Error) alert(error.message);
      else alert('게시물을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트가 마운트되거나 id가 변경될 때마다 데이터를 새로 가져옴
  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  // 포커스가 페이지로 돌아올 때마다 데이터를 새로 가져옴
  useEffect(() => {
    const onFocus = () => {
      console.log('Window focused, refreshing data');
      fetchPost();
      fetchComments();
    };

    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);
    };
    fetchUser();
  }, []);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('mate_comment')
        .select('*, user(nickname)')
        .eq('post_id', id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setComments((data || []).map((c: any) => ({ ...c, nickname: c.user?.nickname })));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('로그인이 필요합니다.');
      }

      const { error } = await supabase
        .from('mate_comment')
        .insert({
          post_id: parseInt(id),
          user_id: user.id,
          content: newComment.trim(),
        });

      if (error) throw error;

      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('로그인이 필요합니다.');
      }

      console.log('Starting deletion process for post:', id);
      console.log('Current user:', user.id);

      // 먼저 관련 댓글들을 삭제
      const { error: commentError } = await supabase
        .from('mate_comment')
        .delete()
        .eq('post_id', id);

      if (commentError) {
        console.error('Error deleting comments:', commentError);
        throw commentError;
      }

      // 게시글 삭제
      const { error: postError } = await supabase
        .from('mate_post')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (postError) {
        console.error('Error deleting post:', postError);
        throw postError;
      }

      // 삭제 후 게시글 존재 여부 확인
      const { data: post, error: checkError } = await supabase
        .from('mate_post')
        .select('id')
        .eq('id', id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116은 레코드가 없을 때 발생하는 에러
        console.error('Error checking post deletion:', checkError);
        throw checkError;
      }

      if (post) {
        throw new Error('게시글이 삭제되지 않았습니다.');
      }

      alert('게시글이 삭제되었습니다.');
      router.push('/mate');
    } catch (error: any) {
      console.error('Error deleting post:', error);
      alert(error.message || '게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleEditClick = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleEditSave = async (commentId: number) => {
    try {
      const { error } = await supabase
        .from('mate_comment')
        .update({ content: editContent })
        .eq('id', commentId)
        .eq('user_id', currentUserId);

      if (error) throw error;
      setEditingCommentId(null);
      setEditContent('');
      fetchComments();
    } catch (error) {
      alert('댓글 수정 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;
    try {
      const { error } = await supabase
        .from('mate_comment')
        .delete()
        .eq('id', commentId)
        .eq('user_id', currentUserId);

      if (error) throw error;
      fetchComments();
    } catch (error) {
      alert('댓글 삭제 중 오류가 발생했습니다.');
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

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <p className="text-center text-gray-500">게시글을 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              {post.nickname && (
                <div className="font-bold text-blue-700 mb-1">{post.nickname}</div>
              )}
              <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
              <p className="text-base text-gray-500">
                {TEAMS.find(team => team.id === post.team_id)?.name} · {formatDate(post.game_date)}
                {post.location && (
                  <>
                    <span className="mx-2">·</span>
                    <span>{post.location}</span>
                  </>
                )}
              </p>
            </div>
            {isOwner && (
              <div className="flex space-x-2">
                <button
                  onClick={() => router.push(`/mate/${post.id}/edit`)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  수정
                </button>
                <button
                  onClick={handleDeletePost}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  삭제
                </button>
              </div>
            )}
          </div>

          {post.image_url && (
            <div className="mb-8 relative w-full h-[400px]">
              <Image
                src={post.image_url}
                alt="게시글 이미지"
                fill
                className="object-contain rounded-xl"
                priority
              />
            </div>
          )}
          
          <div className="bg-white min-h-[100px] mb-6">
            <p className="text-xl leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>

          <div className="flex items-center text-base text-gray-500">
            <span>참여자 {post.current_participants}/{post.max_participants}명</span>
            <span className="mx-2">·</span>
            <span>작성일 {formatDate(post.created_at)}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold mb-6">댓글 {comments.length}</h2>

          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={commentLoading || !newComment.trim()}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 font-medium flex items-center gap-2"
              >
                {commentLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    작성 중...
                  </>
                ) : (
                  '댓글 작성'
                )}
              </button>
            </div>
          </form>

          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-6">
                {comment.nickname && (
                  <div className="font-bold text-blue-700 mb-1">{comment.nickname}</div>
                )}
                {editingCommentId === comment.id ? (
                  <>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                    />
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleEditSave(comment.id)} className="px-3 py-1 bg-blue-500 text-white rounded">저장</button>
                      <button onClick={handleEditCancel} className="px-3 py-1 bg-gray-300 rounded">취소</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-800 mb-2">{comment.content}</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      {formatDate(comment.created_at)}
                      {comment.user_id === currentUserId && (
                        <span className="flex gap-2 ml-3">
                          <button onClick={() => handleEditClick(comment)} className="text-blue-500 text-xs">수정</button>
                          <button onClick={() => handleDeleteComment(comment.id)} className="text-red-500 text-xs">삭제</button>
                        </span>
                      )}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 