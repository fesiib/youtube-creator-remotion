# Creator Profile

> **What this is:** a project-agnostic record of Sehoon's editorial taste. Loaded at the start of every editing collaboration to align the agent. Updated through interview, explicit revisits, or implicit observations during work.
>
> **What this isn't:** a brief for any specific video, channel-management instructions, or technical setup notes. Those live elsewhere.

**Creator:** Sehoon Lim (@sehoon1106)
**Channel:** HCI / CS research explainer (YouTube)
**Profile version:** 1
**Last updated:** 2026-05-12

---

## 1. Channel identity

- **One-sentence description:** HCI 및 CS 연구 논문을 귀엽고 활기찬 애니메이션으로 풀어 설명하는 채널
- **Audience (who watches and why):** HCI·CS에 관심 있는 학생 및 연구자, 논문을 직접 읽기 어려운 일반인
- **Value proposition (why this channel and not another):** 연구자 본인이 직접 논문을 복제·구현한 경험을 바탕으로 설명하기 때문에 깊이가 있음
- **Adjacent channels in the space:** _[미정]_

## 2. Format & rhythm

- **Typical length range:** ~90초 (short-form explainer)
- **Standard structural template:** Hook → Paper 소개 → Study 방법 → Conditions → Results → Implications → 본인 Replication → CTA
- **Pacing philosophy:** 씬당 자막 2–3줄, 한 씬에 너무 오래 머물지 않음
- **Recurring beats:** 인트로 Hook, 자막 자막 시스템, CTA (좋아요/구독 + 열린 질문 3개)

## 3. Voice & writing

- **Register:** 친근하고 대화체, 학술적이지 않게
- **Humor style:** 귀여운 이모지와 시각적 유머 (텍스트 개그보다 비주얼)
- **Signature phrases or verbal tics:** _[미정]_
- **Words / tones to avoid:** 딱딱한 학술 용어를 그대로 나열하는 것
- **Example of "very on-brand" line:** "Just seeing altered photos changed what they 'remembered.'"
- **Example of "off-brand, would never say" line:** "This study demonstrates a statistically significant correlation between..."

## 4. Hook strategy

- **Hook archetype(s):** 충격적인 질문 또는 반직관적 사실로 시작 ("AI가 편집한 사진이 당신의 기억을 바꿀 수 있다면?")
- **Hook archetypes to avoid:** 긴 자기소개, 채널 구독 유도로 시작
- **Typical hook length:** 5초 내외
- **Pattern interrupts:** 시각 일러스트레이션이 등장하면서 주의를 끔

## 5. Cuts & pacing

- **Jump-cut density:** _[미정]_
- **When to let a moment land:** 결과 수치나 드라마틱한 포인트에서 약간 멈춤
- **Breathing room rules:** 씬 전환 시 트랜지션으로 리듬 제공
- **Scene transition style:** 맥락에 맞는 트랜지션 사용 (슬라이드, 줌인, 자유낙하 등) — 모든 씬에 같은 트랜지션 반복 금지

## 6. B-roll philosophy

- **Approach:** CSS/React로 만든 커스텀 일러스트레이션 위주 (실제 영상 없음)
- **Style:** FakePhoto, BrainSplit, BrowserMockup 등 심플한 추상 일러스트
- **Stock footage:** 사용 안 함

## 7. Visual treatment

- **Overall aesthetic:** **귀엽고(cute), 밝고(bright), 활기차게(active)** — modern·elegant 스타일은 금지
- **Color palette:** coral, teal, purple, orange, green, blue, yellow의 파스텔·비비드 조합. 배경은 연한 크림/민트/퍼플 계열
- **Screen content:** 텍스트 heavy 금지. 일러스트레이션·이모지·도형·애니메이션 위주
- **Subtitles:** 화면 하단 다크 pill 스타일 자막으로 내용 전달
- **Text-on-screen:** 제목·레이블 등 최소한으로, 주요 내용은 자막으로
- **Motion graphics:** 배경 blob은 항상 헤엄치듯 움직임. 설명용 figure 이모지는 대부분 정적, 강조 포인트에만 선택적으로 애니메이션
- **Zoom / punch-in:** 씬 전환에 맥락적으로 사용

## 8. Music & sound design

- _[미정]_

## 9. Captions & on-screen text

- **Always-on captions:** 커스텀 자막 시스템 (화면 하단 고정 pill)
- **Caption style:** 다크 반투명 배경, 흰 텍스트, fontSize 22, fontWeight 600
- **On-screen text density:** 낮음 — 자막이 메인, 화면엔 시각 요소 위주
- **Subtitle zone:** 하단 80–120px는 항상 자막 전용 공간으로 비워둘 것 (컨텐츠 겹침 금지)

## 10. Thumbnails & titles

- _[미정]_

## 11. Recurring bits & motifs

- 배경에 떠다니는 colored blob들 (항상 존재, 씬마다 다른 위치/방향에서 시작)
- 회전하는 ⭐ ✦ 장식 요소
- 씬 시작 시 요소들이 슬라이드/페이드로 등장
- CTA 씬의 열린 질문 3개 카드

## 12. Taboos

- **Bounce/overshoot 애니메이션 금지:** 요소가 목표 크기보다 커졌다가 줄어드는 spring 효과 사용 안 함. `Easing.out(Easing.cubic)` 또는 high-damping spring(`damping ≥ 50`) 사용할 것
- **모든 씬에 동일한 트랜지션 반복 금지:** 디졸브만 쓰면 지루함
- **설명용 이모지를 전부 움직이게 하면 안 됨:** 정신없어 보임. 배경 오브젝트와 강조 포인트만 애니메이션
- **자막이 컨텐츠를 가리는 레이아웃 금지:** 모든 씬의 하단 padding 확보 필수
- **텍스트 위주 화면 금지:** 화면은 시각 자료로 채우고 설명은 자막으로

## 13. Reference creators

- **Admires / learns from:** _[미정]_
- **Adjacent but distinct from:** _[미정]_
- **Specifically does not want to resemble:** 딱딱하고 슬라이드 발표 느낌의 설명 영상

## 14. Open questions / pending observations

- 한국어 자막 vs 영어 자막 방향 미결정
- 채널명·URL 미결정
- 배경음악 취향 미결정
- 썸네일 공식 미결정
- 영상 길이 — 90초 short-form이 맞는지, 더 긴 포맷도 고려할지

---

## Changelog

- 2026-05-12 — 전체 — 초안 작성. HCI explainer 첫 영상(CHI '25 false memory paper) 작업 중 수집한 피드백 기반. (implicit, 4회 이상 반복 관찰)
