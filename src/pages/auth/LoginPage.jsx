import { useNavigate } from "react-router-dom";

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
  },
  {
    label: "카카오 로그인",
    src: "/images/Kakao.svg",
    alt: "카카오 로그인",
  },
];

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#F7F6F3]"
      style={{ fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif" }}
    >
      <div
        className="relative overflow-hidden bg-[#F7F6F3]"
        style={{ width: "393px", height: "852px" }}
      >
        <div
          className="absolute text-[18px] font-bold leading-[41px] text-[#000000]"
          style={{ left: "42px", top: "9px" }}
        >
          12:41
        </div>

        <svg
          width="16"
          height="12"
          viewBox="0 0 16 12"
          aria-label="Wi-Fi"
          className="absolute"
          style={{ left: "308px", top: "21px" }}
        >
          <path
            d="M1 5.5C4.3 2.5 7.7 1.5 15 1.5"
            fill="none"
            stroke="#000000"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M4 8.2C6.2 6.3 9.8 6.3 12 8.2"
            fill="none"
            stroke="#000000"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="8" cy="10.2" r="1.1" fill="#000000" />
        </svg>

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
          className="absolute border border-[#E7E3D8] bg-[#FFFFFF] text-[15px] font-medium leading-[35px] text-[#000000] outline-none placeholder:text-[#000000]"
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
          className="absolute border border-[#E7E3D8] bg-[#FFFFFF] text-[15px] font-medium leading-[35px] text-[#000000] outline-none placeholder:text-[#000000]"
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
          className="absolute bg-[#000000] text-[18px] font-bold leading-[35px] text-[#FFFFFF]"
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
            회원 가입하기
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
            >
              <img src={provider.src} alt={provider.alt} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
