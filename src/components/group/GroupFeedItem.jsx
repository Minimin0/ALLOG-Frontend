// 인증 피드 카드 한 개. 상태별 3가지 모양:
//  - 'me'      : 내 미인증 (초록 틴트 + 인증하기)
//  - 'waiting' : 다른 멤버 대기중 (흰 카드 + 응원하기)
//  - 'verified': 인증 완료 (인증 사진 + 이름/시간 + ⋯ 재인증 요청)
export default function GroupFeedItem({ name, status, timeAgo, image, onVerify, onCheer, onReport }) {
  if (status === 'verified') {
    return (
      <div className="relative aspect-[3/4] overflow-hidden rounded-card bg-ink">
        {/* 인증 사진 (없으면 그라데이션 폴백) */}
        {image ? (
          <img src={image} alt={`${name}의 인증`} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-subtle to-ink" />
        )}

        {/* 점 세개 메뉴 → 재인증 요청 */}
        <button
          onClick={onReport}
          className="absolute right-2 top-1 text-lg leading-none text-white/90"
          aria-label="재인증 요청"
        >
          ⋯
        </button>

        <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface text-[10px] font-semibold text-ink">
            {name[0]}
          </span>
          <div className="leading-tight text-white">
            <p className="text-caption font-semibold drop-shadow">{name}</p>
            <p className="text-[10px] text-white/80 drop-shadow">{timeAgo}</p>
          </div>
        </div>
      </div>
    );
  }

  const isMe = status === 'me';
  return (
    <div
      className={`flex aspect-[3/4] flex-col rounded-card border border-line p-4 ${
        isMe ? 'bg-primary-tint' : 'bg-surface'
      }`}
    >
      <p className="whitespace-pre-line text-body font-bold leading-snug text-ink">
        {isMe ? '아직 오늘\n인증을 안했어요.' : '인증을\n기다리는 중이에요.'}
      </p>

      {/* 버튼: 카드 정중앙 (위치 유지, 그림자로 입체감만 추가) */}
      <div className="flex flex-1 items-center justify-center">
        <button
          onClick={isMe ? onVerify : onCheer}
          className="rounded-pill bg-ink px-6 py-2.5 text-caption font-bold text-white shadow-sm transition-transform active:scale-95"
        >
          {isMe ? '인증하기' : '응원하기'}
        </button>
      </div>

      {/* 아바타: "나"는 아바타 안에 이미 표시되므로 옆에 같은 글자를 또 적지
          않는다 — 자리는 그대로 두고 중복 표기만 정리. */}
      <div className="flex items-center gap-1.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-white">
          {isMe ? '나' : name[0]}
        </span>
        {!isMe && <span className="text-caption text-ink">{name}</span>}
      </div>
    </div>
  );
}
