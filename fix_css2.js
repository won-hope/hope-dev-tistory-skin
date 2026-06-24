const fs = require('fs');
const cssPath = 'c:\\hope-dev-tistory-skin\\style.css';
let css = fs.readFileSync(cssPath, 'utf8');

css = css.replace('.sidebar-overlay.active', '.sidebar-overlay.show');
css = css.replace('.sidebar-drawer.active', '.sidebar-drawer.open');

fs.writeFileSync(cssPath, css, 'utf8');
console.log("Updated active classes to open/show in CSS.");
