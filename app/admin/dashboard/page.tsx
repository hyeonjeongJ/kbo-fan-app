"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

export default function AdminDashboardPage() {
  // 통계 state (실제 데이터 연동 전 mock 데이터)
  const [stats, setStats] = useState({
    posts: { day: 12, week: 80, month: 320 },
    comments: { day: 34, week: 210, month: 900 },
    reports: { day: 2, week: 10, month: 40 },
    visitors: { day: 120, week: 800, month: 3200 },
  });
  const [trendData, setTrendData] = useState({
    team: [
      { name: "LG 트윈스", value: 120 },
      { name: "SSG 랜더스", value: 90 },
      { name: "두산 베어스", value: 70 },
      { name: "기타", value: 40 },
    ],
    hourly: [5, 8, 12, 20, 30, 40, 60, 80, 100, 90, 70, 60, 50, 40, 30, 20, 10, 5, 3, 2, 1, 1, 1, 1],
    userGrowth: [10, 20, 35, 50, 80, 120, 180, 250, 300, 350, 400, 500],
    userGrowthLabels: [
      "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
    ],
  });

  // 날짜 계산
  const today = dayjs();
  const todayStr = today.format("YYYY.MM.DD");
  const todayDay = today.format("dd"); // 요일 (월, 화, ...)
  const weekStart = dayjs().startOf("week").add(1, 'day'); // 월요일
  const weekEnd = dayjs().endOf("week").add(1, 'day'); // 일요일
  const weekStartStr = weekStart.format("YYYY.MM.DD");
  const weekEndStr = weekEnd.format("YYYY.MM.DD");
  const weekStartDay = weekStart.format("dd");
  const weekEndDay = weekEnd.format("dd");

  // 실제 데이터 연동 시 useEffect로 supabase에서 fetch
  // useEffect(() => { ... }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">활동 통계 대시보드</h1>
      <div className="mb-2 flex flex-col md:flex-row md:items-end md:justify-between">
        <div className="text-lg font-bold text-black">
          일간 통계 {todayStr} ({todayDay})
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="게시글" value={stats.posts.day} subLabel="일간" />
        <StatCard label="댓글" value={stats.comments.day} subLabel="일간" />
        <StatCard label="신고" value={stats.reports.day} subLabel="일간" />
        <StatCard label="방문자" value={stats.visitors.day} subLabel="일간" />
      </div>
      <div className="mb-2 flex flex-col md:flex-row md:items-end md:justify-between">
        <div className="text-lg font-bold text-black">
          주간 통계 {weekStartStr} ({weekStartDay}) ~ {weekEndStr} ({weekEndDay})
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center w-full max-w-xl mx-auto">
          <h2 className="font-semibold mb-4 self-start">인기 팀</h2>
          <div className="w-full h-[250px] md:h-[350px]">
            <Pie
              data={{
                labels: trendData.team.map((t) => t.name),
                datasets: [
                  {
                    data: trendData.team.map((t) => t.value),
                    backgroundColor: [
                      "#4F46E5",
                      "#F59E42",
                      "#EF4444",
                      "#A1A1AA",
                    ],
                  },
                ],
              }}
              options={{
                plugins: { legend: { position: "bottom" } },
                maintainAspectRatio: false,
                responsive: true,
              }}
            />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center w-full max-w-xl mx-auto">
          <h2 className="font-semibold mb-4 self-start">시간대별 활동량</h2>
          <div className="w-full h-[250px] md:h-[350px]">
            <Bar
              data={{
                labels: Array.from({ length: 24 }, (_, i) => `${i}시`),
                datasets: [
                  {
                    label: "게시글+댓글 수",
                    data: trendData.hourly,
                    backgroundColor: "#4F46E5",
                  },
                ],
              }}
              options={{
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
                maintainAspectRatio: false,
                responsive: true,
              }}
            />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 mb-8 flex flex-col items-center w-full max-w-3xl mx-auto">
        <h2 className="font-semibold mb-4 self-start">사용자 증가 추이</h2>
        <div className="w-full h-[250px] md:h-[350px]">
          <Line
            data={{
              labels: trendData.userGrowthLabels,
              datasets: [
                {
                  label: "누적 가입자 수",
                  data: trendData.userGrowth,
                  borderColor: "#4F46E5",
                  backgroundColor: "#6366F1",
                  fill: true,
                  tension: 0.3,
                },
              ],
            }}
            options={{
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
              maintainAspectRatio: false,
              responsive: true,
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="주간 게시글" value={stats.posts.week} subLabel="주간" />
        <StatCard label="주간 댓글" value={stats.comments.week} subLabel="주간" />
        <StatCard label="주간 신고" value={stats.reports.week} subLabel="주간" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="월간 게시글" value={stats.posts.month} subLabel="월간" />
        <StatCard label="월간 댓글" value={stats.comments.month} subLabel="월간" />
        <StatCard label="월간 신고" value={stats.reports.month} subLabel="월간" />
      </div>
    </div>
  );
}

function StatCard({ label, value, subLabel }: { label: string; value: number; subLabel: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
      <div className="text-2xl font-bold mb-2">{value}</div>
      <div className="text-gray-700 font-semibold">{label}</div>
      <div className="text-xs text-gray-400 mt-1">{subLabel}</div>
    </div>
  );
} 