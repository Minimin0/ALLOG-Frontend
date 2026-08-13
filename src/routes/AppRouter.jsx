import { Navigate, Route, Routes } from 'react-router-dom';

import DevHomePage from '@/pages/DevHomePage.jsx';
import PlaceholderPage from '@/pages/_PlaceholderPage.jsx';

// 내 그룹 (인증·랭킹)
import MyGroupPage from '@/pages/group/MyGroupPage.jsx';
import GroupRankingPage from '@/pages/group/GroupRankingPage.jsx';
import RankingCriteriaPage from '@/pages/group/RankingCriteriaPage.jsx';
import FullRankingPage from '@/pages/group/FullRankingPage.jsx';
import GroupResultPage from '@/pages/group/GroupResultPage.jsx';
import GroupFeedPage from '@/pages/group/GroupFeedPage.jsx';
import GroupInfoPage from '@/pages/group/GroupInfoPage.jsx';

// 인증 촬영 플로우
import VerificationPage from '@/pages/verification/VerificationPage.jsx';
import CameraPage from '@/pages/verification/CameraPage.jsx';
import VerificationPreviewPage from '@/pages/verification/VerificationPreviewPage.jsx';
import VerificationLoadingPage from '@/pages/verification/VerificationLoadingPage.jsx';
import VerificationResultPage from '@/pages/verification/VerificationResultPage.jsx';

// 재인증 / 신고
import ReportPage from '@/pages/report/ReportPage.jsx';

// AI 코칭
import AiCoachPage from '@/pages/ai/AiCoachPage.jsx';

export default function AppRouter() {
  return (
    <Routes>
      {/* 개발용 홈 (실제 HomePage 생기면 교체) */}
      <Route path="/" element={<DevHomePage />} />

      {/* 내 그룹: 부모 레이아웃 아래 탭들을 중첩 */}
      <Route path="/group/:groupId" element={<MyGroupPage />}>
        <Route index element={<Navigate to="ranking" replace />} />
        <Route path="ranking" element={<GroupRankingPage />} />
        <Route path="feed" element={<GroupFeedPage />} />
        <Route path="info" element={<GroupInfoPage />} />
      </Route>

      {/* 순위 평가 기준 (탭 밖 전체화면) */}
      <Route path="/group/:groupId/ranking/criteria" element={<RankingCriteriaPage />} />

      {/* 전체 랭킹 */}
      <Route path="/ranking" element={<FullRankingPage />} />

      {/* 합산(챌린지 결과) */}
      <Route path="/group/:groupId/result" element={<GroupResultPage />} />

      {/* 인증 촬영 플로우 (전체화면, 탭 밖) */}
      <Route path="/group/:groupId/verify" element={<VerificationPage />} />
      <Route path="/group/:groupId/verify/camera" element={<CameraPage />} />
      <Route path="/group/:groupId/verify/preview" element={<VerificationPreviewPage />} />
      <Route path="/group/:groupId/verify/loading" element={<VerificationLoadingPage />} />
      <Route path="/group/:groupId/verify/result" element={<VerificationResultPage />} />

      {/* 재인증 / 신고 */}
      <Route path="/report" element={<ReportPage />} />

      {/* AI 코칭 */}
      <Route path="/ai" element={<AiCoachPage />} />

      {/* 404 */}
      <Route
        path="*"
        element={<PlaceholderPage title="페이지를 찾을 수 없어요" note="경로를 확인해주세요" />}
      />
    </Routes>
  );
}
