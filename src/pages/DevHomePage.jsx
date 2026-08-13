import { Link } from 'react-router-dom';

// 개발 편의용 임시 홈: 내가 맡은 화면들로 바로 이동해 확인하는 용도.
// 실제 서비스 홈(HomePage)이 생기면 라우터에서 이 화면을 교체하면 된다.
const SAMPLE_GROUP = 'g1'; // :groupId 자리에 넣어볼 샘플 값

const sections = [
  {
    title: '내 그룹 (인증·랭킹)',
    links: [
      { to: `/group/${SAMPLE_GROUP}`, label: '내 그룹 (랭킹 탭 기본)' },
      { to: `/group/${SAMPLE_GROUP}/ranking`, label: '그룹 랭킹' },
      { to: `/group/${SAMPLE_GROUP}/ranking/criteria`, label: '순위 평가 기준' },
      { to: '/ranking', label: '전체 랭킹' },
      { to: `/group/${SAMPLE_GROUP}/result`, label: '합산 (챌린지 결과)' },
    ],
  },
  {
    title: '인증 촬영 플로우',
    links: [
      { to: `/group/${SAMPLE_GROUP}/verify`, label: '① 인증 시작' },
      { to: `/group/${SAMPLE_GROUP}/verify/camera`, label: '② 카메라 촬영' },
      { to: `/group/${SAMPLE_GROUP}/verify/preview`, label: '③ 촬영 결과 확인' },
      { to: `/group/${SAMPLE_GROUP}/verify/loading`, label: '④ 동영상 분석중' },
      { to: `/group/${SAMPLE_GROUP}/verify/result`, label: '⑤ 결과(성공/재인증)' },
    ],
  },
  {
    title: '재인증 / 신고',
    links: [{ to: '/report', label: '재인증 요청 · 신고' }],
  },
];

export default function DevHomePage() {
  return (
    <div className="mx-auto max-w-md p-5">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-ink">ALLOG · 개발 네비</h1>
        <p className="mt-1 text-sm text-muted">
          내가 맡은 화면 라우팅 확인용. 클릭해서 각 화면으로 이동됨.
        </p>
      </header>

      <div className="space-y-6">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-2 text-sm font-semibold text-muted">{section.title}</h2>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="block rounded-card bg-surface px-4 py-3 text-sm font-medium text-ink shadow-sm ring-1 ring-line active:scale-[0.99]"
                  >
                    {link.label}
                    <span className="ml-2 text-xs text-muted">{link.to}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
