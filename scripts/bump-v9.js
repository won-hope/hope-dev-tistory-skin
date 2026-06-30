const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');

function renameFile(oldPath, newPath) {
  const fullOldPath = path.join(rootDir, oldPath);
  const fullNewPath = path.join(rootDir, newPath);
  
  if (fs.existsSync(fullOldPath)) {
    fs.renameSync(fullOldPath, fullNewPath);
    console.log(`✅ 파일 이름 변경 완료: ${oldPath} -> ${newPath}`);
  } else if (fs.existsSync(fullNewPath)) {
    console.log(`ℹ️ 이미 변경되어 있습니다: ${newPath}`);
  } else {
    console.log(`⚠️ 파일을 찾을 수 없습니다: ${oldPath}`);
  }
}

function replaceInFile(filePath, searchValue, replaceValue) {
  const fullPath = path.join(rootDir, filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes(searchValue)) {
      content = content.replace(new RegExp(searchValue, 'g'), replaceValue);
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ 파일 내용 수정 완료: ${filePath} (${searchValue} -> ${replaceValue})`);
    }
  }
}

function prependToFile(filePath, newContent) {
  const fullPath = path.join(rootDir, filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes('V9.0.0')) {
      content = newContent + '\n\n' + content;
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ CHANGELOG.md 업데이트 완료`);
    }
  }
}

console.log('🚀 V9 버전업 및 파일명 변경 자동화 스크립트 시작...\n');

// 1. 파일 이름 변경 (v8 -> v9)
renameFile('src/css/_v8.css', 'src/css/_v9.css');
renameFile('src/js/v8.js', 'src/js/v9.js');

// 2. 내부 Import 파일 경로 수정
replaceInFile('src/css/style.css', '_v8.css', '_v9.css');
replaceInFile('src/js/main.js', 'v8.js', 'v9.js');

// 3. V9용 내부 주석 수정
replaceInFile('src/css/_v9.css', '\\[V8 Premium\\]', '[V9 Premium]');
replaceInFile('src/js/v9.js', '\\[V8 Premium\\]', '[V9 Premium]');

// 4. CHANGELOG.md 업데이트
const today = new Date().toISOString().split('T')[0];
const changelogEntry = `## [${today}] V9.0.0 "Perfect Code Reading Experience & Layout Fix"
- 포스팅 본문(post.html) 좌측 쏠림 현상(Grid 버그) 완벽 해결 및 중앙 정렬 구조 리팩토링
- 중복되는 우측 하단 플로팅 버튼(FAB) 전면 삭제로 가시성 확보
- 코드 블록(Code Block) 리딩 경험 전면 개편:
  - 파일명(Tab) 표시 기능 지원 (\`// file: 파일명\` 주석 파싱)
  - 매우 긴 소스코드(15줄 이상) 자동 접기/펼치기 기능 추가
  - 코드 가로 스크롤 / 자동 줄바꿈 토글 기능 추가
  - 원클릭 복사 기능 유지 및 형광펜 하이라이팅 추가
- 파일 버전업 정리 (\`v8.css\` -> \`v9.css\`)`;

prependToFile('CHANGELOG.md', changelogEntry);

// 5. Git 반영 및 Tag 생성
console.log('\n📦 Git 버전 히스토리 반영을 시작합니다...');
try {
  execSync('git add .', { stdio: 'inherit', cwd: rootDir });
  execSync('git commit -m "docs(release): Release V9.0.0 - Code Block UX & Layout Fix"', { stdio: 'inherit', cwd: rootDir });
  
  // V9.0 태그 생성
  execSync('git tag -a v9.0.0 -m "Release v9.0.0"', { stdio: 'inherit', cwd: rootDir });
  
  console.log('\n🎉 모든 작업이 성공적으로 완료되었습니다!');
  console.log('👉 변경사항을 깃허브에 올리시려면 아래 명령어를 터미널에 입력해주세요:');
  console.log('    git push origin main --tags');
} catch (error) {
  console.log('\n⚠️ Git 명령 실행 중 오류가 발생했습니다. 변경된 파일은 저장되었으니, 커밋과 태그는 직접 진행해주세요.');
  console.log('git add .');
  console.log('git commit -m "Release V9.0.0"');
  console.log('git tag -a v9.0.0 -m "Release v9.0.0"');
}
