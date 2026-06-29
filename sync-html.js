const fs = require('fs');
const path = require('path');

const skinHtmlPath = path.join(__dirname, 'skin.html');
const previewHtmlPath = path.join(__dirname, 'preview.html');

if (!fs.existsSync(skinHtmlPath)) {
  console.error('skin.html not found!');
  process.exit(1);
}

let skinContent = fs.readFileSync(skinHtmlPath, 'utf8');

// 1. Mock Data for Categories
const mockCategory = `
<ul class="tt_category">
  <li><a href="#none" class="link_tit">전체 보기 <span class="c_cnt">(120)</span></a>
    <ul class="category_list">
      <li><a href="#none" class="link_item">Architecture <span class="c_cnt">(24)</span></a>
        <ul class="sub_category_list">
          <li><a href="#none" class="link_sub_item">System Design <span class="c_cnt">(10)</span></a></li>
          <li><a href="#none" class="link_sub_item">Cloud Native <span class="c_cnt">(8)</span></a></li>
          <li><a href="#none" class="link_sub_item">Microservices <span class="c_cnt">(6)</span></a></li>
        </ul>
      </li>
      <li><a href="#none" class="link_item">Frontend <span class="c_cnt">(56)</span></a>
        <ul class="sub_category_list">
          <li><a href="#none" class="link_sub_item">React / Next.js <span class="c_cnt">(25)</span></a></li>
          <li><a href="#none" class="link_sub_item">Vue & Nuxt <span class="c_cnt">(11)</span></a></li>
          <li><a href="#none" class="link_sub_item">UI / UX Design <span class="c_cnt">(20)</span></a></li>
        </ul>
      </li>
      <li><a href="#none" class="link_item">AI & Data <span class="c_cnt">(15)</span></a>
        <ul class="sub_category_list">
          <li><a href="#none" class="link_sub_item">Deep Learning <span class="c_cnt">(10)</span></a></li>
          <li><a href="#none" class="link_sub_item">Data Pipeline <span class="c_cnt">(5)</span></a></li>
        </ul>
      </li>
      <li><a href="#none" class="link_item">Daily <span class="c_cnt">(25)</span></a></li>
    </ul>
  </li>
</ul>
`;

