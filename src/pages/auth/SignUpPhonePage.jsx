import { useNavigate } from "react-router-dom";

function SignUpPhonePage() {
  const navigate = useNavigate();

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

        .signup1-statusbar {
          position: absolute;
          left: 0;
          top: 0;
          width: 393px;
          height: 52px;
        }

        .signup1-form {
          position: absolute;
          left: 0;
          top: 0;
          width: 393px;
          height: 852px;
        }

        .signup1-time {
          position: absolute;
          left: 22px;
          top: 15px;
          font-size: 15px;
          font-weight: 700;
          line-height: 22px;
          color: #000000;
        }

        .signup1-signal {
          position: absolute;
          right: 24px;
          top: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .signup1-bars {
          display: flex;
          align-items: end;
          gap: 3px;
        }

        .signup1-bars span {
          display: block;
          width: 4px;
          border-radius: 1px;
          background: #1d1d1d;
        }

        .signup1-bars span:nth-child(1) { height: 8px; }
        .signup1-bars span:nth-child(2) { height: 10px; }
        .signup1-bars span:nth-child(3) { height: 12px; }
        .signup1-bars span:nth-child(4) { height: 14px; }

        .signup1-battery {
          width: 19px;
          height: 19px;
          border: 2px solid #1d1d1d;
          border-left: 0;
          border-bottom: 0;
          transform: rotate(45deg);
          position: relative;
          margin-left: 4px;
        }

        .signup1-title {
          position: absolute;
          left: 26px;
          top: 118px;
          width: 310px;
          margin: 0;
          font-size: 25px;
          line-height: 35px;
          font-weight: 900;
          letter-spacing: -0.06em;
          color: #111111;
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
          left: 32px;
          top: 209px;
        }

        .signup1-phone-label {
          left: 24px;
          top: 296px;
        }

        .signup1-code-field {
          position: absolute;
          border: 1px solid #e7e3d8;
          border-radius: 15px;
          background: #fefefe;
          box-sizing: border-box;
        }

        .signup1-select {
          position: absolute;
          left: 21px;
          top: 241px;
          width: 148px;
          height: 44px;
          border: 1px solid #e7e3d8;
          border-radius: 15px;
          background: #fefefe;
          box-sizing: border-box;
          padding: 0 14px 0 12px;
          color: #9c9c9c;
          font-size: 13px;
          appearance: none;
          outline: none;
        }

        .signup1-select-arrow {
          position: absolute;
          left: 134px;
          top: 258px;
          width: 24px;
          height: 12px;
          color: #555555;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .signup1-phone-input {
          left: 21px;
          top: 329px;
          width: 343px;
          height: 44px;
          padding: 0 16px;
          color: #1a1a1a;
          font-size: 16px;
          border: 1px solid #e7e3d8;
          border-radius: 15px;
          background: #fefefe;
          outline: none;
          box-sizing: border-box;
        }

        .signup1-code-field {
          left: 21px;
          top: 382px;
          width: 233px;
          height: 44px;
          background: #fefefe;
        }

        .signup1-code-placeholder {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
          line-height: 35px;
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
          font-weight: 700;
          line-height: 35px;
          cursor: pointer;
        }
      `}</style>

      <div className="signup1-screen">
        <div className="signup1-statusbar">
          <div className="signup1-time">2:30</div>
          <div className="signup1-signal">
            <div className="signup1-bars" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="signup1-battery" aria-hidden="true" />
          </div>
        </div>

        <div className="signup1-form">
          <h1 className="signup1-title">
            본인확인을 위해
            <br />
            인증을 진행해주세요.
          </h1>

          <div className="signup1-label signup1-carrier-label">통신사</div>
          <select className="signup1-select" defaultValue="SKT">
            <option value="SKT">SKT</option>
            <option value="KT">KT</option>
            <option value="LG U+">LG U+</option>
          </select>
          <div className="signup1-select-arrow">⌄</div>

          <div className="signup1-label signup1-phone-label">전화번호</div>
          <input
            type="tel"
            className="signup1-phone-input"
            defaultValue="010-0000-0000"
            aria-label="전화번호"
          />

          <div className="signup1-code-field">
            <span className="signup1-code-placeholder">인증번호 6자리</span>
            <span className="signup1-timer">00:00</span>
          </div>

          <div className="signup1-agreement">
            <img src="/images/Check.svg" alt="" />
            <span>본인 인증 서비스 약관 전체동의</span>
          </div>

          <button
            type="button"
            className="signup1-next"
            onClick={() => navigate("/auth/signup-account")}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUpPhonePage;
