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
  <h2 data-ke-size="size26">1. 아키텍처 패턴의 이해</h2>
  <p>프론트엔드 아키텍처는 단순히 폴더를 나누는 것이 아닙니다. 이번에 적용한 기능들을 보여주는 예제 코드를 확인해 보세요!</p>
  
  <h3 data-ke-size="size23">1.1. 새로운 기능 자랑용 코드 블록</h3>
  <p>아래 코드는 가상 파일명 탭, 매우 긴 코드(자동 접기), 복사 버튼, 하이라이팅을 모두 테스트할 수 있는 목업 데이터입니다.</p>
  
  <pre class="javascript" data-ke-language="javascript" data-ke-type="codeblock"><code>// file: src/features/MockDemo.js
import React, { useState, useEffect } from 'react';

/**
 * 이 코드는 15줄이 넘어가는 아주 긴 코드입니다.
 * 설정하신 코드 접기/펼치기 기능과 줄바꿈 토글 기능이
 * 얼마나 잘 작동하는지 눈으로 직접 확인하실 수 있습니다.
 * 
 * 그리고 이 주석 줄들을 마우스로 클릭해 보세요!
 * 클릭한 라인이 형광펜처럼 하이라이트 되는 것도 볼 수 있습니다.
 */
export default function MockDemo() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      // 아주아주아주아주아주아주아주아주아주아주아주아주아주아주아주아주아주아주아주아주아주아주아주아주아주 긴 주석입니다. 자동 줄바꿈 토글 버튼을 누르면 이 줄이 어떻게 변하는지 확인해 보세요!
      const response = await fetch('https://api.example.com/data');
      const result = await response.json();
      setData(result);
    }
    fetchData();
  }, []);

  return (
    &lt;div className="mock-demo"&gt;
      &lt;h1&gt;Hello World!&lt;/h1&gt;
      {data ? &lt;pre&gt;{JSON.stringify(data, null, 2)}&lt;/pre&gt; : &lt;p&gt;Loading...&lt;/p&gt;}
    &lt;/div&gt;
  );
}
</code></pre>
  
  <h2 data-ke-size="size26">2. 짧은 코드 블록 (접히지 않음)</h2>
  <pre class="css" data-ke-language="css" data-ke-type="codeblock"><code>/* file: style.css */
body {
  margin: 0;
  padding: 0;
  background-color: #0f0f15;
}
</code></pre>
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
  skinContent = skinContent.replace(/<script src="\.\/images\/script\.js"><\/script>/g, '');
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

