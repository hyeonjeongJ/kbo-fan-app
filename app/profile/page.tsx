"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNickname = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from("user")
          .select("nickname")
          .eq("id", user.id)
          .single();
        if (data?.nickname) {
          setNickname(data.nickname);
        }
      }
    };
    fetchNickname();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!nickname || nickname.length < 2) {
        setError("닉네임은 2자 이상이어야 합니다.");
        setLoading(false);
        return;
      }
      const { error } = await supabase
        .from("user")
        .update({ nickname })
        .eq("id", user.id);
      if (error) throw error;
      alert("닉네임이 저장되었습니다!");
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">로그인이 필요합니다.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">닉네임 설정</h1>
        <input
          type="text"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          minLength={2}
          maxLength={20}
          required
          placeholder="닉네임을 입력하세요"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          {loading ? "저장 중..." : "닉네임 저장"}
        </button>
      </form>
    </div>
  );
} 