const fs = require('fs');

// Fix skin.html
const path = 'c:\\hope-dev-tistory-skin\\skin.html';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('<s_cover_group>', '<div class="home-only-widgets">');
content = content.replace('<!-- Bento Grid Recent Posts', '</div>\n\n      <!-- Bento Grid Recent Posts');
content = content.replace('</s_cover_group>', '');

const permalinkRegex = /(<s_permalink_article_rep>[\s\S]*?<\/s_permalink_article_rep>)/;
const permalinkMatch = content.match(permalinkRegex);
if (permalinkMatch) {
    const permalinkStr = permalinkMatch[0];
    const oldBlockRegex = /<s_article_rep>\s*<s_permalink_article_rep>[\s\S]*?<\/s_permalink_article_rep>\s*<\/s_article_rep>/;
    content = content.replace(oldBlockRegex, '');
    content = content.replace('</s_index_article_rep>', '</s_index_article_rep>\n\n            ' + permalinkStr);
}

fs.writeFileSync(path, content, 'utf8');
console.log('skin.html fixed');

// Fix preview.html
const previewPath = 'c:\\hope-dev-tistory-skin\\preview.html';
let previewContent = fs.readFileSync(previewPath, 'utf8');
previewContent = previewContent.replace('<s_cover_group>', '<div class="home-only-widgets">');
previewContent = previewContent.replace('<!-- Bento Grid Recent Posts', '</div>\n\n    <!-- Bento Grid Recent Posts');
previewContent = previewContent.replace('</s_cover_group>', '');
fs.writeFileSync(previewPath, previewContent, 'utf8');
console.log('preview.html fixed');
