import RankingItem from '@/components/group/RankingItem.jsx';
import { mockGroupRanking } from '@/data/mockGroups.js';
import { rankMembers } from '@/utils/ranking.js';

// 내 그룹 > 랭킹 탭. 누적 운동 시간(분) 기준 순위.
// 요약 카드는 부모(MyGroupPage) 공통 영역에 있으므로 여기선 목록만.
export default function GroupRankingPage() {
  // 누적 운동 시간(minutes)을 정렬 기준으로 → rankMembers로 순위 부여
  const byMinutes = mockGroupRanking.map((m) => ({ ...m, score: m.minutes }));
  const ranked = rankMembers(byMinutes);

  return (
    <div className="p-5">
      <ul className="space-y-2.5">
        {ranked.map((member, i) => (
          <li
            key={member.id}
            className="animate-riseUp"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <RankingItem
              rank={member.rank}
              name={member.name}
              caption={`누적 운동 시간 ${member.score}분`}
              isMe={member.isMe}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
