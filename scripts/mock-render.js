const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const skinHtmlPath = path.join(rootDir, 'skin.html');

if (!fs.existsSync(skinHtmlPath)) {
  console.error('❌ skin.html not found!');
  process.exit(1);
}

const rawSkinContent = fs.readFileSync(skinHtmlPath, 'utf8');

// 1. Mock Data for Categories
const mockCategory = `
<ul class="tt_category">
  <li><a href="#none" class="link_tit">전체 보기 <span class="c_cnt">(120)</span></a>
    <ul class="category_list">
      <li><a href="#none" class="link_item">Architecture <span class="c_cnt">(24)</span></a>
        <ul class="sub_category_list">
          <li><a href="#none" class="link_sub_item">System Design <span class="c_cnt">(10)</span></a></li>
        </ul>
      </li>
      <li><a href="#none" class="link_item">Frontend <span class="c_cnt">(56)</span></a></li>
    </ul>
  </li>
</ul>
`;

// 2. Mock Data for Article View (post.html testing)
const mockArticleDesc = `
  <h2 data-ke-size="size26">1. V10 신규 기능 한눈에 보기</h2>
  <p>이번 V10 업데이트에 적용된 놀라운 기능들을 직접 체험해 보세요! 스크롤을 내리면서 우측의 목차(ScrollSpy)가 어떻게 반응하는지 먼저 확인해 보세요.</p>
  <p>우측 상단 목차(TOC)의 파란색 하이라이트가 현재 읽고 있는 섹션을 정확하게 추적할 것입니다. 또한 전체적인 레이아웃이 화면 크기에 맞게 부드럽게 조정되는 것도 볼 수 있습니다.</p>
  <br><br><br><br><br>
  
  <h2 data-ke-size="size26">2. 미디엄 스타일 라이트박스 줌 (Zoom)</h2>
  <p>아래 고화질 아키텍처 다이어그램 또는 풍경 이미지를 클릭해 보세요! 배경이 우아하게 어두워지면서 이미지가 화면 중앙으로 팝업됩니다.</p>
  <p>
    <img src="https://images.unsplash.com/photo-1550439062-609e1531270e?w=800&q=80" alt="Cyberpunk City" loading="lazy" decoding="async">
  </p>
  <p>클릭한 상태에서 마우스 휠을 굴리거나 아무 곳이나 다시 클릭하면 원상복구됩니다. 다크 모드와 라이트 모드에 따라 배경색(Overlay)도 자동으로 바뀝니다.</p>
  <br><br><br><br><br>

  <h2 data-ke-size="size26">3. 코드 출처 자동 주입 (Growth Hacking)</h2>
  <p>아래 제공된 긴 코드 블록 우측 상단의 <strong>[복사]</strong> 아이콘을 누르고, 사용하시는 메모장이나 에디터에 <code>Ctrl + V</code> 로 붙여넣어 보세요.</p>
  <p>코드 마지막에 이 블로그의 이름과 접속 주소가 자동으로 주석 처리되어 삽입된 것을 확인할 수 있습니다! 😎</p>
  
  <h3 data-ke-size="size23">3.1. 테스트용 긴 소스 코드</h3>
  <pre class="javascript" data-ke-language="javascript" data-ke-type="codeblock"><code>// file: src/features/AdvancedGrowthHacking.js
import { useState, useEffect } from 'react';

/**
 * 이 코드는 매우 깁니다! (코드 접기 테스트)
 * 1. 복사 버튼을 눌러 스니펫 출처 주입 기능을 확인하세요.
 * 2. 특정 줄을 클릭해서 하이라이팅 효과를 확인하세요.
 * 3. 코드 더 보기 / 접기 버튼으로 길이를 조절해 보세요.
 */
export default function AdvancedGrowthHacking() {
  const [metrics, setMetrics] = useState(null);
  
  useEffect(() => {
    async function fetchMetrics() {
      // 아주 긴 주석입니다. 자동 줄바꿈 토글 아이콘을 누르면 가로 스크롤 없이 코드를 편하게 읽을 수 있도록 동적으로 줄바꿈이 일어납니다! 이 기능은 모바일에서 특히 유용합니다.
      const response = await fetch('https://api.growth.com/v1/metrics');
      const result = await response.json();
      
      // 데이터 변환 로직
      const processed = result.data.map(item => ({
        ...item,
        score: item.views * 0.4 + item.clicks * 0.6
      }));
      
      setMetrics(processed);
    }
    fetchMetrics();
  }, []);

  return (
    &lt;div className="metrics-dashboard"&gt;
      &lt;h1&gt;Growth Dashboard&lt;/h1&gt;
      {metrics ? &lt;pre&gt;{JSON.stringify(metrics, null, 2)}&lt;/pre&gt; : &lt;p&gt;Loading...&lt;/p&gt;}
    &lt;/div&gt;
  );
}
</code></pre>
  
  <br><br><br><br><br>
  
  <h2 data-ke-size="size26">4. 아름다운 인용구 (Blockquote) 스타일</h2>
  <p>가장 중요한 멘트나 강조하고 싶은 문구는 인용구에 담아 보세요. V10의 인용구는 눈에 띄면서도 글의 흐름을 방해하지 않습니다.</p>
  <blockquote>
    훌륭한 디자인은 눈에 보이지 않지만, 형편없는 디자인은 눈에 띌 수밖에 없다.
    <br>- 훌륭한 UI/UX를 추구하며
  </blockquote>
  
  <br><br><br><br><br>
  <p>이곳이 포스팅의 끝입니다. 수고하셨습니다!</p>
`;

