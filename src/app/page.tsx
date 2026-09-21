import type { Metadata } from "next";
import Script from "next/script";

// 과제 1(HW1)에서 만든 공개 소개 페이지의 CSS/마크업/스크립트를 그대로 이식했다.
// body { ... } 셀렉터만 .hw1-public-page로 바꿨다(전역 body를 건드리면 /login, /private 등
// 다른 페이지까지 이 페이지의 어두운 테마가 번져버리기 때문). 그 외 내용은 손대지 않았다.

export const metadata: Metadata = {
  title: "YU_JIWON // SECURE_ACCESS // PORTFOLIO",
};

const HW1_CSS = `
* { box-sizing: border-box; }
body { background-color: #050507; }
.hw1-public-page {
    background-color: #050507;
    color: #d1d5db;
    font-family: 'Consolas', 'Monaco', 'Pretendard', sans-serif;
    padding: 20px;
    min-height: 100vh;
    line-height: 1.8;
    letter-spacing: 0.3px;
    overflow-x: hidden;
}
.crt::before {
    content: " "; display: block; position: fixed;
    top: 0; left: 0; bottom: 0; right: 0;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
    z-index: 100; background-size: 100% 2px, 3px 100%; pointer-events: none;
}
.container {
    max-width: 1200px; margin: 0 auto; padding: 40px;
    border: 1px solid #1f2937; box-shadow: 0 0 40px rgba(59, 130, 246, 0.1);
    background: rgba(13, 13, 15, 0.9); border-radius: 8px; position: relative; z-index: 1;
}
h1, h2 { color: #ffffff; margin-top: 0; font-weight: 600; }
h1 { border-bottom: 2px solid #3b82f6; padding-bottom: 12px; margin-bottom: 30px; letter-spacing: 1px;}
h2 { font-size: 1.4rem; margin-bottom: 20px; color: #e5e7eb; }
.syntax-cmd { color: #3b82f6; font-weight: 600; }
.syntax-str { color: #e5e7eb; }
.syntax-var { color: #a78bfa; font-weight: 500; }
.status-public { color: #10b981; font-weight: 600; }
.header-info { margin-bottom: 35px; border-bottom: 1px dashed #1f2937; padding-bottom: 25px; }
.header-info p { margin: 6px 0; font-size: 1rem;}

.profile-container {
    margin-bottom: 35px; padding: 25px; background: rgba(59, 130, 246, 0.05);
    border: 1px solid #1f2937; border-left: 4px solid #3b82f6; border-radius: 6px;
    display: flex; flex-wrap: wrap; gap: 20px;
}
.profile-info { flex: 1.8; min-width: 450px; }
.profile-info p { margin: 10px 0; font-size: 1.05rem; display: flex; word-break: keep-all; }
.profile-info .syntax-cmd { width: 130px; flex-shrink: 0; }

.stat-box { flex: 1; min-width: 250px; padding-left: 20px; border-left: 1px dashed #374151; display: flex; flex-direction: column; justify-content: center; }
.stat-item { margin-bottom: 15px; }
.stat-label { font-size: 0.85rem; color: #9ca3af; margin-bottom: 5px; display: block; font-family: 'Consolas', monospace; }
.stat-bar-bg { width: 100%; height: 6px; background: #1f2937; border-radius: 3px; overflow: hidden; }
.stat-bar-fill { height: 100%; background: #3b82f6; width: 0; box-shadow: 0 0 10px #3b82f6; transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1); }

.decrypt-btn {
    background-color: transparent; color: #3b82f6; border: 2px solid #3b82f6;
    padding: 10px 20px; font-family: 'Pretendard', sans-serif; font-weight: 600; font-size: 0.9rem;
    cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center;
    white-space: nowrap; box-sizing: border-box; width: 460px; max-width: 100%; margin: 15px 0 12px 0; border-radius: 6px;
}
.decrypt-btn:hover, .decrypt-btn:focus { background-color: rgba(59, 130, 246, 0.15); color: #93c5fd; border-color: #93c5fd; outline: none; box-shadow: 0 0 25px rgba(59, 130, 246, 0.4); }

.logs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; margin-top: 20px; }
.log-entry {
    padding: 22px; border: 1px solid #1f2937; background: rgba(0,0,0,0.4);
    border-radius: 8px; position: relative; transition: all 0.3s ease; cursor: pointer;
}
.log-entry:hover { transform: translateY(-5px); border-color: #3b82f6; box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15); }
.log-entry:hover::after {
    content: '>> CLICK_TO_VIEW_DETAIL'; position: absolute; top: 15px; right: 20px;
    color: #10b981; font-size: 0.75rem; font-weight: bold; font-family: 'Consolas', monospace;
    animation: blink 1s step-end infinite;
}
.log-entry::before { content: '● ● ●'; position: absolute; top: 10px; left: 15px; color: #4b5563; font-size: 0.6rem; letter-spacing: 2px; }
.log-entry h3 { color: #60a5fa; margin-bottom: 12px; font-size: 1.15rem; margin-top: 15px; font-family: 'Consolas', monospace; }

.encrypted-text { opacity: 0.7; min-height: 95px; color: #6b7280; margin-bottom: 15px; font-family: 'Consolas', monospace; overflow: hidden; word-break: break-all; }
.decrypted-text { color: #e5e7eb; font-family: 'Pretendard', sans-serif; line-height: 1.8; word-break: normal; }
.truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; width: 100%; }
.report-link-container { border-top: 1px dashed #374151; padding-top: 15px; font-size: 0.95rem; }
.hw1-public-page a { color: #fbbf24; text-decoration: none; transition: color 0.2s; font-weight: 500;}
.hw1-public-page a:hover, .hw1-public-page a:focus { color: #f59e0b; outline: none; text-decoration: underline; }

.blinking-cursor { animation: blink 1s step-end infinite; color: #3b82f6; }
@keyframes blink { 50% { opacity: 0; } }
.typewriter { border-right: 2px solid #3b82f6; white-space: nowrap; overflow: hidden; margin: 0; }

.restricted-zone { margin-top: 0; }
.restricted-zone-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    white-space: nowrap; box-sizing: border-box; width: 460px; max-width: 100%;
    background-color: rgba(16, 185, 129, 0.14); color: #6ee7b7; border: 2px solid #34d399;
    padding: 10px 20px; font-family: 'Pretendard', sans-serif; font-weight: 700; font-size: 0.9rem;
    text-decoration: none; border-radius: 6px; transition: all 0.3s ease;
    animation: restricted-pulse 2s ease-in-out infinite;
}
.restricted-zone-btn:hover, .restricted-zone-btn:focus {
    background-color: rgba(16, 185, 129, 0.28); color: #a7f3d0; border-color: #6ee7b7;
    outline: none; box-shadow: 0 0 30px rgba(52, 211, 153, 0.6); transform: translateY(-2px);
    animation-play-state: paused;
}
@keyframes restricted-pulse {
    0%, 100% { box-shadow: 0 0 8px rgba(52, 211, 153, 0.15); }
    50% { box-shadow: 0 0 22px rgba(52, 211, 153, 0.55); }
}
.restricted-zone-note { display: block; margin-top: 10px; color: #6b7280; font-size: 0.85rem; }

@media (max-width: 768px) {
    .logs-grid { grid-template-columns: 1fr; }
    .profile-info { min-width: 100%; }
    .stat-box { border-left: none; border-top: 1px dashed #374151; padding-left: 0; padding-top: 20px; }
    .profile-info .syntax-cmd { width: 100px; }
}
`;

