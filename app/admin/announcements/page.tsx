"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";

const ANNOUNCEMENT_TYPES = [
  { value: "all", label: "전체 공지" },
  { value: "team", label: "팀별 공지" },
  { value: "path", label: "특정 경로 공지" },
];

const BANNER_LOCATIONS = [
  { value: "home", label: "홈" },
  { value: "team", label: "팀별 페이지" },
];

const emptyAnnouncement = {
  id: null,
  title: "",
  content: "",
  type: "all",
  target: "",
  start_date: "",
  end_date: "",
  priority: 1,
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(emptyAnnouncement);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

  // 공지사항/배너 불러오기
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: ann, error: annError } = await supabase
      .from("announcements")
      .select("*")
      .order("priority", { ascending: true });
    if (!annError && ann) setAnnouncements(ann);
    const { data: ban, error: banError } = await supabase
      .from("banners")
      .select("*")
      .order("priority", { ascending: true });
    if (!banError && ban) setBanners(ban);
    setLoading(false);
  };

  // 공지사항 삭제
  const handleDeleteAnnouncement = async (id: string) => {
    await supabase.from("announcements").delete().eq("id", id);
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  // 배너 삭제
  const handleDeleteBanner = async (id: string) => {
    await supabase.from("banners").delete().eq("id", id);
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  // 공지사항 수정/추가 모달 열기
  const openAnnouncementModal = (announcement?: any) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
    } else {
      setEditingAnnouncement(emptyAnnouncement);
    }
    setShowModal(true);
  };

  // 공지사항 저장
  const handleSaveAnnouncement = async () => {
    const a = editingAnnouncement;
    const startDateIso = a.start_date ? new Date(a.start_date).toISOString() : null;
    const endDateIso = a.end_date ? new Date(a.end_date).toISOString() : null;
    if (a.id) {
      // update
      await supabase.from("announcements").update({
        title: a.title,
        content: a.content,
        type: a.type,
        target: a.target,
        start_date: startDateIso,
        end_date: endDateIso,
        priority: a.priority,
      }).eq("id", a.id);
    } else {
      // insert
      const { error } = await supabase.from("announcements").insert({
        title: a.title,
        content: a.content,
        type: a.type,
        target: a.target,
        start_date: startDateIso,
        end_date: endDateIso,
        priority: a.priority,
      }).select();
      if (error) console.error('insert error:', error);
    }
    setShowModal(false);
    await fetchData();
  };

  return (
    <div className="p-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">공지사항 관리</h1>
        <div className="flex items-center justify-between mb-4">
          <div></div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => openAnnouncementModal()}>공지 추가</button>
        </div>
        {loading ? (
          <div>로딩 중...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">제목</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">작성일</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">상태</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">관리</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {announcements.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelectedAnnouncement(a)}>
                    <td className="px-4 py-3 text-sm text-gray-900">{a.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{a.created_at?.slice(0, 10)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{a.status}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={e => {e.stopPropagation(); openAnnouncementModal(a);}} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition mr-1">수정</button>
                      <button onClick={e => {e.stopPropagation(); handleDeleteAnnouncement(a.id);}} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 transition">삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* 공지사항 입력 모달 */}
        {showModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 min-h-screen">
            <div className="bg-white p-8 rounded-lg w-full max-w-md relative mx-auto my-auto">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowModal(false)}>×</button>
              <h3 className="text-xl font-bold mb-4 text-center">{editingAnnouncement.id ? '공지 수정' : '공지 추가'}</h3>
              <form className="grid grid-cols-1 gap-4 w-full max-w-md mx-auto px-2">
                <div className="grid grid-cols-4 gap-2 items-center">
                  <label className="col-span-1 text-right text-sm text-gray-700 px-2">제목</label>
                  <input className="col-span-3 w-full border rounded px-3 py-2 min-w-0" placeholder="제목" value={editingAnnouncement.title} onChange={e => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })} />
                </div>
                <div className="grid grid-cols-4 gap-2 items-center">
                  <label className="col-span-1 text-right text-sm text-gray-700 px-2">내용</label>
                  <textarea className="col-span-3 w-full border rounded px-3 py-2 min-w-0" placeholder="내용" value={editingAnnouncement.content} onChange={e => setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value })} />
                </div>
                <div className="grid grid-cols-4 gap-2 items-center">
                  <label className="col-span-1 text-right text-sm text-gray-700 px-2">유형</label>
                  <select className="col-span-3 w-full border rounded px-3 py-2 min-w-0" value={editingAnnouncement.type} onChange={e => setEditingAnnouncement({ ...editingAnnouncement, type: e.target.value })}>
                    {ANNOUNCEMENT_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-4 gap-2 items-center">
                  <label className="col-span-1 text-right text-sm text-gray-700 px-2">대상</label>
                  <input className="col-span-3 w-full border rounded px-3 py-2 min-w-0" placeholder="대상(팀명/경로)" value={editingAnnouncement.target} onChange={e => setEditingAnnouncement({ ...editingAnnouncement, target: e.target.value })} />
                </div>
                <div className="grid grid-cols-4 gap-2 items-center">
                  <label className="col-span-1 text-right text-sm text-gray-700 px-2">노출기간</label>
                  <div className="col-span-3 flex items-center gap-2 min-w-0">
                    <input type="date" className="border rounded px-3 py-2 w-full max-w-[140px] min-w-0" value={editingAnnouncement.start_date} onChange={e => setEditingAnnouncement({ ...editingAnnouncement, start_date: e.target.value })} />
                    <span className="mx-1">~</span>
                    <input type="date" className="border rounded px-3 py-2 w-full max-w-[140px] min-w-0" value={editingAnnouncement.end_date} onChange={e => setEditingAnnouncement({ ...editingAnnouncement, end_date: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 items-center">
                  <label className="col-span-1 text-right text-sm text-gray-700 px-2">우선순위</label>
                  <input type="number" className="col-span-3 w-full border rounded px-3 py-2 min-w-0" placeholder="우선순위" value={editingAnnouncement.priority} onChange={e => setEditingAnnouncement({ ...editingAnnouncement, priority: Number(e.target.value) })} />
                </div>
              </form>
              <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={handleSaveAnnouncement}>{editingAnnouncement.id ? '수정 저장' : '공지 추가'}</button>
            </div>
          </div>
        )}
      </div>
      <section className="mt-10">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">배너 관리</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">배너 추가</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">제목</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">이미지</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">노출 위치</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">노출기간</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">우선순위</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">관리</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {banners.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition cursor-pointer">
                    <td className="px-4 py-3 text-sm text-gray-900">{b.title}</td>
                    <td className="px-4 py-3"><img src={b.image_url} alt={b.title} className="h-10" /></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{BANNER_LOCATIONS.find(l => l.value === b.location)?.label}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{b.start_date} ~ {b.end_date}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{b.priority}</td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition mr-1">수정</button>
                      <button className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 transition" onClick={() => handleDeleteBanner(b.id)}>삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
} 