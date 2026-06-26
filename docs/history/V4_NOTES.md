# 🚀 V4 Release Notes: Apple + Picasso + Cubism Integration

V4는 단순한 클론 코딩을 넘어, 사용자의 엄격한 피드백을 수용하여 **독창적이고 완벽한 티스토리 네이티브 스킨**으로 진화한 메이저 업데이트입니다.

## 🎨 1. Apple 갬성 + Picasso 예술의 대통합 (Design System)
- **Glassmorphism 복구**: 상단 헤더 메뉴와 대시보드 통계 카드, 드롭다운 메뉴에 애플 특유의 강렬한 반투명 블러 효과(`backdrop-filter: blur(20px)`)를 적용했습니다.
- **Picasso 파스텔 큐비즘**: 밋밋한 배경 대신 은은한 핑크/블루/퍼플 색상의 추상 다각형(Polygons)이 겹쳐지며, 신비롭고 예술적인 테크 갤러리 감성을 완성했습니다.
- **역동적인 카드 애니메이션**: V3에서 극찬받았던 `Conic Gradient Spin` 테두리 빛번짐 애니메이션을 통계 카드에 완벽히 복구했습니다.

## 🐶 2. 돌아가는 닥스훈트 스피너 (Micro Interaction)
- 기존 레코드판 대신, 헤더 우측에 **파스텔 톤의 귀여운 닥스훈트 얼굴 로고**를 배치했습니다.
- 기본 10초 주기로 무한 회전하며, 마우스를 올리면 3초로 회전 속도가 빨라지는 재치있는 마이크로 인터랙션을 구현했습니다.

## 🌤️ 3. 실시간 서울 날씨 반응형 (Open-Meteo API)
- 위치 권한이 필요 없는 Open-Meteo API를 바닐라 자바스크립트로 직접 호출합니다.
- `sunny`, `cloudy`, `rainy`, `snowy` 4가지 상태에 맞춰 블로그 전체 배경색과 큐비즘 도형들의 색감이 동기화됩니다.
- 브라우저 `localStorage`에 30분 단위로 캐싱하여 API 호출 비용 및 페이지 로딩 속도를 최적화했습니다.

## ⚙️ 4. 완벽한 티스토리 네이티브 지원 (Tistory Compliance)
- 어설픈 가짜 데이터(`preview.html` 제외)를 모두 제거하고 오직 `<s_t3>`, `[##_count_total_##]`, `<s_article_rep>` 등 티스토리 공식 치환자만을 사용하여 코딩했습니다.
- **카테고리 드롭다운 자동 확장**: 티스토리 치환자 `[##_category_list_##]`의 한계를 극복하기 위해 CSS로 `min-width: max-content`와 `white-space: nowrap`을 줘서, 서브 카테고리 글자가 길어져도 메뉴 박스가 자동으로 늘어나도록 해결했습니다.
- `index.xml` 스킨 옵션 연동 완료 (히어로 문구 변경, 날씨 테마 온/오프 등).

---
### 🛠 파일 구조 (cubism-skin 디렉토리)
1. `index.xml` (스킨 정보 및 옵션)
2. `skin.html` (티스토리 치환자가 포함된 뼈대)
3. `style.css` (Apple+Picasso 스타일시트)123
4. `images/script.js` (날씨 API 및 각종 UI 로직)
5. `images/dachshund-loader.png` (강아지 버튼 이미지)
*(로컬 테스트용 `preview.html` 별도 존재)*