const HW1_BODY_HTML = `
<div class="container">
    <!-- [Card 1] 대상과 공개 범위 -->
    <div class="header-info">
        <h1><span class="syntax-cmd">></span> SECURE_ACCESS_PORTFOLIO</h1>
        <p>SYSTEM_MSG: <span class="syntax-str">이 페이지는 [SKT 보안 교육과정 평가자]에게 [나의 데이터 분석 및 AI 응용 잠재력]을 보여주기 위한 것이다.</span></p>
        <p><span class="status-public">[PERMITTED] 허가됨:</span> <span class="syntax-var">유지원 (gamedh823@gmail.com)</span>, <span class="syntax-str">프로젝트 성과, 기술 스택, 링크</span></p>
    </div>

    <h2><span id="whoAmITitle" class="syntax-cmd"></span><span class="blinking-cursor">_</span></h2>

    <div class="profile-container">
        <div class="profile-info">
            <p><span class="syntax-cmd">ID_NAME:</span> <span class="syntax-var">YU JIWON (유지원)</span></p>
            <p><span class="syntax-cmd">AGE_LEVEL:</span> <span class="syntax-str">24</span></p>
            <p><span class="syntax-cmd">CONTACT:</span> <span class="syntax-str">gamedh823@gmail.com</span></p>
            <p><span class="syntax-cmd">BASE_CAMP:</span> <span class="syntax-str">숭실대학교 전자정보공학부 IT융합전공</span></p>
            <p><span class="syntax-cmd">MAIN_CLASS:</span> <span class="syntax-str">데이터 파이프라인 구축 및 시스템 최적화 엔지니어</span></p>
        </div>

        <div class="stat-box">
            <div class="stat-item">
                <span class="stat-label">AI_MODELING_CAPACITY</span>
                <div class="stat-bar-bg"><div class="stat-bar-fill" id="stat1"></div></div>
            </div>
            <div class="stat-item">
                <span class="stat-label">SYSTEM_OPTIMIZATION</span>
                <div class="stat-bar-bg"><div class="stat-bar-fill" id="stat2"></div></div>
            </div>
            <div class="stat-item">
                <span class="stat-label">DATA_PIPELINE</span>
                <div class="stat-bar-bg"><div class="stat-bar-fill" id="stat3"></div></div>
            </div>
        </div>
    </div>

    <!-- [Card 5] 상호작용 버튼 -->
    <button class="decrypt-btn" tabindex="0" id="decryptBtn" aria-label="성과 데이터 암호 해제 실행">
        [+] RUN_DECRYPT_PROTOCOL.exe (Enter/클릭)
    </button>

    <div id="logContainer" style="display: none;">
        <h2><span class="syntax-cmd">></span> VERIFIED_EVIDENCE_LOGS</h2>
        <div class="logs-grid">
            <div class="log-entry" tabindex="0" onclick="location.href='/detail_01.html'" onkeydown="if(event.key==='Enter'||event.key===' ') location.href='/detail_01.html'">
                <h3>[LOG_01] DATA_SEARCH_ENGINE.log</h3>
                <p class="encrypted-text" data-original="<div class='truncate'>[언제/어디서] 데이터톤 대회</div><div class='truncate'>[무엇을] FAISS 벡터 검색 라이브러리를 응용하여 <span class='syntax-var'>의미론적 검색 엔진 모델</span> 기획 및 구축</div><div class='truncate'>[결과] AI 혁신 지수 리포트 산출 및 대회 <span class='status-public'>우수상 수상</span> 달성</div>">
                    @#$!%^&*()_+QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>?1234567890
                </p>
                <div class="report-link-container"><span class="syntax-cmd">└─></span> DESTINATION: <a href="#" target="_blank" tabindex="0" onclick="event.stopPropagation();">[GITHUB_REPORT_ACCESS - 데이터톤]</a></div>
            </div>

            <div class="log-entry" tabindex="0" onclick="location.href='/detail_02.html'" onkeydown="if(event.key==='Enter'||event.key===' ') location.href='/detail_02.html'">
                <h3>[LOG_02] HANIUM_DREAM_UP.log</h3>
                <p class="encrypted-text" data-original="<div class='truncate'>[언제/어디서] 한이음 드림업 프로젝트</div><div class='truncate'>[무엇을] <span class='syntax-var'>AI 모델 개발</span> 및 실무 응용 소프트웨어 연동</div><div class='truncate'>[결과] 완성도 높은 시스템 구현으로 <span class='status-public'>장려상 수상</span> 실적 달성</div>">
                    !@#$%^&*()_+QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>?1234567890
                </p>
                <div class="report-link-container"><span class="syntax-cmd">└─></span> DESTINATION: <a href="#" target="_blank" tabindex="0" onclick="event.stopPropagation();">[GITHUB_REPORT_ACCESS - 한이음드림업]</a></div>
            </div>

            <div class="log-entry" tabindex="0" onclick="location.href='/detail_03.html'" onkeydown="if(event.key==='Enter'||event.key===' ') location.href='/detail_03.html'">
                <h3>[LOG_03] OPERATING_SYSTEM.log</h3>
                <p class="encrypted-text" data-original="<div class='truncate'>[언제/어디서] 운영체제 프로젝트</div><div class='truncate'>[무엇을] 멀티스레드 기반 시뮬레이션 및 <span class='syntax-var'>PIM 구조 태스크 스케줄러</span> 구현</div><div class='truncate'>[결과] 대규모 임베딩 벡터 검색의 <span class='status-public'>병목 현상 완화</span> 및 동기화 안정성 확보</div>">
                    !@#$%^&*()_+QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>?1234567890
                </p>
                <div class="report-link-container"><span class="syntax-cmd">└─></span> DESTINATION: <a href="#" target="_blank" tabindex="0" onclick="event.stopPropagation();">[GITHUB_REPORT_ACCESS - 운영체제]</a></div>
            </div>

            <div class="log-entry" tabindex="0" onclick="location.href='/detail_04.html'" onkeydown="if(event.key==='Enter'||event.key===' ') location.href='/detail_04.html'">
                <h3>[LOG_04] COMPUTER_ARCHITECTURE.log</h3>
                <p class="encrypted-text" data-original="<div class='truncate'>[언제/어디서] 컴퓨터구조 프로젝트</div><div class='truncate'>[무엇을] 4-bit 하드웨어 아키텍처 및 논리 회로 설계</div><div class='truncate'>[결과] 설계 명세에 따른 <span class='status-public'>동작 검증 완료</span> 및 최종 결과보고서 산출</div>">
                    !@#$%^&*()_+QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>?1234567890
                </p>
                <div class="report-link-container"><span class="syntax-cmd">└─></span> DESTINATION: <a href="#" target="_blank" tabindex="0" onclick="event.stopPropagation();">[GITHUB_REPORT_ACCESS - 컴퓨터구조]</a></div>
            </div>

            <div class="log-entry" tabindex="0" onclick="location.href='/detail_05.html'" onkeydown="if(event.key==='Enter'||event.key===' ') location.href='/detail_05.html'">
                <h3>[LOG_05] AI_ANOMALY_DETECTION.log</h3>
                <p class="encrypted-text" data-original="<div class='truncate'>[언제/어디서] 인공신경망(ANN) 프로젝트</div><div class='truncate'>[무엇을] Autoencoder 및 Diffusion 모델을 활용한 이상 탐지 알고리즘 설계</div><div class='truncate'>[결과] 학습 데이터 재구성 <span class='status-public'>오차율 최소화</span> 및 성능 평가 완료</div>">
                    !@#$%^&*()_+QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>?1234567890
                </p>
                <div class="report-link-container"><span class="syntax-cmd">└─></span> DESTINATION: <a href="#" target="_blank" tabindex="0" onclick="event.stopPropagation();">[GITHUB_REPORT_ACCESS - ANN연구]</a></div>
            </div>

            <div class="log-entry" tabindex="0" onclick="location.href='/detail_06.html'" onkeydown="if(event.key==='Enter'||event.key===' ') location.href='/detail_06.html'">
                <h3>[LOG_06] MICROPROCESSOR.log</h3>
                <p class="encrypted-text" data-original="<div class='truncate'>[언제/어디서] 마이크로프로세서 프로젝트</div><div class='truncate'>[무엇을] 하드웨어 통신 설계 및 시스템 제어 응용 소프트웨어 개발</div><div class='truncate'>[결과] 성공적인 시스템 구동 검증 및 최종 <span class='status-public'>결과보고서 산출</span></div>">
                    !@#$%^&*()_+QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>?1234567890
                </p>
                <div class="report-link-container"><span class="syntax-cmd">└─></span> DESTINATION: <a href="#" target="_blank" tabindex="0" onclick="event.stopPropagation();">[GITHUB_REPORT_ACCESS - 마이크로프로세서]</a></div>
            </div>
        </div>
    </div>

    <!-- 과제 8에서 추가: 비밀번호 없이 패스키로만 열리는 비공개 영역으로 가는 문 -->
    <div class="restricted-zone">
        <a href="/login" class="restricted-zone-btn">🔒 RESTRICTED_ZONE — PASSKEY_ACCESS</a>
        <span class="restricted-zone-note">// 비밀번호 없음, 등록된 패스키로만 열림</span>
    </div>
</div>
`;

