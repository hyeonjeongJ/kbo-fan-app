"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';

// 신고 상세 모달 컴포넌트
function ReportDetailModal({ report, onClose }: { report: any, onClose: () => void }) {
  if (!report) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-[400px] relative">
        <button className="absolute top-2 right-2" onClick={onClose}>✕</button>
        <h2 className="text-xl font-bold mb-4">신고 상세</h2>
        <div className="mb-2"><b>신고자:</b> {report.reporter?.nickname || report.reporter?.email}</div>
        <div className="mb-2"><b>작성자:</b> {report.author?.nickname || report.author?.email}</div>
        <div className="mb-2"><b>유형:</b> {report.target_type}</div>
        <div className="mb-2"><b>신고일:</b> {report.created_at?.slice(0, 10)}</div>
        <div className="mb-2"><b>사유:</b> {report.reason}</div>
        <div className="mb-2"><b>상태:</b> {report.status}</div>
        <div className="mb-2"><b>콘텐츠 미리보기:</b><br/>{report.content_preview}</div>
      </div>
    </div>
  );
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('created_at');
  const [page, setPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [heatmap, setHeatmap] = useState<{[date: string]: number}>({});

  useEffect(() => {
    fetchReports();
  }, [filter, sort, page]);

  async function fetchReports() {
    setLoading(true);
    let query = supabase
      .from('reports')
      .select(`*, reporter:reporter_id (nickname, email), author:user_id (nickname, email)`)
      .order(sort, { ascending: false })
      .range((page - 1) * 20, page * 20 - 1);
    if (filter !== 'all') query = query.eq('target_type', filter);
    const { data, error } = await query;
    if (!error && data) {
      setReports(data);
      // 히트맵 데이터 생성
      const map: {[date: string]: number} = {};
      data.forEach((r: any) => {
        const d = r.created_at.slice(0, 10);
        map[d] = (map[d] || 0) + 1;
      });
      setHeatmap(map);
    }
    setLoading(false);
  }

  async function handleAction(reportId: number, action: string) {
    await supabase.from('reports').update({ status: action }).eq('id', reportId);
    fetchReports();
  }

  return (
    <div className="p-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">신고 관리</h1>
        {loading ? (
          <div>로딩 중...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">신고일</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">유형</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">신고자</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">작성자</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">미리보기</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">사유</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">상태</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">조치</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {reports.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelectedReport(r)}>
                    <td className="px-4 py-3 text-sm text-gray-900">{r.created_at.slice(0, 10)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.target_type}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.reporter?.nickname || r.reporter?.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.author?.nickname || r.author?.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.content_preview?.slice(0, 30)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.reason}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.status}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={e => {e.stopPropagation(); handleAction(r.id, 'hidden');}} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200 transition mr-1">숨기기</button>
                      <button onClick={e => {e.stopPropagation(); handleAction(r.id, 'deleted');}} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 transition mr-1">삭제</button>
                      <button onClick={e => {e.stopPropagation(); handleAction(r.id, 'ignored');}} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded hover:bg-gray-200 transition">무시</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* 페이징 */}
        <div className="mt-4 flex gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 transition">이전</button>
          <span className="px-2 py-1 text-gray-700 font-semibold">{page}</span>
          <button onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 transition">다음</button>
        </div>
        {/* 상세 모달 */}
        {selectedReport && <ReportDetailModal report={selectedReport} onClose={() => setSelectedReport(null)} />}
      </div>
    </div>
  );
} 