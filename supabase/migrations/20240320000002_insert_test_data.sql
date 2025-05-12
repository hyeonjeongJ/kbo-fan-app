-- Insert test mate post
INSERT INTO public.mate_post (
    user_id,
    team_id,
    game_date,
    title,
    content,
    max_participants,
    current_participants,
    created_at,
    updated_at
) VALUES (
    '8d857c33-e446-42f7-9070-ccb16cae9e99',
    1, -- LG 트윈스
    '2024-03-23 14:00:00+09:00',
    'LG vs 두산 경기 같이 보실 분!',
    '잠실 야구장에서 LG 트윈스 경기 같이 보실 분 구합니다. 
    좌석은 1루석으로 예정되어 있습니다. 
    경기 후에 같이 저녁 식사도 가능합니다!',
    4,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert test comment
INSERT INTO public.mate_comment (
    post_id,
    user_id,
    content,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM public.mate_post ORDER BY created_at DESC LIMIT 1),
    '8d857c33-e446-42f7-9070-ccb16cae9e99',
    '저도 참여하고 싶습니다! 연락처 알려주세요.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
); 