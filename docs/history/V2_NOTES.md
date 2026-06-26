# HOPEDEV Theme V2 Notes

## 티스토리 실제 적용 시 연결 예정 데이터

- **총 방문자**: 티스토리 방문자 치환자 (`[##_count_total_##]`)
- **카테고리**: 티스토리 카테고리 목록 치환자 (`[##_category_list_##]`)
- **총 포스팅 수**: 추후 수동 설정 또는 카테고리 전체 수 기반 연결 검토
- **블로그 운영 기간**: 스킨 옵션으로 시작일 설정
- **Engineering Circle**: 스킨 옵션 또는 직접 입력 목록

## 사용자가 바꿔야 할 설정 위치

`assets/js/app.js` 파일 내의 `/* V2 Features Implementation */` 아래에 위치한 다음 변수들을 수정해야 합니다:

1. `blogDashboardConfig`: 방문자 수, 포스팅 수, 시작일, Engineering Circle 개수
2. `categoryStats`: 각 카테고리의 통계, 설명, 아이콘
3. `engineeringCircle`: 함께 읽는 개발 블로그의 이름, 설명, 링크, 이니셜
4. `blogStartDate`: `blogDashboardConfig.blogStartDate` (YYYY-MM-DD 형식)
