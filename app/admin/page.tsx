"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "lib/supabase-client";
import Link from "next/link";
import { FaUserShield, FaUserFriends, FaChartBar, FaBullhorn, FaFlag } from "react-icons/fa";

const adminFeatures = [
  {
    title: "신고 관리",
    description: "유저 신고 내역을 확인하고 처리하세요.",
    icon: <FaFlag size={24} color="#6366f1" />,
    href: "/admin/reports",
  },
  {
    title: "사용자 관리",
    description: "회원 정보를 조회하고 관리하세요.",
    icon: <FaUserFriends size={24} color="#6366f1" />,
    href: "/admin/users",
  },
  {
    title: "통계",
    description: "사이트 활동 통계를 확인하세요.",
    icon: <FaChartBar size={24} color="#6366f1" />,
    href: "/admin/dashboard",
  },
  {
    title: "권한 관리",
    description: "관리자/모더레이터 권한을 관리하세요.",
    icon: <FaUserShield size={24} color="#6366f1" />,
    href: "/admin/roles",
  },
  {
    title: "공지사항 관리",
    description: "사이트 공지사항을 등록/수정하세요.",
    icon: <FaBullhorn size={24} color="#6366f1" />,
    href: "/admin/announcements",
  },
];

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setChecking(false);
        return;
      }
      const { data, error } = await supabase
        .from("user")
        .select("role")
        .eq("id", user.id)
        .single();
      if (error || !data) {
        setRole(null);
      } else {
        setRole(data.role);
      }
      setChecking(false);
    };
    if (user) fetchRole();
    else setChecking(false);
  }, [user]);

  useEffect(() => {
    if (loading || checking) return;
    if (!user) {
      router.replace("/");
      return;
    }
    if (role === "admin" || role === "moderator") {
      return;
    }
    if (role !== null) {
      router.replace("/");
    }
  }, [user, role, loading, checking, router]);

  if (loading || checking) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  if (!user || (role !== "admin" && role !== "moderator")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">관리자 대시보드</h1>
          <p className="text-gray-600 text-base sm:text-lg">사이트 운영을 위한 주요 기능을 한눈에 확인하세요.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminFeatures.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group bg-white rounded-xl shadow-md p-6 flex flex-col items-start hover:shadow-lg transition-shadow duration-200 focus-within:ring-2 focus-within:ring-indigo-500"
            >
              <div className="mb-4">{feature.icon}</div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h2>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 