// 2. Extract and duplicate mock cards for Magazine Grid
const indexRepMatch = skinContent.match(/<s_index_article_rep>([\s\S]*?)<\/s_index_article_rep>/);
if (indexRepMatch) {
  const cardTemplate = indexRepMatch[1];
  let mockCardsHtml = '';
  
  const mockData = [
    { title: '프론트엔드 아키텍처의 본질적 고민과 설계 패턴', cat: 'Architecture', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80', desc: '비즈니스 로직과 UI를 완벽하게 분리하는 Clean Architecture를 프론트엔드에 적용하는 방법론에 대해 다룹니다. 컴포넌트 간 결합도를 낮추고 유지보수성을 극대화하는 패턴을 알아봅니다.' },
    { title: '디자인 시스템 구축과 컴포넌트 재사용성 극대화', cat: 'Frontend', img: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?auto=format&fit=crop&w=600&q=80', desc: '일관성 있는 UI/UX를 위한 디자인 시스템 구축 여정. Storybook과 Figma를 활용한 협업 파이프라인 만들기.' },
    { title: 'Web Vitals: LCP와 CLS를 개선하는 실전 팁', cat: 'Performance', img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80', desc: '초기 렌더링 속도를 1초 이하로 줄이기 위한 리소스 최적화, 이미지 Lazy Loading, 폰트 Preload 전략.' },
    { title: 'React 19 Server Components 심층 분석', cat: 'Frontend', img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80', desc: '새롭게 도입된 Server Components의 동작 원리와 기존 SSR과의 차이점, 그리고 현업 적용 시의 장단점을 분석합니다.' }
  ];

  mockData.forEach(data => {
    let card = cardTemplate
      .replace(/\[##_article_rep_title_##\]/g, data.title)
      .replace(/\[##_article_rep_category_##\]/g, data.cat)
      .replace(/\[##_article_rep_thumbnail_url_##\]/g, data.img)
      .replace(/\[##_article_rep_summary_##\]/g, data.desc)
      .replace(/\[##_article_rep_date_##\]/g, '2026. 06. 29')
      .replace(/\[##_article_rep_link_##\]/g, '#');
    // Remove s_article_rep_thumbnail wrapper tags to force show images
    card = card.replace(/<s_article_rep_thumbnail>/g, '').replace(/<\/s_article_rep_thumbnail>/g, '');
    mockCardsHtml += card;
  });

  skinContent = skinContent.replace(/<s_index_article_rep>[\s\S]*?<\/s_index_article_rep>/, mockCardsHtml);
}

// 3. Global Replacements
const replacements = {
  '[##_page_title_##]': 'Preview',
  '[##_title_##]': 'Hope Devlog',
  '[##_desc_##]': '지속 가능한 가치를 위한 프론트엔드 엔지니어링 기록입니다.',
  '[##_image_##]': 'https://avatars.githubusercontent.com/u/9919?v=4',
  '[##_blogger_##]': 'Hope',
  '[##_blog_url_##]': 'http://localhost:5500',
  '[##_rss_url_##]': '#',
  '[##_var_theme_mode_##]': 'system',
  '[##_var_hero_keywords_##]': 'Developer, Designer, Creator',
  '[##_var_theme_style_##]': 'cosmic',
  '[##_var_motion_level_##]': 'high',
  '[##_var_use_weather_##]': 'true',
  '[##_var_show_weather_badge_##]': 'true',
  '[##_var_auto_weather_theme_##]': 'true',
  '[##_var_weather_greeting_##]': 'true',
  '[##_var_blog_start_date_##]': '2024-01-01',
  '[##_body_id_##]': 'tt-body-index',
  '[##_category_list_##]': mockCategory,
  '[##_count_today_##]': '1,245',
  '[##_count_total_##]': '987,654',
  '[##_count_yesterday_##]': '1,150',
  '[##_list_conform_##]': '',
  '<s_article_rep>': '<div style="display: contents;">',
  '</s_article_rep>': '</div>',
  '<s_permalink_article_rep>': '<div style="display:none;">',
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

// 4. Sidebar Mocking
skinContent = skinContent.replace(/<s_rctps_rep>([\s\S]*?)<\/s_rctps_rep>/g, function(match, p1) {
  return p1.replace(/\[##_rctps_rep_link_##\]/g, '#')
           .replace(/\[##_rctps_rep_thumbnail_##\]/g, 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100')
           .replace(/\[##_rctps_rep_title_##\]/g, '프론트엔드 아키텍처의 본질적 고민')
           .replace(/\[##_rctps_rep_date_##\]/g, '06. 29')
           + p1.replace(/\[##_rctps_rep_link_##\]/g, '#')
           .replace(/\[##_rctps_rep_thumbnail_##\]/g, 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=100')
           .replace(/\[##_rctps_rep_title_##\]/g, '디자인 시스템 구축기')
           .replace(/\[##_rctps_rep_date_##\]/g, '06. 28');
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

// Remove leftover sidebar tags
skinContent = skinContent.replace(/<s_sidebar>/g, '').replace(/<\/s_sidebar>/g, '');

// 5. Dev Server Scripts/CSS override
skinContent = skinContent.replace(/<script src="\.\/images\/script\.js"><\/script>/, '<script type="module" src="/src/js/main.js"></script>');
// 혹시 style.css도 빌드버전을 쓴다면 원본으로 교체 (Vite에서 CSS는 main.js에서 import될 수 있음)
skinContent = skinContent.replace(/<link rel="stylesheet" href="\.\/style\.css">/, '<link rel="stylesheet" href="/src/css/style.css">');

fs.writeFileSync(previewHtmlPath, skinContent, 'utf8');
console.log('🔄 skin.html -> preview.html (Mock Data 포함) 동기화 완료!');
skinContent = skinContent.replace(/<s_sidebar_element>/g, '').replace(/<\/s_sidebar_element>/g, '');

// Fix asset paths for Vite dev server (point to src instead of root)
skinContent = skinContent.replace(/href="\.\/style\.css"/, 'href="/src/css/style.css"');

// Fix script path for Vite
skinContent = skinContent.replace(/<\/body>/, '  <script type="module" src="/src/js/main.js"></script>\n</body>');

fs.writeFileSync(previewHtmlPath, skinContent);
console.log('🔄 skin.html -> preview.html (Mock Data 포함) 동기화 완료!');