"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';

function UserDetailModal({ user, onClose }: { user: any, onClose: () => void }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    // 최근 게시글
    supabase.from('mate_post').select('id, title, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5).then(({ data }) => setPosts(data || []));
    // 신고 이력
    supabase.from('reports').select('id, reason, created_at, status').eq('reporter_id', user.id).order('created_at', { ascending: false }).limit(5).then(({ data }) => setReports(data || []));
  }, [user]);
  if (!user) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-[400px] relative">
        <button className="absolute top-2 right-2" onClick={onClose}>✕</button>
        <h2 className="text-xl font-bold mb-4">사용자 상세</h2>
        <div className="mb-2"><b>닉네임:</b> {user.nickname}</div>
        <div className="mb-2"><b>이메일:</b> {user.email}</div>
        <div className="mb-2"><b>가입일:</b> {user.created_at?.slice(0, 10)}</div>
        <div className="mb-2"><b>마지막 접속:</b> {user.last_sign_in_at?.slice(0, 10) || '-'}</div>
        <div className="mb-2"><b>게시물 수:</b> {user.post_count}</div>
        <div className="mb-4"><b>최근 게시글</b>
          <ul className="list-disc ml-4 text-sm">
            {posts.map(p => <li key={p.id}>{p.title} ({p.created_at.slice(0, 10)})</li>)}
            {posts.length === 0 && <li>없음</li>}
          </ul>
        </div>
        <div className="mb-4"><b>최근 신고 이력</b>
          <ul className="list-disc ml-4 text-sm">
            {reports.map(r => <li key={r.id}>{r.reason} ({r.created_at.slice(0, 10)}) [{r.status}]</li>)}
            {reports.length === 0 && <li>없음</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    // 유저 + 게시글 수 join (실제 컬럼명에 맞게 수정)
    const { data, error } = await supabase
      .from('user')
      .select('id, nickname, email, created_at, last_sign_in_at, mate_post(id)')
      .eq('role', 'user')
      .order('created_at', { ascending: false });
    console.log('user fetch result:', data, error);
    if (!error && data) {
      setUsers(
        data.map((u: any) => ({
          ...u,
          post_count: u.mate_post?.length || 0,
        }))
      );
    }
    setLoading(false);
  }

  async function banUser(userId: string, days: number) {
    const endAt = new Date();
    endAt.setDate(endAt.getDate() + days);
    await supabase.from('user_bans').insert({
      user_id: userId,
      start_at: new Date().toISOString(),
      end_at: endAt.toISOString(),
      reason: '관리자 정지',
    });
    fetchUsers();
  }

  return (
    <div className="p-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">사용자 관리</h1>
        {loading ? (
          <div>로딩 중...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">닉네임</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">이메일</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">가입일</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">마지막 접속</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">게시물 수</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">정지</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelectedUser(u)}>
                    <td className="px-4 py-3 text-sm text-gray-900">{u.nickname}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.created_at.slice(0, 10)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.last_sign_in_at?.slice(0, 10) || '-'}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900">{u.post_count}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={e => {e.stopPropagation(); banUser(u.id, 7);}} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200 transition mr-1">7일 정지</button>
                      <button onClick={e => {e.stopPropagation(); banUser(u.id, 30);}} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 transition">30일 정지</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* 상세 모달 */}
        {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
      </div>
    </div>
  );
} 