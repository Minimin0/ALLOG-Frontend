import { useState } from "react";
import { useNavigate } from "react-router-dom";

const faqs = [
  {
    q: "하트는 어떻게 다시 얻나요?",
    a: "출석, AAC SNS 팔로우, 웰니스 콘텐츠 확인, 친구 초대, 제휴 QR, 캠페인 참여 등 하트 이벤트 화면에서 다양한 방법으로 다시 얻을 수 있어요.",
  },
  {
    q: "루틴 인증은 어떻게 검토되나요?",
    a: "AI가 관련성, 제출 시간, 중복 이미지, 이상 징후를 1차로 검토해요. 최종 진위 판정과 제재는 AI 단독이 아니라 신고와 운영 검토를 함께 거쳐요.",
  },
  {
    q: "완주하지 못하면 하트는 어떻게 되나요?",
    a: "개인 루틴 달성률 70% 이상이고 부정 인증 이력이 없어야 하트 1개가 반환돼요. 미완주 시 사용한 하트는 반환되지 않아요.",
  },
  {
    q: "친구끼리만 참여하는 방은 어떻게 만드나요?",
    a: "그룹 만들기 화면 하단의 '친구끼리 참여' 체크박스를 선택하면 비공개 방으로 생성되고, 생성 완료 후 초대링크로 친구를 초대할 수 있어요.",
  },
  {
    q: "부적절한 인증이나 콘텐츠는 어떻게 신고하나요?",
    a: "그룹 피드의 인증 게시물에서 신고 기능을 이용할 수 있어요. 신고된 내용은 운영 정책에 따라 검토 후 처리돼요.",
  },
];

function CustomerSupportPage() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex min-h-screen justify-center bg-[#f7f6f3]">
      <div className="flex min-h-screen w-full max-w-[402px] flex-col bg-[#f7f6f3]">
        <header className="flex items-center gap-3 px-5 py-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
            className="flex h-[43px] w-[43px] items-center justify-center rounded-full border border-[#e7e3d8] bg-[#fefefe]"
          >
            <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="none">
              <path
                d="M15 5l-7 7 7 7"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h1 className="text-[19px] font-bold text-black">고객센터</h1>
        </header>

        <main className="flex-1 space-y-5 px-5 pb-10">
          <div className="rounded-[20px] border border-[#e7e3d8] bg-[#fefefe] p-5">
            <p className="text-[13px] font-bold text-black">1:1 문의하기</p>
            <p className="mt-1 text-[11px] font-medium leading-relaxed text-[#6b7268]">
              평일 10:00 ~ 18:00 (주말·공휴일 휴무)
              <br />
              보통 영업일 기준 1~2일 이내 답변드려요.
            </p>
            <a
              href="mailto:support@allog.app"
              className="mt-3 flex h-[44px] w-full items-center justify-center rounded-[13px] bg-[#14453a] text-[13px] font-bold text-white"
            >
              support@allog.app 로 문의하기
            </a>
          </div>

          <div>
            <p className="mb-2 text-[13px] font-bold text-[#4a4a4a]">
              자주 묻는 질문
            </p>
            <div className="divide-y divide-[#e7e3d8] rounded-[20px] border border-[#e7e3d8] bg-[#fefefe]">
              {faqs.map((item, index) => {
                const open = openIndex === index;
                return (
                  <div key={item.q}>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(open ? -1 : index)}
                      className="flex w-full items-center gap-3 px-5 py-4 text-left"
                    >
                      <span className="flex-1 text-[13px] font-bold text-black">
                        {item.q}
                      </span>
                      <span
                        className="text-[12px] text-[#bababa] transition-transform"
                        style={open ? { transform: "rotate(180deg)" } : undefined}
                      >
                        ⌄
                      </span>
                    </button>
                    <div className={`accordion-content ${open ? "is-open" : ""}`}>
                      <div>
                        <p className="px-5 pb-4 text-[12px] font-medium leading-relaxed text-[#6b7268]">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CustomerSupportPage;
