import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/layout/BottomNav";

const records = [
  { label: "운동", count: "3회", icon: "/images/운동.svg" },
  { label: "수면", count: "5회", icon: "/images/수면.svg" },
  { label: "식사", count: "4회", icon: "/images/식사.svg" },
  { label: "셀프케어", count: "1회", icon: "/images/셀프케어.svg" },
];

const menuItems = [
  { label: "알림 설정", icon: "/images/알림.svg", path: "/my/notifications" },
  { label: "개인정보 보호", icon: "/images/개인정보.svg", path: "/my/privacy" },
  { label: "이용약관", icon: "/images/이용약관.svg", path: "/my/terms" },
  { label: "고객센터", icon: "/images/고객센터.svg", path: "/my/support" },
];

function MyPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen justify-center bg-[#f7f6f3]">
      <div className="flex min-h-screen w-[402px] flex-col bg-[#f7f6f3]">
        <header className="px-[30px] pt-4">
          <h1 className="text-[28px] font-bold text-black">마이 페이지</h1>
        </header>

        <main className="flex-1 space-y-5 px-[30px] pb-8 pt-4">
          <div className="rounded-[26px] border border-[#e7e3d8] bg-[#fefefe] p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full bg-black text-[20px] font-bold text-white">
                A
              </div>
              <div className="flex-1">
                <p className="text-[18px] font-bold text-black">민지</p>
                <p className="mt-0.5 text-[12px] font-medium text-[#6b7268]">
                  minzi@gmail.com
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/my/edit-profile")}
                className="shrink-0 rounded-full bg-[#e5f4e8] px-4 py-2 text-[12px] font-bold text-black"
              >
                편집
              </button>
            </div>

            <div className="my-4 h-px bg-[#e7e3d8]" />

            <div className="grid grid-cols-3 text-center">
              <div>
                <p className="text-[10px] font-semibold text-[#d9573b]">하트</p>
                <p className="mt-1 flex items-center justify-center gap-1 text-[15px] font-bold text-black">
                  <img src="/images/하트.svg" alt="" className="h-[13px] w-[13px]" />
                  3
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#6b7268]">리워드</p>
                <p className="mt-1 flex items-center justify-center gap-1 text-[15px] font-bold text-black">
                  <img src="/images/리워드.svg" alt="" className="h-[13px] w-[13px]" />
                  1540
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#6b7268]">
                  성공한 루틴
                </p>
                <p className="mt-1 flex items-center justify-center gap-1 text-[15px] font-bold text-black">
                  <img src="/images/Check3.svg" alt="" className="h-[13px] w-[13px]" />
                  13회
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2.5 text-[13px] font-bold text-[#6b7268]">내 기록</p>
            <div className="grid grid-cols-4 gap-2 rounded-[26px] border border-[#e7e3d8] bg-[#fefefe] p-4">
              {records.map((record) => (
                <div key={record.label} className="flex flex-col items-center">
                  <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#f3efe4]">
                    <img src={record.icon} alt="" className="h-[24px] w-[24px]" />
                  </div>
                  <p className="mt-2 text-[11px] font-semibold text-black">
                    {record.label}
                  </p>
                  <p className="mt-0.5 text-[15px] font-bold text-[#14453a]">
                    {record.count}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[#e7e3d8] rounded-[20px] border border-[#e7e3d8] bg-[#fefefe]">
            {menuItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.path)}
                className="flex w-full items-center gap-3 px-5 py-4 text-left"
              >
                <img src={item.icon} alt="" className="h-[18px] w-[18px]" />
                <span className="flex-1 text-[13px] font-medium text-black">
                  {item.label}
                </span>
                <span className="text-[14px] text-[#bababa]">›</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="h-[50px] w-full rounded-[13px] border border-[#d9573b] bg-[#fefefe] text-[15px] font-bold text-[#d9573b]"
          >
            로그아웃
          </button>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}

export default MyPage;
