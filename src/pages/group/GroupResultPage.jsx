import { useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/common/Button.jsx';
import SparkleIcon from '@/components/common/SparkleIcon.jsx';
import CriteriaHelp from '@/components/group/CriteriaHelp.jsx';
import Podium from '@/components/group/Podium.jsx';
import Header from '@/components/layout/Header.jsx';
import { useInView } from '@/hooks/useInView.js';
import { mockGroup, mockGroupRanking } from '@/data/mockGroups.js';
import { rankMembers } from '@/utils/ranking.js';
import { calcScore, rewardFromScore } from '@/utils/score.js';

// 합산(챌린지 결과) 화면 — Figma 1:494.
export default function GroupResultPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [gaugeRef, gaugeInView] = useInView(); // 성공률 게이지 등장 감지

  const scored = mockGroupRanking.map((m) => ({ ...m, score: calcScore(m.breakdown).total }));
  const ranked = rankMembers(scored);
  const top3 = ranked.filter((m) => m.rank <= 3);
  const me = ranked.find((m) => m.isMe);

  return (
    <div className="mx-auto min-h-full max-w-md bg-bg p-5">
      <Header title="챌린지 결과" />

      {/* 요약 카드: 공동 성공률 + 목표 (제목/기간 가운데, 게이지 애니메이션) */}
      <section ref={gaugeRef} className="mb-5 rounded-card border border-line bg-primary-tint p-5">
        <h2 className="text-center text-h2 font-bold text-ink">{mockGroup.title}</h2>
        <p className="mt-1 text-center text-caption text-muted">
          {mockGroup.period} 참여자 {mockGroup.totalMembers}명
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-caption text-ink">우리 그룹 공동 성공률</span>
          <span className="text-h2 font-extrabold text-primary">{mockGroup.successRate}%</span>
        </div>

        {/* 진행바(왼→오 차오름) + 목표 마커 */}
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
        <p className="mt-1 text-right text-caption text-reward">그룹 목표 {mockGroup.goalRate}%</p>
      </section>

      {/* 시상대 (상위 3명) — 점수 표시 + 우측 상단 물음표 */}
      <div className="relative mb-2">
        <CriteriaHelp />
        <Podium
          showScore
          items={top3.map((m) => ({
            rank: m.rank,
            name: m.name,
            score: m.score,
            reward: rewardFromScore(m.score),
          }))}
        />
      </div>

      {/* 전체 랭킹 이동 (시상대 아래) */}
      <div className="mb-6 text-right">
        <button
          onClick={() => navigate('/ranking')}
          className="text-caption font-semibold text-muted"
        >
          전체 랭킹보기 &gt;
        </button>
      </div>

      {/* 내 결과 */}
      {me && (
        <section className="mb-6 grid grid-cols-3 divide-x divide-line rounded-item border border-line bg-surface py-4">
          <div className="text-center">
            <p className="text-label text-ink">내 순위</p>
            <p className="mt-1 text-score font-bold text-primary">{me.rank}위</p>
          </div>
          <div className="text-center">
            <p className="text-label text-ink">내 점수</p>
            <p className="mt-1 text-score font-bold text-primary">{me.score}점</p>
          </div>
          <div className="text-center">
            <p className="text-label text-ink">내 보상</p>
            <p className="mt-1 flex items-center justify-center gap-1 text-score font-bold text-reward">
              <SparkleIcon className="h-4 w-4" />
              {rewardFromScore(me.score)}
            </p>
          </div>
        </section>
      )}

      {/* 액션 버튼 (더 크게 + 간격 넓게) */}
      <div className="flex flex-col gap-4">
        <Button size="lg" variant="dark" onClick={() => navigate('/reward')}>
          리워드 교환하러 가기
        </Button>
        <Button size="lg" variant="secondary" onClick={() => navigate('/explore')}>
          다음 챌린지 찾아보러가기
        </Button>
      </div>
    </div>
  );
}
