const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, '../preview/index.html'), 'utf8');

// The main content area in index.html starts with <main class="content-wrapper" id="main-content">
// and ends with <!-- Footer Area -->
const mainStart = indexHtml.indexOf('<main class="content-wrapper" id="main-content">');
const footerStart = indexHtml.indexOf('<!-- Subscribe Area (V3) -->');

const prefix = indexHtml.substring(0, mainStart + '<main class="content-wrapper" id="main-content">\n'.length);
const suffix = indexHtml.substring(footerStart);

// 1. category.html
const categoryBody = `
        <!-- Category Archive Section (V3) -->
        <section class="archive-section" aria-labelledby="archive-heading">
          <div class="archive-header">
            <h1 class="archive-title" id="archive-heading">All Articles</h1>
            <p class="archive-desc">HOPEDEV의 모든 기술 기록을 주제별로 확인하세요.</p>
          </div>
          
          <div class="archive-filters">
            <button class="archive-chip active" data-filter="all">All (7)</button>
            <button class="archive-chip" data-filter="System Design">System Design (2)</button>
            <button class="archive-chip" data-filter="AI Agent">AI Agent (1)</button>
            <button class="archive-chip" data-filter="Backend & API">Backend & API (1)</button>
            <button class="archive-chip" data-filter="Data & Performance">Data & Performance (1)</button>
            <button class="archive-chip" data-filter="Troubleshooting">Troubleshooting (1)</button>
            <button class="archive-chip" data-filter="Project Log">Project Log (1)</button>
          </div>

          <div class="archive-list">
            <!-- Item 1 -->
            <a href="article.html" class="archive-item" data-cat="AI Agent">
              <div class="archive-item-meta">
                <span class="archive-item-cat">AI Agent</span>
                <time>2026.06.20</time>
              </div>
              <h2 class="archive-item-title">ReAct 패턴을 활용한 AI Agent 도구 사용 최적화</h2>
              <p class="archive-item-summary">LLM이 다수의 API 도구 중 최적의 도구를 선택하고 잘못된 피드백을 통해 자가수정하는 과정에서의 프롬프트 및 컨텍스트 제어 기술.</p>
            </a>
            
            <!-- Item 2 -->
            <a href="article.html" class="archive-item" data-cat="System Design">
              <div class="archive-item-meta">
                <span class="archive-item-cat">System Design</span>
                <time>2026.06.22</time>
              </div>
              <h2 class="archive-item-title">트래픽 증가를 고려한 인증 시스템 설계</h2>
              <p class="archive-item-summary">대용량 유저 유입에 대응하고 고가용성을 유지하기 위해 비대칭키 JWT 검증 방식과 Redis 캐싱을 결합한 하이브리드 세션 아키텍처.</p>
            </a>

            <!-- Item 3 -->
            <a href="article.html" class="archive-item" data-cat="Backend & API">
              <div class="archive-item-meta">
                <span class="archive-item-cat">Backend & API</span>
                <time>2026.06.18</time>
              </div>
              <h2 class="archive-item-title">Idempotency-Key 헤더를 통한 결제 API 멱등성 보장</h2>
              <p class="archive-item-summary">네트워크 단절로 인한 중복 결제 시도를 API 게이트웨이 레벨에서 처리하고, 분산 락을 활용해 멱등 처리를 보장하는 가이드.</p>
            </a>

            <!-- Item 4 -->
            <a href="article.html" class="archive-item" data-cat="Data & Performance">
              <div class="archive-item-meta">
                <span class="archive-item-cat">Data & Performance</span>
                <time>2026.06.15</time>
              </div>
              <h2 class="archive-item-title">PostgreSQL 인덱스 스캔 성능 최적화 및 모니터링</h2>
              <p class="archive-item-summary">테이블 풀스캔이 일어나는 쿼리를 EXPLAIN ANALYZE로 분석하고, 적합한 부분 인덱스(Partial Index)와 커버링 인덱스를 적용한 튜닝 기록.</p>
            </a>
          </div>
        </section>
`;

fs.writeFileSync(path.join(__dirname, '../preview/category.html'), prefix + categoryBody + suffix);

// 2. tags.html
const tagsBody = `
        <!-- Tag Cloud Section (V3) -->
        <section class="tag-cloud-section" aria-labelledby="tags-heading">
          <div class="archive-header">
            <h1 class="archive-title" id="tags-heading">Tags</h1>
            <p class="archive-desc">관심 있는 키워드로 기술 기록을 탐색하세요.</p>
          </div>
          
          <div class="tag-cloud">
            <a href="category.html" class="tag-item tag-5">SystemDesign</a>
            <a href="category.html" class="tag-item tag-4">Architecture</a>
            <a href="category.html" class="tag-item tag-3">AI</a>
            <a href="category.html" class="tag-item tag-3">Performance</a>
            <a href="category.html" class="tag-item tag-2">PostgreSQL</a>
            <a href="category.html" class="tag-item tag-2">Redis</a>
            <a href="category.html" class="tag-item tag-1">JWT</a>
            <a href="category.html" class="tag-item tag-1">Troubleshooting</a>
            <a href="category.html" class="tag-item tag-1">Idempotency</a>
            <a href="category.html" class="tag-item tag-1">Agent</a>
            <a href="category.html" class="tag-item tag-2">Tistory</a>
            <a href="category.html" class="tag-item tag-2">Event-Driven</a>
          </div>
        </section>
`;

fs.writeFileSync(path.join(__dirname, '../preview/tags.html'), prefix + tagsBody + suffix);

// 3. guestbook.html
const guestbookBody = `
        <!-- Guestbook Section (V3) -->
        <section class="guestbook-section" aria-labelledby="guestbook-heading">
          <div class="guestbook-header">
            <h1 class="guestbook-title" id="guestbook-heading">Guestbook</h1>
            <p class="guestbook-desc">자유롭게 발자취를 남겨주세요. 피드백, 질문, 네트워킹 모두 환영합니다.</p>
          </div>
          
          <div class="guestbook-form">
            <input type="text" class="gb-input" placeholder="이름 (Name)">
            <input type="password" class="gb-input" placeholder="비밀번호 (Password)">
            <textarea class="gb-textarea" placeholder="메시지를 남겨주세요..."></textarea>
            <button class="gb-submit toast-trigger" data-toast-msg="티스토리 방명록 기능으로 연결될 예정입니다.">남기기</button>
          </div>

          <div class="guestbook-list">
            <div class="gb-item">
              <div class="gb-meta">
                <span class="gb-author">Visiting Engineer</span>
                <time class="gb-time">2026.06.22 14:30</time>
              </div>
              <p class="gb-content">블로그 디자인이 너무 깔끔하네요! JWT 세션 설계 글 잘 읽고 갑니다.</p>
            </div>
            
            <div class="gb-item">
              <div class="gb-meta">
                <span class="gb-author">Frontend Dev</span>
                <time class="gb-time">2026.06.21 09:15</time>
              </div>
              <p class="gb-content">사이드바랑 메가 메뉴 인터랙션이 부드러워서 참고하고 싶습니다.</p>
            </div>
          </div>
        </section>
`;

fs.writeFileSync(path.join(__dirname, '../preview/guestbook.html'), prefix + guestbookBody + suffix);

console.log('Static pages created successfully.');
