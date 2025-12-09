# Azure 배포 가이드

이 가이드는 Todo 백엔드 애플리케이션을 Azure에 배포하는 방법을 설명합니다.

## 필요한 Azure 리소스

1. **Azure Cosmos DB for MongoDB API** - 데이터베이스
2. **Azure App Service** - Node.js 애플리케이션 호스팅

---

## 1단계: Azure Cosmos DB for MongoDB 생성

### Azure Portal에서 생성

1. Azure Portal (https://portal.azure.com)에 로그인
2. "리소스 만들기" 클릭
3. "Azure Cosmos DB" 검색 및 선택
4. **API 선택: MongoDB API**
5. 다음 정보 입력:
   - **구독**: 본인의 Azure 구독
   - **리소스 그룹**: 기존 그룹 선택 또는 새로 만들기
   - **계정 이름**: 고유한 이름 (예: `todo-mb-cosmosdb`)
   - **위치**: Korea Central 또는 원하는 지역
   - **용량 모드**: 서버리스 (무료 티어 추천)
6. "검토 + 만들기" → "만들기" 클릭

### 연결 문자열 가져오기

1. 생성된 Cosmos DB 리소스로 이동
2. 왼쪽 메뉴에서 **"연결 문자열"** 클릭
3. **"기본 연결 문자열"** 복사

연결 문자열 형식:
```
mongodb://<계정이름>:<키>@<계정이름>.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@<계정이름>@
```

---

## 2단계: Azure App Service 생성

### Azure Portal에서 생성

1. Azure Portal에서 "리소스 만들기" 클릭
2. "웹앱" 검색 및 선택
3. 다음 정보 입력:
   - **구독**: 본인의 Azure 구독
   - **리소스 그룹**: Cosmos DB와 동일한 그룹 사용
   - **이름**: 고유한 이름 (예: `todo-mb-api`)
   - **게시**: 코드
   - **런타임 스택**: Node 18 LTS 또는 20 LTS
   - **운영 체제**: Windows 또는 Linux
   - **지역**: Korea Central
   - **요금제**: Free F1 또는 Basic B1
4. "검토 + 만들기" → "만들기" 클릭

---

## 3단계: 환경 변수 설정

1. 생성된 App Service로 이동
2. 왼쪽 메뉴에서 **"구성"** 클릭
3. **"새 애플리케이션 설정"** 클릭
4. 다음 환경 변수 추가:

| 이름 | 값 |
|------|-----|
| `MONGODB_URI` | Cosmos DB 연결 문자열 (1단계에서 복사한 것) |
| `NODE_ENV` | `production` |
| `PORT` | `8080` (App Service 기본값) |

5. "저장" 클릭

---

## 4단계: 코드 배포

### 방법 1: VS Code Azure Extension 사용 (추천)

1. VS Code에서 Azure 확장 설치
2. Azure에 로그인
3. 왼쪽 Azure 아이콘 클릭
4. App Service 목록에서 생성한 앱 찾기
5. 우클릭 → "Deploy to Web App" 선택
6. 프로젝트 폴더 선택

### 방법 2: Git을 사용한 배포

1. App Service에서 **"배포 센터"** 클릭
2. **"로컬 Git"** 선택
3. Git URL 복사
4. 로컬에서 Git 설정:

```bash
cd "c:\Users\byunn\OneDrive\Desktop\Todo MB"
git init
git add .
git commit -m "Initial commit"
git remote add azure <복사한-Git-URL>
git push azure master
```

### 방법 3: ZIP 배포

1. 프로젝트 폴더를 ZIP으로 압축 (node_modules 제외)
2. Azure CLI 사용:

```bash
az webapp deployment source config-zip --resource-group <리소스그룹명> --name <앱이름> --src <ZIP파일경로>
```

---

## 5단계: 배포 확인

1. App Service의 **"개요"** 페이지로 이동
2. **"URL"** 클릭 (예: `https://todo-mb-api.azurewebsites.net`)
3. 브라우저에서 "Todo App Server" 메시지 확인
4. API 테스트:
   - GET: `https://todo-mb-api.azurewebsites.net/api/todos`
   - POST: `https://todo-mb-api.azurewebsites.net/api/todos`

---

## 6단계: 프론트엔드 연결

프론트엔드 코드에서 API URL을 Azure App Service URL로 변경:

```javascript
// 기존
const API_URL = 'http://localhost:5000/api/todos';

// Azure로 변경
const API_URL = 'https://todo-mb-api.azurewebsites.net/api/todos';
```

---

## 문제 해결

### 배포 로그 확인
1. App Service → "로그 스트림" 메뉴
2. 실시간 로그 확인

### 애플리케이션 로그 활성화
1. App Service → "App Service 로그"
2. "애플리케이션 로깅" 켜기
3. "파일 시스템" 선택

### MongoDB 연결 실패
- Cosmos DB 연결 문자열이 올바른지 확인
- 환경 변수 `MONGODB_URI`가 올바르게 설정되었는지 확인
- Cosmos DB 방화벽 설정에서 "Azure 서비스의 액세스 허용" 활성화

---

## 비용 관리

- **Cosmos DB 서버리스**: 사용한 만큼만 과금
- **App Service Free F1**: 완전 무료 (제한적 리소스)
- **App Service Basic B1**: 월 약 $13 (더 많은 리소스)

무료 티어를 사용하면 비용 없이 테스트 가능합니다.

---

## 다음 단계

1. ✅ Cosmos DB 생성 및 연결 문자열 확보
2. ✅ App Service 생성
3. ✅ 환경 변수 설정
4. ✅ 코드 배포
5. ✅ 프론트엔드 연결
6. (선택) 커스텀 도메인 설정
7. (선택) SSL 인증서 설정 (무료 Let's Encrypt)

문제가 발생하면 Azure Portal의 "진단 및 문제 해결" 기능을 사용하세요.
