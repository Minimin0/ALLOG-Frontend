import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useViewportScale } from "../../hooks/useViewportScale";

const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;

function SignUpAccountPage() {
  const navigate = useNavigate();
  const scale = useViewportScale(DESIGN_WIDTH);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const passwordsMatch = formData.password === formData.passwordConfirm;
  const isValid =
    formData.username.trim() &&
    formData.password.trim() &&
    formData.passwordConfirm.trim() &&
    passwordsMatch;

  const handleNext = () => {
    if (!isValid) return;
    navigate("/onboarding/basic-info");
  };

  return (
    <div className="flex min-h-screen justify-center bg-[#f7f6f3]">
      <style>{`
        .signup2-screen {
          position: relative;
          width: 393px;
          height: 852px;
          overflow: hidden;
          background: #f7f6f3;
        }

        .signup2-title {
          position: absolute;
          left: 26px;
          top: 118px;
          width: 310px;
          height: 98px;
          margin: 0;
          font-size: 25px;
          line-height: 1.3;
          font-weight: 700;
          letter-spacing: normal;
          color: #000000;
        }

        .signup2-label {
          position: absolute;
          font-size: 15px;
          font-weight: 700;
          line-height: 35px;
          color: #4a4a4a;
          letter-spacing: -0.02em;
        }

        .signup2-username-label {
          left: 30px;
          top: 209px;
        }

        .signup2-password-label {
          left: 30px;
          top: 303px;
        }

        .signup2-input {
          position: absolute;
          left: 26px;
          width: 343px;
          height: 44px;
          border: 1px solid #e7e3d8;
          border-radius: 15px;
          background: #fefefe;
          color: #1a1a1a;
          font-size: 16px;
          padding: 0 16px;
          box-sizing: border-box;
          outline: none;
          font-family: Pretendard Variable, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
        }

        .signup2-username-input {
          top: 238px;
        }

        .signup2-password-input {
          top: 334px;
        }

        .signup2-password-confirm-wrap {
          position: absolute;
          left: 26px;
          top: 382px;
          width: 343px;
          height: 44px;
        }

        .signup2-password-confirm-input {
          width: 343px;
          height: 44px;
          border: 1px solid #e7e3d8;
          border-radius: 15px;
          background: #fefefe;
          color: #1a1a1a;
          font-size: 16px;
          padding: 0 16px;
          box-sizing: border-box;
          outline: none;
          font-family: Pretendard Variable, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
        }

        .signup2-password-confirm-check {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999999;
          font-size: 14px;
        }

        .signup2-complete {
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
          font-family: Pretendard Variable, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
        }

        .signup2-complete:disabled {
          background: #bababa;
          cursor: not-allowed;
        }

        .signup2-error {
          position: absolute;
          left: 26px;
          top: 429px;
          margin: 0;
          font-size: 11px;
          font-weight: 600;
          color: #d9573b;
        }

        .signup2-input::placeholder,
        .signup2-password-confirm-input::placeholder {
          color: #bababa;
          font-size: 14px;
          font-weight: 500;
        }
      `}</style>

      <div style={{ width: DESIGN_WIDTH * scale, height: DESIGN_HEIGHT * scale }}>
      <div
        className="signup2-screen"
        style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        <h1 className="signup2-title">
          아이디와 비밀번호를
          <br />
          입력해 주세요.
        </h1>

        <div className="signup2-label signup2-username-label">아이디</div>

        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="signup2-input signup2-username-input"
          placeholder="아이디 (4~13자리 이내)"
          aria-label="아이디"
        />

        <div className="signup2-label signup2-password-label">비밀번호</div>

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="signup2-input signup2-password-input"
          placeholder="비밀번호 (10~12자리 이내)"
          aria-label="비밀번호"
        />

        <div className="signup2-password-confirm-wrap">
          <input
            type="password"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            className="signup2-password-confirm-input"
            placeholder="비밀번호 확인"
            aria-label="비밀번호 확인"
          />
          <div className="signup2-password-confirm-check">
            {formData.passwordConfirm && passwordsMatch ? (
              <img
                src="/images/Check.svg"
                alt="확인 완료"
                style={{ width: "20px", height: "20px" }}
              />
            ) : null}
          </div>
        </div>

        {formData.passwordConfirm && !passwordsMatch ? (
          <p className="signup2-error">비밀번호가 일치하지 않아요.</p>
        ) : null}

        <button
          type="button"
          className="signup2-complete"
          onClick={handleNext}
          disabled={!isValid}
        >
          완료
        </button>
      </div>
      </div>
    </div>
  );
}

export default SignUpAccountPage;
