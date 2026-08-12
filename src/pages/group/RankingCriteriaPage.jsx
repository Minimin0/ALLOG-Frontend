import Header from '@/components/layout/Header.jsx';
import { SCORE_WEIGHTS, calcScore } from '@/utils/score.js';

// 순위 평가 기준 화면: 점수가 어떻게 합산되는지 설명 (기획서 §13-2).
// 가중치는 score.js의 SCORE_WEIGHTS를 그대로 읽으므로 여기 하드코딩이 없다.
// 아래 예시는 실제 calcScore로 계산 → 화면과 로직이 항상 일치.
const SAMPLE = { personal: 0.86, group: 0.8, streak: 0.75, contribution: 0.6 };

export default function RankingCriteriaPage() {
  const example = calcScore(SAMPLE);

  return (
    <div className="mx-auto min-h-full max-w-md bg-bg p-5">
      <Header title="순위 평가 기준" />

      <p className="mb-5 text-body text-muted">
        순위는 아래 4가지 항목을 <span className="font-semibold text-ink">가중 합산(총 100점)</span>해서
        정해져요.
      </p>

      {/* 항목별 기준 */}
      <ul className="mb-6 space-y-3">
        {SCORE_WEIGHTS.map((item) => (
          <li key={item.key} className="rounded-card border border-line bg-surface p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-section font-semibold text-ink">{item.label}</span>
              <span className="rounded-pill bg-primary px-2.5 py-0.5 text-label text-white">
                {item.weight}점
              </span>
            </div>
            <p className="mb-2 text-caption text-muted">{item.desc}</p>
            {/* 비중 시각화: 막대 폭 = 가중치% */}
            <div className="h-1.5 w-full overflow-hidden rounded-pill bg-surface-alt">
              <div className="h-full rounded-pill bg-primary" style={{ width: `${item.weight}%` }} />
            </div>
          </li>
        ))}
      </ul>

      {/* 계산 예시 (calcScore 실제 결과) */}
      <section className="rounded-card border border-line bg-primary-tint p-4">
        <h2 className="mb-3 text-label text-ink">계산 예시</h2>
        <ul className="space-y-1.5">
          {example.parts.map((p) => (
            <li key={p.key} className="flex justify-between text-caption text-muted">
              <span>{p.label}</span>
              <span className="font-semibold text-ink">
                {p.earned} / {p.weight}점
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
          <span className="text-body font-semibold text-ink">내 점수</span>
          <span className="text-score font-bold text-primary">{example.total}점</span>
        </div>
      </section>
    </div>
  );
}
