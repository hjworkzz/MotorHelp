from flask import Flask, request, jsonify, render_template_string
from openai import OpenAI
import os

app = Flask(__name__)

# ================== OpenAI 설정 ==================
# 1) 환경변수 사용: 미리 터미널에서
#    export OPENAI_API_KEY="여기에_네_API키"
# 2) 아니면 아래처럼 직접 문자열로 넣어도 됨 (보안상 비추천)
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", ""))  # 직접 넣으려면 "" 안에 키 입력

# extra_context.txt 를 RAG 참고용으로 쓰고 싶으면
# 여기에 차종/연식/고질병/수리비 정리한 텍스트를 넣어두면 됨
EXTRA_CONTEXT = ""
try:
    with open("extra_context.txt", "r", encoding="utf-8") as f:
        EXTRA_CONTEXT = f.read()
except FileNotFoundError:
    EXTRA_CONTEXT = ""

SYSTEM_PROMPT = f"""
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
{EXTRA_CONTEXT}
===== 추가 참고 정보 끝 =====
"""

# ========== FRONT HTML ==========

HTML = """
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Car Repair AI - 자동차 정비 도우미</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: linear-gradient(135deg, #e8eaf6 0%, #f3e5f5 100%);
            height: 100vh;
            overflow: hidden;
        }

        .app-container {
            max-width: 480px;
            margin: 0 auto;
            height: 100vh;
            background: #f5f7fa;
            display: flex;
            flex-direction: column;
            box-shadow: 0 0 40px rgba(0, 0, 0, 0.1);
        }

        /* 상단 헤더 */
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .back-btn {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
        }

        .bot-avatar {
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }

        .header-info {
            display: flex;
            flex-direction: column;
        }

        .app-name {
            font-weight: 600;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .ai-badge {
            background: rgba(255, 255, 255, 0.3);
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
        }

        .app-subtitle {
            font-size: 12px;
            opacity: 0.9;
            margin-top: 2px;
        }

        .menu-btn {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 4px;
        }

        /* 채팅 영역 */
        .chat-container {
            flex: 1;
            overflow-y: auto;
            padding: 20px 16px;
            background: #f5f7fa;
        }

        .message {
            margin-bottom: 16px;
            display: flex;
            animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .message.bot {
            justify-content: flex-start;
        }

        .message.user {
            justify-content: flex-end;
        }

        .message-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
        }

        .message.bot .message-avatar {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin-right: 8px;
        }

        .message.user .message-avatar {
            background: #424242;
            color: white;
            margin-left: 8px;
        }

        .message-content {
            max-width: 70%;
        }

        .message-bubble {
            padding: 12px 16px;
            border-radius: 18px;
            word-wrap: break-word;
            line-height: 1.5;
        }

        .message.bot .message-bubble {
            background: white;
            color: #333;
            border-bottom-left-radius: 4px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .message.user .message-bubble {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-bottom-right-radius: 4px;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .message-time {
            font-size: 11px;
            color: #999;
            margin-top: 4px;
            padding: 0 4px;
        }

        /* 입력 영역 */
        .input-container {
            background: white;
            padding: 12px 16px;
            border-top: 1px solid #e0e0e0;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
        }

        .input-actions {
            display: flex;
            gap: 8px;
        }

        .input-icon-btn {
            background: none;
            border: none;
            color: #999;
            font-size: 22px;
            cursor: pointer;
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
        }

        .input-icon-btn:hover {
            color: #667eea;
        }

        #userInput {
            flex: 1;
            border: none;
            outline: none;
            font-size: 15px;
            padding: 10px 12px;
            background: #f5f7fa;
            border-radius: 20px;
        }

        #userInput::placeholder {
            color: #aaa;
        }

        #sendBtn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            min-width: 60px;
        }

        #sendBtn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        #sendBtn:active {
            transform: translateY(0);
        }

        #sendBtn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        /* 로딩 애니메이션 */
        .typing-indicator {
            display: inline-flex;
            gap: 4px;
            padding: 12px 16px;
        }

        .typing-dot {
            width: 8px;
            height: 8px;
            background: #999;
            border-radius: 50%;
            animation: typing 1.4s infinite;
        }

        .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes typing {
            0%, 60%, 100% {
                transform: translateY(0);
                opacity: 0.7;
            }
            30% {
                transform: translateY(-10px);
                opacity: 1;
            }
        }

        /* 스크롤바 스타일 */
        .chat-container::-webkit-scrollbar {
            width: 6px;
        }

        .chat-container::-webkit-scrollbar-track {
            background: transparent;
        }

        .chat-container::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 3px;
        }

        .chat-container::-webkit-scrollbar-thumb:hover {
            background: #999;
        }

        /* 반응형 */
        @media (max-width: 480px) {
            .app-container {
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="app-container">
        <!-- 헤더 -->
        <div class="header">
            <div class="header-left">
                <button class="back-btn" onclick="history.back()">‹</button>
                <div class="bot-avatar">🚗</div>
                <div class="header-info">
                    <div class="app-name">
                        Car Repair AI <span class="ai-badge">정비 도우미</span>
                    </div>
                    <div class="app-subtitle">증상만 말해주시면 예상 수리와 비용을 알려드려요</div>
                </div>
            </div>
            <button class="menu-btn">⋮</button>
        </div>

        <!-- 채팅 영역 -->
        <div class="chat-container" id="chat">
            <!-- 초기 메시지는 JS에서 추가됩니다 -->
        </div>

        <!-- 입력 영역 -->
        <div class="input-container">
            <div class="input-actions">
                <button class="input-icon-btn" title="파일 첨부">📎</button>
                <button class="input-icon-btn" title="이모지">😊</button>
            </div>
            <input type="text" id="userInput" placeholder="예: 2015년 LF쏘나타, 주행중 앞바퀴 쪽에서 덜거덕 소리나요" />
            <button id="sendBtn">전송</button>
        </div>
    </div>

    <script>
        // 채팅 관련 요소
        const chatContainer = document.getElementById('chat');
        const userInput = document.getElementById('userInput');
        const sendBtn = document.getElementById('sendBtn');

        // 현재 시간 포맷팅
        function getCurrentTime() {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        }

        // 봇 메시지 추가
        function addBotMessage(text, includeTime = true) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message bot';
            
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.textContent = '🚗';
            
            const content = document.createElement('div');
            content.className = 'message-content';
            
            const bubble = document.createElement('div');
            bubble.className = 'message-bubble';
            bubble.innerHTML = text; // HTML 지원
            
            content.appendChild(bubble);
            
            if (includeTime) {
                const time = document.createElement('div');
                time.className = 'message-time';
                time.textContent = getCurrentTime();
                content.appendChild(time);
            }
            
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(content);
            chatContainer.appendChild(messageDiv);
            
            scrollToBottom();
        }

        // 사용자 메시지 추가
        function addUserMessage(text) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message user';
            
            const content = document.createElement('div');
            content.className = 'message-content';
            
            const bubble = document.createElement('div');
            bubble.className = 'message-bubble';
            bubble.textContent = text;
            
            const time = document.createElement('div');
            time.className = 'message-time';
            time.textContent = getCurrentTime();
            
            content.appendChild(bubble);
            content.appendChild(time);
            
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.textContent = '👤';
            
            messageDiv.appendChild(content);
            messageDiv.appendChild(avatar);
            chatContainer.appendChild(messageDiv);
            
            scrollToBottom();
        }

        // 로딩 표시 추가
        function showTypingIndicator() {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message bot';
            messageDiv.id = 'typing-indicator';
            
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.textContent = '🚗';
            
            const content = document.createElement('div');
            content.className = 'message-content';
            
            const bubble = document.createElement('div');
            bubble.className = 'message-bubble';
            
            const typing = document.createElement('div');
            typing.className = 'typing-indicator';
            typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
            
            bubble.appendChild(typing);
            content.appendChild(bubble);
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(content);
            chatContainer.appendChild(messageDiv);
            
            scrollToBottom();
        }

        // 로딩 표시 제거
        function hideTypingIndicator() {
            const indicator = document.getElementById('typing-indicator');
            if (indicator) {
                indicator.remove();
            }
        }

        // 하단으로 스크롤
        function scrollToBottom() {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        // 메시지 전송 (Flask API 호출)
        async function sendMessage() {
            const text = userInput.value.trim();
            if (!text) return;

            // 사용자 메시지 표시
            addUserMessage(text);
            userInput.value = '';
            sendBtn.disabled = true;

            // 로딩 표시
            showTypingIndicator();

            try {
                // Flask /ask 엔드포인트 호출
                const res = await fetch("/ask", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: text })
                });
                
                const data = await res.json();
                
                // 로딩 제거
                hideTypingIndicator();
                
                // 봇 응답 표시
                if (data.reply) {
                    addBotMessage(data.reply);
                } else {
                    addBotMessage("죄송합니다. 응답을 받을 수 없습니다.");
                }
            } catch (error) {
                hideTypingIndicator();
                addBotMessage("오류가 발생했습니다. 다시 시도해주세요.");
                console.error('Error:', error);
            } finally {
                sendBtn.disabled = false;
                userInput.focus();
            }
        }

        // 이벤트 리스너
        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // 초기 안내 메시지
        function showInitialMessage() {
            addBotMessage(
                `안녕하세요! 저는 <strong>Car Repair AI</strong> 자동차 정비 도우미입니다 🔧🚗<br><br>` +
                `아래 정보를 최대한 알려주시면 더 정확하게 도와드릴 수 있어요.<br>` +
                `- 차량: 브랜드 / 차종 / 연식 / 연료<br>` +
                `- 주행거리: 대략 몇 km인지<br>` +
                `- 증상: 언제, 어떤 상황에서, 어디서 소리/진동/경고등이 뜨는지<br><br>` +
                `예시)<br>` +
                `• 2015년 LF쏘나타 2.0, 14만 km, 저속 방지턱 넘을 때 앞쪽에서 덜컹 소리 납니다.<br>` +
                `• 2012년 스파크, 시동 걸 때 하얀 연기가 조금 나고 냄새가 납니다.`,
                false
            );
        }

        // 페이지 로드 시 초기화
        window.addEventListener('DOMContentLoaded', () => {
            showInitialMessage();
            userInput.focus();
        });
    </script>
</body>
</html>
"""

# ========== BACKEND ==========

@app.route("/")
def index():
    return render_template_string(HTML)

@app.route("/ask", methods=["POST"])
def ask():
    user_msg = (request.json or {}).get("message", "").strip()

    if not user_msg:
        return jsonify({"error": "질문이 비어 있습니다."}), 400

    try:
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_msg},
            ],
        )
        # SDK 최신 버전 기준
        reply_text = resp.choices[0].message.content
    except Exception as e:
        reply_text = f"⚠️ OpenAI API 호출 중 오류가 발생했습니다: {e}"

    return jsonify({"reply": reply_text})


# ========== RUN ==========
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
