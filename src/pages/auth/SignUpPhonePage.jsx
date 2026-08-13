import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUpPhonePage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f6f3]">
      <style>{`
        .signup1-screen {
          position: relative;
          width: 393px;
          height: 852px;
          overflow: hidden;
          background: #f7f6f3;
          margin: 0 auto;
        }

        .signup1-title {
          position: absolute;
          left: 26px;
          top: 118px;
          width: 310px;
          height: 98px;
          margin: 0;
          font-size: 25px;
          line-height: 35px;
          font-weight: 900;
          letter-spacing: -0.06em;
          color: #000000;
        }

        .signup1-label {
          position: absolute;
          font-size: 15px;
          font-weight: 700;
          line-height: 35px;
          color: #4a4a4a;
          letter-spacing: -0.02em;
        }

        .signup1-carrier-label {
          left: 30px;
          top: 209px;
        }

        .signup1-phone-label {
          left: 24px;
          top: 303px;
        }

        .signup1-carrier-select-wrap {
          position: absolute;
          left: 26px;
          top: 238px;
          width: 148px;
          height: 44px;
        }

        .signup1-carrier-select {
          width: 148px;
          height: 44px;
          border: 1px solid #e7e3d8;
          border-radius: 15px;
          background: #fefefe;
          color: #9c9c9c;
          font-size: 12px;
          font-weight: 500;
          padding: 0 26px 0 12px;
          appearance: none;
          box-sizing: border-box;
          outline: none;
        }

        .signup1-carrier-arrow {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #555555;
          font-size: 18px;
          line-height: 1;
          pointer-events: none;
        }

        .signup1-phone-input {
          position: absolute;
          left: 26px;
          top: 334px;
          width: 343px;
          height: 44px;
          border: 1px solid #e7e3d8;
          border-radius: 15px;
          background: #fefefe;
          color: #1a1a1a;
          font-size: 15px;
          font-weight: 600;
          padding: 0 16px;
          box-sizing: border-box;
          outline: none;
        }

        .signup1-phone-input::placeholder {
          color: #bababa;
          font-weight: 600;
        }

        .signup1-code-wrap {
          position: absolute;
          left: 26px;
          top: 382px;
          width: 233px;
          height: 44px;
        }

        .signup1-code-input {
          width: 100%;
          height: 100%;
          border: 1px solid #e7e3d8;
          border-radius: 15px;
          background: #fefefe;
          color: #1a1a1a;
          font-size: 12px;
          font-weight: 600;
          padding: 0 60px 0 16px;
          box-sizing: border-box;
          outline: none;
        }

        .signup1-code-input::placeholder {
          color: #bababa;
          font-weight: 600;
        }

        .signup1-timer {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
          line-height: 35px;
          color: #bababa;
          font-weight: 500;
          pointer-events: none;
        }

        .signup1-agreement {
          position: absolute;
          left: 28px;
          top: 429px;
          display: flex;
          align-items: center;
          gap: 6px;
          height: 26px;
          white-space: nowrap;
          border: 0;
          background: transparent;
          padding: 0;
          cursor: pointer;
        }

        .signup1-agreement img {
          width: 19px;
          height: 19px;
          display: block;
          object-fit: contain;
          flex: none;
        }

        .signup1-agreement span {
          display: block;
          font-size: 13px;
          font-weight: 500;
          line-height: 35px;
          color: #000000;
          letter-spacing: -0.02em;
        }

        .signup1-next {
          position: absolute;
          left: 31px;
          top: 776px;
          width: 338px;
          height: 50px;
          border: 0;
          border-radius: 20px;
          background: #000000;
          color: #f2f2f6;
          font-size: 18px;
          line-height: 35px;
          font-weight: 700;
          cursor: pointer;
        }

        .signup1-next:disabled {
          background: #bababa;
          cursor: not-allowed;
        }
      `}</style>

      <div className="signup1-screen">
        <h1 className="signup1-title">
          본인 확인을 위해
          <br />
          인증을 진행해 주세요.
        </h1>

        <div className="signup1-label signup1-carrier-label">통신사</div>

        <div className="signup1-carrier-select-wrap">
          <select className="signup1-carrier-select" defaultValue="SKT">
            <option value="SKT">SKT</option>
            <option value="KT">KT</option>
            <option value="LG U+">LG U+</option>
          </select>
          <div className="signup1-carrier-arrow">⌄</div>
        </div>

        <div className="signup1-label signup1-phone-label">전화번호</div>

        <input
          type="tel"
          className="signup1-phone-input"
          placeholder="010-0000-0000"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          aria-label="전화번호"
        />

        <div className="signup1-code-wrap">
          <input
            type="tel"
            maxLength={6}
            className="signup1-code-input"
            placeholder="인증번호 6자리"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            aria-label="인증번호"
          />
          <span className="signup1-timer">00:00</span>
        </div>

        <button
          type="button"
          className="signup1-agreement"
          onClick={() => setAgreed((prev) => !prev)}
          aria-pressed={agreed}
        >
          <img
            src="/images/Check.svg"
            alt=""
            style={agreed ? undefined : { filter: "grayscale(1) opacity(0.35)" }}
          />
          <span>본인 인증 서비스 약관 전체동의</span>
        </button>

        <button
          type="button"
          className="signup1-next"
          disabled={!agreed}
          onClick={() => navigate("/auth/signup-account")}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default SignUpPhonePage;
