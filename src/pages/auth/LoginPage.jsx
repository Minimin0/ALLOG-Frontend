import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../../services/authApi";
import { useViewportScale } from "../../hooks/useViewportScale";

const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;

const socialButtons = [
  {
    label: "네이버 로그인",
    src: "/images/Naver.svg",
    alt: "네이버 로그인",
  },
  {
    label: "Apple 로그인",
    src: "/images/Apple.svg",
    alt: "Apple 로그인",
  },
  {
    label: "Google 로그인",
    src: "/images/Google.svg",
    alt: "Google 로그인",
    provider: "google",
  },
  {
    label: "카카오 로그인",
    src: "/images/Kakao.svg",
    alt: "카카오 로그인",
  },
];

function LoginPage() {
  const navigate = useNavigate();
  const [googleError, setGoogleError] = useState("");
  const scale = useViewportScale(DESIGN_WIDTH);

  const handleGoogleLogin = async () => {
    setGoogleError("");
    try {
      await signInWithGoogle();
      navigate("/auth/firebase-debug");
    } catch (error) {
      setGoogleError(error.message || "구글 로그인에 실패했어요.");
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#F7F6F3]"
      style={{ fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif" }}
    >
      <div
        style={{ width: DESIGN_WIDTH * scale, height: DESIGN_HEIGHT * scale }}
      >
      <div
        className="animate-fade-in relative overflow-hidden bg-[#F7F6F3]"
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <h1
          className="absolute text-center text-[40px] font-bold leading-[35px] tracking-[-0.04em] text-[#000000]"
          style={{
            left: "129px",
            top: "133px",
            width: "128px",
            height: "32px",
          }}
        >
          LOGIN
        </h1>

        <input
          type="text"
          placeholder="아이디"
          className="absolute border border-[#E7E3D8] bg-[#FFFFFF] text-[15px] font-medium leading-[35px] text-[#000000] outline-none placeholder:text-[#bababa]"
          style={{
            left: "49px",
            top: "201px",
            width: "296px",
            height: "50px",
            borderRadius: "30px",
            paddingLeft: "18px",
            paddingRight: "18px",
          }}
        />

        <input
          type="password"
          placeholder="비밀번호"
          className="absolute border border-[#E7E3D8] bg-[#FFFFFF] text-[15px] font-medium leading-[35px] text-[#000000] outline-none placeholder:text-[#bababa]"
          style={{
            left: "49px",
            top: "267px",
            width: "296px",
            height: "49px",
            borderRadius: "30px",
            paddingLeft: "18px",
            paddingRight: "18px",
          }}
        />

        <button
          type="button"
          className="absolute bg-[#14453a] text-[18px] font-bold leading-[35px] text-[#FFFFFF]"
          style={{
            left: "44px",
            top: "346px",
            width: "296px",
            height: "50px",
            borderRadius: "20px",
          }}
        >
          로그인
        </button>

        <button
          type="button"
          className="absolute text-[12.643px] font-medium leading-[29.5px] text-[#000000]"
          style={{ left: "128px", top: "401px" }}
        >
          아이디 찾기
        </button>

        <button
          type="button"
          className="absolute text-[12.643px] font-medium leading-[29.5px] text-[#000000]"
          style={{ left: "211px", top: "401px" }}
        >
          비밀번호 찾기
        </button>

        <div
          className="absolute flex items-center"
          style={{ left: "44px", top: "473px", fontSize: "13px" }}
        >
          <span className="font-medium leading-[35px] text-[#000000]">
            계정이 없다면?
          </span>
          <button
            type="button"
            onClick={() => navigate("/auth/signup-phone")}
            className="font-semibold leading-[35px] text-[#000000]"
            style={{ marginLeft: "6px" }}
          >
            회원가입하기
          </button>
        </div>

        <div
          className="absolute bg-[#D9D9D9]"
          style={{ left: "48px", top: "511px", width: "298px", height: "1px" }}
        />

        <div
          className="absolute text-[15.333px] font-semibold leading-[26.833px] text-[#000000]"
          style={{ left: "173px", top: "529px" }}
        >
          간편 로그인
        </div>

        <style>{`
          .login2-social-buttons {
            position: absolute;
            left: 112px;
            top: 568px;
            display: flex;
            align-items: center;
            gap: 19px;
            width: auto;
            height: 34px;
          }

          .login2-social-button {
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 34px;
            height: 34px;
            min-width: 34px;
            min-height: 34px;
            max-width: 34px;
            max-height: 34px;
            margin: 0;
            padding: 0;
            border: 0;
            background: transparent;
            border-radius: 0;
            overflow: visible;
            flex: 0 0 34px;
            transform: none;
          }

          .login2-social-button img {
            display: block;
            width: 34px;
            height: 34px;
            max-width: 34px;
            max-height: 34px;
            margin: 0;
            padding: 0;
            border: 0;
            object-fit: contain;
            flex: none;
          }
        `}</style>

        <div className="login2-social-buttons">
          {socialButtons.map((provider) => (
            <button
              key={provider.label}
              type="button"
              aria-label={provider.label}
              className="login2-social-button"
              onClick={provider.provider === "google" ? handleGoogleLogin : undefined}
            >
              <img src={provider.src} alt={provider.alt} />
            </button>
          ))}
        </div>

        {googleError ? (
          <div
            className="absolute text-center text-[12px] font-medium text-[#e75b5b]"
            style={{ left: "49px", top: "612px", width: "296px" }}
          >
            {googleError}
          </div>
        ) : null}
      </div>
      </div>
    </div>
  );
}

export default LoginPage;
