import { useState } from 'react';

import CriteriaHelp from '@/components/group/CriteriaHelp.jsx';
import Podium from '@/components/group/Podium.jsx';
import { useInView } from '@/hooks/useInView.js';
import { mockGroup, mockGroupRanking } from '@/data/mockGroups.js';
import { rankMembers } from '@/utils/ranking.js';
import { calcScore, rewardFromScore } from '@/utils/score.js';

// 내 그룹 > 정보 탭. 그룹 기본정보 + 멤버 + 공동 성공률 + 남은기간/내순위 + 시상대.
function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-line py-3">
      <span className="text-body text-muted">{label}</span>
      <span className="text-body font-semibold text-ink">{value}</span>
    </div>
  );
}

export default function GroupInfoPage() {
  const scored = mockGroupRanking.map((m) => ({ ...m, score: calcScore(m.breakdown).total }));
  const ranked = rankMembers(scored);
  const top3 = ranked.filter((m) => m.rank <= 3);
  const me = ranked.find((m) => m.isMe);
  const [membersOpen, setMembersOpen] = useState(false); // 현재 인원 토글
  const [gaugeRef, gaugeInView] = useInView(); // 성공률 게이지 등장 감지
  const [copied, setCopied] = useState(false); // 초대 코드 복사 토스트

  const handleCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText(mockGroup.inviteCode);
    } catch {
      // 클립보드 권한 실패 시에도 안내는 표시 (해커톤 데모)
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // 2초 후 사라짐
  };

  return (
    <div className="space-y-6 p-5">
      {/* 그룹 기본 정보 */}
      <section>
        <InfoRow label="그룹명" value={mockGroup.title} />
        <InfoRow label="기간" value={mockGroup.periodText} />

        {/* 현재 인원: 클릭 시 멤버 리스트 토글 */}
        <button
          type="button"
          onClick={() => setMembersOpen((open) => !open)}
          aria-expanded={membersOpen}
          className="flex w-full items-center justify-between border-b border-line py-3"
        >
          <span className="text-body text-muted">현재 인원</span>
          <span className="flex items-center gap-1 text-body font-semibold text-ink">
            {mockGroup.totalMembers} 명
            <span className={`text-muted transition-transform ${membersOpen ? 'rotate-90' : ''}`}>
              &rsaquo;
            </span>
          </span>
        </button>

        {/* 접이식 멤버 리스트 — max-height 트랜지션으로 부드럽게 펼침/접힘 */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            membersOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-wrap gap-3 border-b border-line py-4">
            {ranked.map((m) => (
              <div key={m.id} className="flex w-12 flex-col items-center gap-1">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-caption font-bold text-white">
                  {m.name[0]}
                </span>
                <span className="text-[10px] text-ink">{m.isMe ? '나' : m.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 초대 코드: 누르면 복사 + 토스트 */}
        <button
          type="button"
          onClick={handleCopyInvite}
          className="flex w-full items-center justify-between border-b border-line py-3"
        >
          <span className="text-body text-muted">초대 코드</span>
          <span className="flex items-center gap-1.5 text-body font-semibold text-ink">
            🔗 {mockGroup.inviteCode}
          </span>
        </button>
      </section>

      {/* 공동 성공률 */}
      <section ref={gaugeRef} className="rounded-item border border-line bg-surface p-4">
        <div className="flex items-center justify-between">
          <span className="text-caption font-semibold text-ink">우리 그룹 공동 성공률</span>
          <span className="text-score font-bold text-primary">{mockGroup.successRate}%</span>
        </div>
        <div className="relative mt-2 h-2 w-full rounded-pill bg-disabled">
          <div
            className="h-full rounded-pill bg-primary transition-[width] duration-700 ease-out"
            style={{ width: gaugeInView ? `${mockGroup.successRate}%` : '0%' }}
          />
          <div
            className="absolute -top-1 h-4 w-0.5 bg-reward"
            style={{ left: `${mockGroup.goalRate}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between">
          <span className="text-caption text-muted">
            {mockGroup.verifiedToday}/{mockGroup.totalMembers}명 완료
          </span>
          <span className="text-caption text-reward">그룹 목표 {mockGroup.goalRate}%</span>
        </div>
      </section>

      {/* 남은 기간 / 내 순위 */}
      <section className="grid grid-cols-2 divide-x divide-line rounded-item border border-line bg-surface py-4">
        <div className="text-center">
          <p className="text-label text-ink">남은 기간</p>
          <p className="mt-1 text-score font-bold text-primary">D-{mockGroup.dday}</p>
        </div>
        <div className="text-center">
          <p className="text-label text-ink">내 순위</p>
          <p className="mt-1 text-score font-bold text-primary">{me?.rank}위</p>
        </div>
      </section>

      {/* 시상대 (우측 상단 물음표 → 평가 기준 팝업) */}
      <div className="relative">
        <CriteriaHelp />
        <Podium
          heights={{ 1: 266, 2: 206, 3: 139 }}
          items={top3.map((m) => ({
            rank: m.rank,
            name: m.name,
            reward: rewardFromScore(m.score),
          }))}
        />
      </div>

      {/* 복사 완료 토스트: 흰 타원 + 진초록 글자, 2초 후 사라짐 */}
      <div
        className={`fixed left-1/2 top-1/2 z-[60] -translate-x-1/2 -translate-y-1/2 rounded-pill bg-surface px-6 py-3 text-body font-semibold text-primary shadow-2xl ring-1 ring-line transition-opacity duration-300 ${
          copied ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {/* 토스트 위에 얹은 새싹 */}
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-2xl">🌱</span>
        복사 되었어요!
      </div>
    </div>
  );
}
