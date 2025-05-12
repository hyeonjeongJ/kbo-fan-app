export interface Post {
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
} 