function renderSkin(mode, outputFileName) {
  let skinContent = rawSkinContent;
  let bodyId = 'tt-body-index';

  if (mode === 'post') bodyId = 'tt-body-page';
  else if (mode === 'category') bodyId = 'tt-body-category';

  // 1. Handle Index / Category Mode (Magazine Grid)
  if (mode === 'index' || mode === 'category') {
    const indexRepMatch = skinContent.match(/<s_index_article_rep>([\s\S]*?)<\/s_index_article_rep>/);
    if (indexRepMatch) {
      const cardTemplate = indexRepMatch[1];
      let mockCardsHtml = '';
      
      const mockData = [
        { title: '프론트엔드 아키텍처의 본질적 고민과 설계 패턴', cat: 'Architecture', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80', desc: '비즈니스 로직과 UI를 분리하는 방법론.' },
        { title: '디자인 시스템 구축기', cat: 'Frontend', img: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=600&q=80', desc: 'Storybook과 Figma.' }
      ];

      mockData.forEach(data => {
        let card = cardTemplate
          .replace(/\[##_article_rep_title_##\]/g, data.title)
          .replace(/\[##_article_rep_category_##\]/g, data.cat)
          .replace(/\[##_article_rep_thumbnail_url_##\]/g, data.img)
          .replace(/\[##_article_rep_summary_##\]/g, data.desc)
          .replace(/\[##_article_rep_date_##\]/g, '2026. 06. 29')
          .replace(/\[##_article_rep_link_##\]/g, '#');
        card = card.replace(/<s_article_rep_thumbnail>/g, '').replace(/<\/s_article_rep_thumbnail>/g, '');
        mockCardsHtml += card;
      });
      skinContent = skinContent.replace(/<s_index_article_rep>[\s\S]*?<\/s_index_article_rep>/, mockCardsHtml);
    }
    // Remove Permalink (Post Detail) so TOC doesn't generate on Index/Category
    skinContent = skinContent.replace(/<s_permalink_article_rep>[\s\S]*?<\/s_permalink_article_rep>/, '');
  } 
  // 2. Handle Post Mode (Article Detail)
  else {
    // Hide index page items when testing post view
    skinContent = skinContent.replace(/<s_index_article_rep>[\s\S]*?<\/s_index_article_rep>/, '');
  }

  const replacements = {
    '[##_page_title_##]': `로컬 테스트 뷰 (${mode})`,
    '[##_title_##]': 'Hope Devlog (Mock)',
    '[##_desc_##]': 'Vite 환경의 티스토리 목업 서버입니다.',
    '[##_image_##]': 'https://avatars.githubusercontent.com/u/9919?v=4',
    '[##_blogger_##]': 'Hope',
    '[##_blog_url_##]': 'http://localhost:5173',
    '[##_rss_url_##]': '#',
    '[##_var_theme_mode_##]': 'system',
    '[##_var_hero_keywords_##]': 'Developer, Designer, Creator',
    '[##_var_theme_style_##]': 'cosmic',
    '[##_var_motion_level_##]': 'high',
    '[##_var_use_weather_##]': 'true',
    '[##_var_show_weather_badge_##]': 'true',
    '[##_article_rep_rp_cnt_##]': '3',
    '[##_var_auto_weather_theme_##]': 'true',
    '[##_var_weather_greeting_##]': 'true',
    '[##_var_blog_start_date_##]': '2024-01-01',
    '[##_body_id_##]': bodyId,
    '[##_category_list_##]': mockCategory,
    '[##_count_today_##]': '1,245',
    '[##_count_total_##]': '987,654',
    '[##_count_yesterday_##]': '1,150',
    
    // Category list conform
    '[##_list_conform_##]': mode === 'category' ? 'Architecture 카테고리의 글' : '',
    
    // Article Rep ALWAYS visible, we just removed the inner parts based on mode
    '<s_article_rep>': '<div class="article-rep-wrapper mock-post" style="display: contents;">',
    '</s_article_rep>': '</div>',
    
    '[##_article_rep_title_##]': '프론트엔드 아키텍처의 본질적 고민과 설계 패턴',
    '[##_article_rep_category_##]': 'Architecture',
    '[##_article_rep_date_##]': '2026. 06. 29 17:00',
    '[##_article_rep_author_##]': 'Hope',
    '[##_article_rep_desc_##]': mockArticleDesc,
    
    '<s_permalink_article_rep>': '<div>',
    '</s_permalink_article_rep>': '</div>',
    '<s_page_rep>': '<div style="display:none;">',
    '</s_page_rep>': '</div>',
    '<s_notice_rep>': '<div style="display:none;">',
    '</s_notice_rep>': '</div>',
    '<s_tag>': '<div style="display:none;">',
    '</s_tag>': '</div>',
    '<s_guest>': '<div style="display:none;">',
    '</s_guest>': '</div>',
  };

  for (const [key, value] of Object.entries(replacements)) {
    skinContent = skinContent.split(key).join(value);
  }
  
  // List rep hide/show
  if (mode === 'category') {
    skinContent = skinContent.replace(/<s_list_rep>/g, '').replace(/<\/s_list_rep>/g, '');
  } else {
    skinContent = skinContent.replace(/<s_list_rep>[\s\S]*?<\/s_list_rep>/g, '');
  }

  // Sidebar Mocking
  skinContent = skinContent.replace(/<s_sidebar>/g, '').replace(/<\/s_sidebar>/g, '');
  skinContent = skinContent.replace(/<s_sidebar_element>/g, '').replace(/<\/s_sidebar_element>/g, '');
  skinContent = skinContent.replace(/<s_rctps_rep>([\s\S]*?)<\/s_rctps_rep>/g, function(match, p1) {
    return p1.replace(/\[##_rctps_rep_link_##\]/g, '#')
             .replace(/\[##_rctps_rep_thumbnail_##\]/g, 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100')
             .replace(/\[##_rctps_rep_title_##\]/g, '프론트엔드 아키텍처의 본질적 고민')
             .replace(/\[##_rctps_rep_date_##\]/g, '06. 29');
  });
  skinContent = skinContent.replace(/<s_rctps_popular_rep>([\s\S]*?)<\/s_rctps_popular_rep>/g, function(match, p1) {
    return p1.replace(/\[##_rctps_rep_link_##\]/g, '#')
             .replace(/\[##_rctps_rep_thumbnail_##\]/g, 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100')
             .replace(/\[##_rctps_rep_title_##\]/g, 'Web Vitals 개선 실전 팁')
             .replace(/\[##_rctps_rep_date_##\]/g, '06. 25');
  });
  skinContent = skinContent.replace(/<s_rctrp_rep>([\s\S]*?)<\/s_rctrp_rep>/g, function(match, p1) {
    return p1.replace(/\[##_rctrp_rep_link_##\]/g, '#')
             .replace(/\[##_rctrp_rep_desc_##\]/g, '좋은 글 감사합니다. 많은 도움이 되었습니다!')
             .replace(/\[##_rctrp_rep_name_##\]/g, '익명 사용자');
  });

  // Vite Dev Server Script Injections
  skinContent = skinContent.replace(/<script defer src="\.\/images\/script\.js"><\/script>/g, '');
  skinContent = skinContent.replace(/<\/body>/, '  <script type="module" src="/src/js/main.js"></script>\n</body>');
  skinContent = skinContent.replace(/<link rel="stylesheet" href="\.\/style\.css">/g, '<link rel="stylesheet" href="/src/css/style.css">');

  const outputPath = path.join(rootDir, outputFileName);
  fs.writeFileSync(outputPath, skinContent, 'utf8');
  console.log(`✅ skin.html -> ${outputFileName} (${mode} 모드) 렌더링 완료!`);
}

// Generate all three views dynamically
renderSkin('index', 'index.html');
renderSkin('post', 'post.html');
renderSkin('category', 'category.html');

