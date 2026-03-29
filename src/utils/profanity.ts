const BLOCKLIST = [
  // 욕설
  "씨발",
  "씨팔",
  "시발",
  "시팔",
  "ㅅㅂ",
  "ㅆㅂ",
  "개새끼",
  "개새",
  "ㄱㅅㄲ",
  "병신",
  "ㅂㅅ",
  "미친",
  "미친놈",
  "미친년",
  "지랄",
  "ㅈㄹ",
  "존나",
  "ㅈㄴ",
  "fuck",
  "shit",
  "bitch",
  "asshole",
  // 혐오
  "보지",
  "자지",
  "섹스",
  "sex",
  "ㅂㅈ",
  "ㅈㅈ",
  "ㅅㅅ",
];

export function hasProfanity(text: string): boolean {
  const normalized = text.toLowerCase().replace(/\s/g, "");
  return BLOCKLIST.some((word) => normalized.includes(word.toLowerCase()));
}
