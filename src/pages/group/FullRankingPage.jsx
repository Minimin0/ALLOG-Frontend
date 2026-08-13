import CoachMascotButton from '@/components/common/CoachMascotButton.jsx';
import Header from '@/components/layout/Header.jsx';
import RankingItem from '@/components/group/RankingItem.jsx';
import { mockFullRanking } from '@/data/mockGroups.js';
import { rankMembers } from '@/utils/ranking.js';

// 전체(방 간 통합) 랭킹 화면.
// RankingItem + rankMembers 재사용. 항목은 아래에서 위로 슬라이드(stagger) 등장.
export default function FullRankingPage() {
  const ranked = rankMembers(mockFullRanking);

  return (
    <div className="mx-auto min-h-full max-w-md bg-bg p-5">
      <Header title="전체 랭킹" right={<CoachMascotButton className="h-10 w-10" />} />

      <ul className="space-y-2.5">
        {ranked.map((member, i) => (
          <li
            key={member.id}
            className="animate-riseUp"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <RankingItem rank={member.rank} name={member.name} isMe={member.isMe} />
          </li>
        ))}
      </ul>
    </div>
  );
}