const HW1_SCRIPT = `
(function () {
    const titleElement = document.getElementById("whoAmITitle");
    const textToType = "> WHO_AM_I";
    let i = 0;
    function typeWriter() {
        if (i < textToType.length) {
            titleElement.innerHTML += textToType.charAt(i); i++;
            setTimeout(typeWriter, 100);
        }
    }
    if (titleElement && titleElement.innerHTML === "") {
      typeWriter();
    }

    setTimeout(() => {
        const s1 = document.getElementById('stat1');
        const s2 = document.getElementById('stat2');
        const s3 = document.getElementById('stat3');
        if (s1) s1.style.width = '85%';
        if (s2) s2.style.width = '90%';
        if (s3) s3.style.width = '80%';
    }, 500);

    if (sessionStorage.getItem('portfolioDecrypted') === 'true') {
        forceDecryptionState();
    }

    const decryptBtn = document.getElementById('decryptBtn');
    const logContainer = document.getElementById('logContainer');
    let isDecrypted = false;

    function forceDecryptionState() {
        isDecrypted = true;
        if (!decryptBtn || !logContainer) return;
        decryptBtn.innerText = "[✔] DECRYPTION_COMPLETE";
        decryptBtn.style.color = "#10b981";
        decryptBtn.style.borderColor = "#10b981";
        logContainer.style.display = "block";

        document.querySelectorAll('.encrypted-text').forEach(el => {
            el.innerHTML = el.getAttribute('data-original');
            el.classList.add('decrypted-text');
        });
    }

    function startDecryption() {
        if (isDecrypted || !decryptBtn || !logContainer) return;
        isDecrypted = true;

        decryptBtn.innerText = "[*] DECRYPTING... PROTOCOL_ACTIVE";
        decryptBtn.style.color = "#fbbf24";
        decryptBtn.style.borderColor = "#fbbf24";
        logContainer.style.display = "block";

        const elements = document.querySelectorAll('.encrypted-text');
        elements.forEach((el, index) => {
            const originalHTML = el.getAttribute('data-original');
            let iteration = 0;
            const maxIterations = 15 + (index * 8);

            const interval = setInterval(() => {
                let randomStr = '';
                for(let i=0; i<35; i++) randomStr += String.fromCharCode(33 + Math.floor(Math.random() * 50));
                el.innerText = randomStr;

                if(iteration >= maxIterations) {
                    clearInterval(interval);
                    el.innerHTML = originalHTML;
                    el.classList.add('decrypted-text');

                    if (index === elements.length - 1) {
                        decryptBtn.innerText = "[✔] DECRYPTION_COMPLETE";
                        decryptBtn.style.color = "#10b981";
                        decryptBtn.style.borderColor = "#10b981";
                        sessionStorage.setItem('portfolioDecrypted', 'true');
                    }
                }
                iteration++;
            }, 30);
        });
    }

    if (decryptBtn) {
        decryptBtn.addEventListener('click', startDecryption);
        decryptBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startDecryption(); }
        });
    }
})();
`;

export default function HomePage() {
  return (
    <>
      <link
        rel="stylesheet"
        crossOrigin="anonymous"
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
      />
      <style dangerouslySetInnerHTML={{ __html: HW1_CSS }} />
      <div
        className="crt hw1-public-page"
        dangerouslySetInnerHTML={{ __html: HW1_BODY_HTML }}
      />
      <Script
        id="hw1-portfolio-behavior"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: HW1_SCRIPT }}
      />
    </>
  );
}
