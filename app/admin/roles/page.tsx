"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

const ROLE_LABELS = {
  admin: "운영자",
  moderator: "콘텐츠 관리자",
  user: "일반 사용자",
};

const ADMIN_PAGES = [
  { key: "dashboard", label: "통계 대시보드" },
  { key: "reports", label: "신고 관리" },
  { key: "users", label: "사용자 관리" },
  { key: "roles", label: "권한 관리" },
  { key: "announcements", label: "공지사항 관리" },
];

const ROLE_OPTIONS = [
  { value: "admin", label: "운영자" },
  { value: "moderator", label: "콘텐츠 관리자" },
  { value: "user", label: "일반 사용자" },
];

export default function AdminRolesPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [originalUsers, setOriginalUsers] = useState<any[]>([]);
  const [pageRoles, setPageRoles] = useState<{ [key: string]: string[] }>({});
  const [originalPageRoles, setOriginalPageRoles] = useState<{ [key: string]: string[] }>({});

  // 유저 목록 불러오기
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("user")
        .select("id, nickname, email, role");
      if (!error && data) {
        setUsers(data);
        setOriginalUsers(data);
      }
    };
    fetchUsers();
  }, []);

  // 페이지별 접근 권한 불러오기
  useEffect(() => {
    const fetchPageRoles = async () => {
      const { data, error } = await supabase.from("admin_page_roles").select("*");
      if (!error && data) {
        const map: { [key: string]: string[] } = {};
        data.forEach((row: { page_key: string; role: string }) => {
          if (!map[row.page_key]) map[row.page_key] = [];
          map[row.page_key].push(row.role);
        });
        setPageRoles(map);
        setOriginalPageRoles(map);
      }
    };
    fetchPageRoles();
  }, []);

  // 역할 변경 (state만 변경)
  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  // 페이지별 접근 권한 토글 (state만 변경)
  const handlePageRoleToggle = (pageKey: string, role: string) => {
    setPageRoles((prev) => {
      const allowed = prev[pageKey] || [];
      if (allowed.includes(role)) {
        return {
          ...prev,
          [pageKey]: allowed.filter((r) => r !== role),
        };
      } else {
        return {
          ...prev,
          [pageKey]: [...allowed, role],
        };
      }
    });
  };

  // 역할 저장
  const handleSaveRoles = async () => {
    const updates = users.filter(
      (u) => originalUsers.find((ou) => ou.id === u.id)?.role !== u.role
    );
    for (const u of updates) {
      await supabase.from("user").update({ role: u.role }).eq("id", u.id);
    }
    window.location.reload();
  };

  // 접근 권한 저장
  const handleSavePageRoles = async () => {
    // 1. 기존과 달라진 부분만 insert/delete
    for (const pageKey of Object.keys({ ...pageRoles, ...originalPageRoles })) {
      const before = new Set(originalPageRoles[pageKey] || []);
      const after = new Set(pageRoles[pageKey] || []);
      // 추가된 role
      for (const role of Array.from(after)) {
        if (!before.has(role)) {
          await supabase.from("admin_page_roles").insert({ page_key: pageKey, role });
        }
      }
      // 삭제된 role
      for (const role of Array.from(before)) {
        if (!after.has(role)) {
          await supabase.from("admin_page_roles").delete().eq("page_key", pageKey).eq("role", role);
        }
      }
    }
    window.location.reload();
  };

  return (
    <div className="p-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">권한 관리</h1>
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">사용자 역할 부여/회수</h2>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleSaveRoles}
            >
              역할 저장
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 mb-4">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">닉네임</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">이메일</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">현재 역할</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">역할 변경</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-center text-sm text-gray-900">{u.nickname}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{ROLE_LABELS[u.role]}</td>
                    <td className="px-4 py-3 text-center">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">역할별 접근 허용 페이지 설정</h2>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleSavePageRoles}
            >
              접근 권한 저장
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">페이지</th>
                  {ROLE_OPTIONS.map((role) => (
                    <th key={role.value} className="px-4 py-3 text-center text-xs font-semibold text-gray-700">{role.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {ADMIN_PAGES.map((page) => (
                  <tr key={page.key}>
                    <td className="px-4 py-3 text-center text-sm text-gray-900">{page.label}</td>
                    {ROLE_OPTIONS.map((role) => {
                      const isChecked = Array.isArray(pageRoles[page.key]) && pageRoles[page.key].includes(role.value);
                      return (
                        <td key={role.value} className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handlePageRoleToggle(page.key, role.value)}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
} 