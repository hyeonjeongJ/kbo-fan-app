import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function summarizeVideo(videoUrl: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `다음 유튜브 영상의 내용을 한국어로 요약해주세요. 주요 내용과 하이라이트를 포함해주세요: ${videoUrl}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error summarizing video:', error);
    throw error;
  }
}

export async function summarizeTranscript(transcript: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `다음 유튜브 영상의 자막을 한국어로 요약해줘. 주요 내용과 하이라이트를 포함해서:\n${transcript}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error summarizing transcript:', error);
    throw error;
  }
} 