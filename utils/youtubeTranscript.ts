import { YoutubeTranscript } from 'youtube-transcript';

export async function getYoutubeTranscript(videoUrl: string): Promise<string> {
  const res = await fetch('/api/youtube-transcript', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoUrl }),
  });
  if (!res.ok) throw new Error('유튜브 자막을 추출할 수 없습니다.');
  const data = await res.json();
  return data.transcript;
} 