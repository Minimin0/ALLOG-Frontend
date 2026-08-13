import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  subscribeToAuthChanges,
  signOutUser,
  getCurrentIdToken,
} from "../../services/authApi";
import { fetchMe } from "../../services/userApi";

// 7B-2 Release Gate 검증용 임시 디버그 화면.
// Firebase 로그인 -> ID Token 발급 -> 백엔드 보호 API 호출까지의 흐름을 눈으로 확인하기 위한 용도입니다.
function FirebaseDebugPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [calling, setCalling] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const runCall = async (label, options) => {
    setCalling(true);
    setResult(null);
    const response = await fetchMe(options);
    setResult({ label, ...response });
    setCalling(false);
  };

  const handleNormalCall = () => runCall("정상 토큰", {});
  const handleNoTokenCall = () => runCall("토큰 없음", { skipAuth: true });
  const handleInvalidTokenCall = () =>
    runCall("잘못된 토큰", { overrideToken: "test-invalid-token" });

  const handleLogout = async () => {
    await signOutUser();
    setUser(null);
    setResult(null);
  };

  return (
    <div className="flex min-h-screen justify-center bg-[#f7f6f3]">
      <div className="w-[402px] px-6 py-8">
        <button
          type="button"
          onClick={() => navigate("/auth/login")}
          className="text-[13px] font-semibold text-[#6b7268]"
        >
          &lt; 로그인으로
        </button>

        <h1 className="mt-4 text-[20px] font-bold text-black">
          Firebase 인증 디버그 (7B-2)
        </h1>

        <div className="mt-5 space-y-2 rounded-[15px] border border-[#e7e3d8] bg-[#fefefe] p-4 text-[13px]">
          <p>
            <span className="font-semibold">Firebase Login: </span>
            {authLoading ? "확인 중..." : user ? "성공" : "미로그인"}
          </p>
          {user ? (
            <>
              <p className="break-all">
                <span className="font-semibold">firebaseUid: </span>
                {user.uid}
              </p>
              <p className="break-all">
                <span className="font-semibold">email: </span>
                {user.email}
              </p>
            </>
          ) : null}
        </div>

        {user ? (
          <div className="mt-5 space-y-2">
            <button
              type="button"
              disabled={calling}
              onClick={handleNormalCall}
              className="h-[42px] w-full rounded-[12px] bg-[#14453a] text-[13px] font-bold text-white disabled:opacity-40"
            >
              백엔드 API 호출 (정상 토큰) → GET /api/v1/users/me
            </button>
            <button
              type="button"
              disabled={calling}
              onClick={handleNoTokenCall}
              className="h-[42px] w-full rounded-[12px] border border-[#e7e3d8] bg-[#fefefe] text-[13px] font-bold text-black disabled:opacity-40"
            >
              토큰 없이 호출 (401 기대)
            </button>
            <button
              type="button"
              disabled={calling}
              onClick={handleInvalidTokenCall}
              className="h-[42px] w-full rounded-[12px] border border-[#e7e3d8] bg-[#fefefe] text-[13px] font-bold text-black disabled:opacity-40"
            >
              잘못된 토큰으로 호출 (401 기대)
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="h-[42px] w-full rounded-[12px] border border-[#d9573b] text-[13px] font-bold text-[#d9573b]"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <p className="mt-5 text-[13px] text-[#6b7268]">
            로그인 화면에서 구글 로그인을 먼저 진행해주세요.
          </p>
        )}

        {result ? (
          <div className="mt-5 rounded-[15px] border border-[#e7e3d8] bg-[#fefefe] p-4 text-[12px]">
            <p className="font-semibold">
              {result.label} → status {result.status}{" "}
              {result.ok ? "(성공)" : "(실패)"}
            </p>
            <pre className="mt-2 whitespace-pre-wrap break-all text-[#4a4a4a]">
              {result.error
                ? result.error
                : JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default FirebaseDebugPage;
