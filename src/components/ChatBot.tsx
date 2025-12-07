import React, { useEffect, useRef, useState } from "react";
import OpenAI from "openai";
import { ChevronLeft } from "lucide-react";

// ================== OpenAI 설정 ==================
const client = new OpenAI({
  apiKey: "여기에_네_API키_그대로_붙여넣기", // <- 여기다가 키 넣으면 됨
  dangerouslyAllowBrowser: true, // 프론트에서 직접 호출할 때 필수
});

// extra_context.txt 대신 여기에 직접 텍스트를 넣어도 됨
const EXTRA_CONTEXT = ``;

const SYSTEM_PROMPT = `
너는 한국어로 대답하는 '자동차 정비 도우미' 챗봇이다.

[역할]
- 사용자가 말하는 차량 정보(브랜드, 차종, 연식, 연료, 주행거리 등)와
  증상/수리 부위를 기반으로:
  1) 증상에 대한 가능한 원인
  2) 예상 정비 항목(부품명 + 작업 내용)
  3) 대략적인 수리비 범위(부품비/공임비 구분 가능하면 구분)
  4) 운행을 계속해도 되는지, 바로 정비소 방문이 필요한지
  를 설명해 준다.
- EXTRA_CONTEXT 에는 차종별 고질병, 공임, 부품 가격 등이 들어 있을 수 있으니,
  가능하면 그 정보를 최우선으로 참고해서 답변한다.
- 정확한 금액을 모를 때는
  "대략 ○○만~○○만 원 정도 예상됩니다." 처럼 범위로 답한다.

[답변 스타일]
- 항상 존댓말로 답한다.
- 핵심 정보는 번호 목록으로 정리한다.
  예시:
  1) 증상 해석
  2) 예상 정비 항목
  3) 예상 수리비
  4) 추가로 점검해보면 좋은 것
- 사용자의 설명이 애매하면, 먼저 2~4개 정도의 질문으로 정보를 더 받는다.
  (예: 차량 모델/연식, 주행거리, 주로 주행 환경, 경고등 유무 등)
- 실제 정비소의 최종 견적이 아니며, 참고용 예상 비용이라는 점을 짧게 안내한다.
- 안전과 직결되는 경우(브레이크, 조향계, 타이어, 엔진/미션 경고등 등)는
  반드시 "가급적 빨리 공업사나 센터 방문을 권장드립니다."라는 안내를 포함한다.

아래 텍스트는 RAG용 추가 참고 정보입니다.

===== 추가 참고 정보 시작 =====
${EXTRA_CONTEXT}
===== 추가 참고 정보 끝 =====
`;

type Sender = "user" | "bot";

interface Message {
  id: number;
  sender: Sender;
  text: string;
  isHtml?: boolean;
  showTime?: boolean;
  isTyping?: boolean;
}

interface ChatBotProps {
  onBack: () => void;
  onNavigate: (page: 'feed' | 'mypage' | 'chatbot' | 'createPost') => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ onBack, onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const nextIdRef = useRef(1);

  const nextId = () => nextIdRef.current++;

