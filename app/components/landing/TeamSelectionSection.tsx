'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "lib/supabase-client";
import type { Database } from "@/types/database.types";

type Team = Database['public']['Tables']['teams']['Row'];

export default function TeamSelectionSection() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeams() {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .order('name');
        
        if (error) {
          console.error('Error fetching teams:', error);
          return;
        }

        setTeams(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">팀 로딩중...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">팀 선택</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {teams.map((team) => (
            <div key={team.id} className="bg-white p-4 rounded-lg shadow-md text-center cursor-pointer hover:shadow-lg transition-shadow">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <Image
                  src={team.logo_url}
                  alt={`${team.name} 로고`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                />
              </div>
              <p className="font-semibold">{team.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 