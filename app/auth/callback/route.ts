import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    
    // 코드를 세션으로 교환
    await supabase.auth.exchangeCodeForSession(code);
    
    // 사용자 정보 가져오기
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // 사용자 정보를 데이터베이스에 저장
      await supabase
        .from('user')
        .upsert({
          id: user.id,
          email: user.email,
          last_sign_in_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });
    }
  }

  // 홈페이지로 리다이렉트
  return NextResponse.redirect(new URL('/', requestUrl.origin));
} 