  const getCurrentTime = () => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  };

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  const addMessage = (msg: Omit<Message, "id">) => {
    setMessages((prev) => [...prev, { ...msg, id: nextId() }]);
  };

  const showTyping = () => {
    addMessage({ sender: "bot", text: "", isTyping: true });
  };

  const hideTyping = () => {
    setMessages((prev) => prev.filter((m) => !m.isTyping));
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    // 사용자 메시지 추가
    addMessage({
      sender: "user",
      text,
      showTime: true,
    });
    setInput("");
    setLoading(true);
    showTyping();

    try {
      const response = await client.responses.create({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: text },
        ],
      });

      // JS SDK에서도 output_text 지원됨
      const replyText =
        // @ts-ignore - 타입 정의 업데이트 전 대비
        (response as any).output_text ||
        JSON.stringify(response, null, 2);

      hideTyping();

      addMessage({
        sender: "bot",
        text: replyText,
        isHtml: false, // 모델 응답에 HTML 안 쓸 거면 false, 쓰면 true
        showTime: true,
      });
    } catch (err) {
      console.error(err);
      hideTyping();
      addMessage({
        sender: "bot",
        text: "⚠️ OpenAI API 호출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        showTime: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  // 초기 안내 메시지
  useEffect(() => {
    const initText =
      `안녕하세요! 저는 <strong>Car Repair AI</strong> 자동차 정비 도우미입니다 🔧🚗<br><br>` +
      `아래 정보를 최대한 알려주시면 더 정확하게 도와드릴 수 있어요.<br>` +
      `- 차량: 브랜드 / 차종 / 연식 / 연료<br>` +
      `- 주행거리: 대략 몇 km인지<br>` +
      `- 증상: 언제, 어떤 상황에서, 어디서 소리/진동/경고등이 뜨는지<br><br>` +
      `예시)<br>` +
      `• 2015년 LF쏘나타 2.0, 14만 km, 저속 방지턱 넘을 때 앞쪽에서 덜컹 소리 납니다.<br>` +
      `• 2012년 스파크, 시동 걸 때 하얀 연기가 조금 나고 냄새가 납니다.`;

    addMessage({
      sender: "bot",
      text: initText,
      isHtml: true,
      showTime: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col pb-20">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
              🚗
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>Car Repair AI</span>
                <span className="px-2 py-0.5 bg-white/30 rounded-full text-xs">정비 도우미</span>
              </div>
              <div className="text-xs opacity-90">증상만 말해주시면 예상 수리와 비용을 알려드려요</div>
            </div>
          </div>
          <button className="text-2xl p-2">⋮</button>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div 
        ref={chatRef}
        className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full mb-24"
      >
        {messages.map((msg) => {
          if (msg.isTyping) {
            return (
              <div className="flex mb-4 justify-start" key={msg.id}>
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm mr-2 flex-shrink-0">
                  🚗
                </div>
                <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-md">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            );
          }

          const isUser = msg.sender === "user";

          return (
            <div
              className={`flex mb-4 animate-fadeIn ${
                isUser ? "justify-end" : "justify-start"
              }`}
              key={msg.id}
            >
              {!isUser && (
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm mr-2 flex-shrink-0">
                  🚗
                </div>
              )}
              <div className={`max-w-[70%] ${isUser ? "order-1" : ""}`}>
                <div
                  className={`rounded-2xl px-4 py-3 shadow-md ${
                    isUser
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.isHtml ? (
                    <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                  ) : (
                    msg.text
                  )}
                </div>
                {msg.showTime && (
                  <div className={`text-xs text-gray-500 mt-1 px-1 ${isUser ? "text-right" : ""}`}>
                    {getCurrentTime()}
                  </div>
                )}
              </div>
              {isUser && (
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-sm ml-2 flex-shrink-0">
                  👤
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 입력 영역 */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-lg max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <button className="text-gray-400 hover:text-purple-600 transition-colors text-xl p-2">
              📎
            </button>
            <button className="text-gray-400 hover:text-purple-600 transition-colors text-xl p-2">
              😊
            </button>
          </div>
          <input
            type="text"
            placeholder="예: 2015년 LF쏘나타, 주행중 앞바퀴 쪽에서 덜거덕 소리나요"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-purple-600"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            전송
          </button>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-purple-100">
        <div className="max-w-2xl mx-auto flex items-center justify-around p-4">
          <button 
            onClick={onBack}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-purple-500 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xs">홈</span>
          </button>
          <button 
            onClick={onBack}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-purple-500 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
            <span className="text-xs">커뮤니티</span>
          </button>
          <button 
            onClick={() => onNavigate('createPost')}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-purple-500 transition-colors"
          >
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center -mt-6 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-xs text-gray-400">글쓰기</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-purple-500">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">차량 챗봇</span>
          </button>
          <button 
            onClick={() => onNavigate('mypage')}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-purple-500 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">마이페이지</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;