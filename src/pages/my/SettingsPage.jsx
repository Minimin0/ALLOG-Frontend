import { useNavigate } from "react-router-dom";

function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen justify-center bg-[#f7f6f3]">
      <div className="flex min-h-screen w-full max-w-[402px] flex-col items-center justify-center gap-6 bg-[#f7f6f3] px-8 text-center">
        <h1 className="text-[19px] font-bold text-black">
          설정 화면
          <br />
          (준비 중이에요)
        </h1>
        <button
          type="button"
          onClick={() => navigate("/my")}
          className="w-full rounded-[27.5px] bg-[#14453a] py-4 text-[15px] font-bold text-white"
        >
          마이페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
