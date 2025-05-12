import { NextRequest, NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

export async function POST(req: NextRequest) {
  try {
    const { videoUrl } = await req.json();
    const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
    const text = transcript.map(item => item.text).join(' ');
    return NextResponse.json({ transcript: text });
  } catch (error) {
    return NextResponse.json({ error: '유튜브 자막을 추출할 수 없습니다.' }, { status: 500 });
  }
} 