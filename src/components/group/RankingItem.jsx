// 랭킹 한 줄. 그룹 랭킹 / 전체 랭킹에서 공통 사용.
// 1·2·3위는 금/은/동 메달 + 틴트 배경, 4위부터는 흰 카드에 순위 숫자.
// 색은 전부 variables.css 토큰 → tailwind 매핑을 사용 (하드코딩 X).
const TIER = {
  1: { medal: '🥇', wrap: 'bg-rank-gold-tint border-2 border-rank-gold' },
  2: { medal: '🥈', wrap: 'bg-rank-silver-tint border-2 border-rank-silver' },
  3: { medal: '🥉', wrap: 'bg-rank-bronze-tint border-2 border-rank-bronze' },
};

export default function RankingItem({ rank, name, caption, isMe = false, avatarUrl }) {
  const tier = TIER[rank];

  return (
    <div
      className={`flex items-center gap-3 rounded-item px-4 py-3 ${
        tier ? tier.wrap : 'border border-line bg-surface'
      }`}
    >
      {/* 순위 표시: 상위 3위는 메달, 그 외는 숫자 */}
      <div className="w-7 shrink-0 text-center">
        {tier ? (
          <span className="text-2xl leading-none">{tier.medal}</span>
        ) : (
          <span className="text-section font-semibold text-ink">{rank}</span>
        )}
      </div>

      {/* 아바타 (이미지 없으면 회색 원 placeholder) */}
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="h-9 w-9 shrink-0 rounded-full object-cover" />
      ) : (
        <div className="h-9 w-9 shrink-0 rounded-full bg-surface-alt" />
      )}

      {/* 이름 + 캡션 */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-body font-semibold text-ink">{name}</span>
          {isMe && (
            <span className="shrink-0 rounded-full bg-primary px-1.5 py-0.5 text-nav text-white">
              나
            </span>
          )}
        </div>
        {caption && <p className="text-caption text-muted">{caption}</p>}
      </div>
    </div>
  );
}
