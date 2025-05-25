'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "lib/supabase-client";
import type { Database } from "@/types/database.types";
import { motion, AnimatePresence } from "framer-motion";

type Team = Database['public']['Tables']['teams']['Row'];

export default function TeamSelectionSection() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [favoriteTeamId, setFavoriteTeamId] = useState<number | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [showSelect, setShowSelect] = useState(false);

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

  useEffect(() => {
    async function fetchFavoriteTeam() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setUserLoaded(true);
        return;
      }
      const { data, error } = await supabase
        .from('user')
        .select('favorite_team_id')
        .eq('id', user.id)
        .single();
      if (!error && data && data.favorite_team_id) {
        setFavoriteTeamId(data.favorite_team_id);
      }
      setUserLoaded(true);
    }
    fetchFavoriteTeam();
  }, [showSelect]);

  const handleTeamSelect = async (teamId: number) => {
    setSelecting(true);
    setMessage(null);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setMessage('팀 선택을 위해서는 로그인이 필요합니다.');
        setSelecting(false);
        return;
      }
      const { error } = await supabase
        .from('user')
        .update({ favorite_team_id: teamId })
        .eq('id', user.id);
      if (error) {
        setMessage('팀 선택 저장에 실패했습니다.');
      } else {
        setMessage(null);
        setFavoriteTeamId(teamId);
        setShowSelect(false);
      }
    } catch (e) {
      setMessage('알 수 없는 오류가 발생했습니다.');
    } finally {
      setSelecting(false);
    }
  };

  const handleReset = () => {
    setShowSelect(true);
    setFavoriteTeamId(null);
    setMessage(null);
  };

  if (loading || !userLoaded) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">팀 로딩중...</h2>
        </div>
      </section>
    );
  }

  if (favoriteTeamId && !showSelect) {
    const selectedTeam = teams.find(t => t.id === favoriteTeamId);
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute right-0 top-0">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 font-semibold"
            >
              팀 다시 선택하기
            </button>
          </div>
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-700">팀 선택 완료!</h2>          
          <div className="flex flex-col items-center justify-center">
            <AnimatePresence>
              {selectedTeam && (
                <motion.div
                  key={selectedTeam.id}
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.3, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="bg-white p-8 rounded-lg shadow-md text-center"
                >
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    <Image
                      src={selectedTeam.logo_url}
                      alt={`${selectedTeam.name} 로고`}
                      fill
                      className="object-contain"
                      sizes="320px"
                    />
                  </div>
                  <p className="font-bold text-2xl mt-2">{selectedTeam.name}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
            <div
              key={team.id}
              className="bg-white p-4 rounded-lg shadow-md text-center cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => !selecting && handleTeamSelect(team.id)}
              style={{ opacity: selecting ? 0.6 : 1, pointerEvents: selecting ? 'none' : 'auto' }}
            >
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
        {message && (
          <div className="mt-6 text-center text-sm text-blue-600 font-semibold">{message}</div>
        )}
      </div>
    </section>
  );
} 
