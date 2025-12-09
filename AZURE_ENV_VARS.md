# Azure App Service 환경 변수 설정

Azure Portal → App Service → 구성(Configuration) → 애플리케이션 설정에서 다음 변수들을 추가하세요:

## 필수 환경 변수

### 1. MONGODB_URI
```
mongodb://<계정이름>:<키>@<계정이름>.mongo.cosmos.azure.com:10255/<데이터베이스명>?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@<계정이름>@
```

**실제 값은 Azure Portal의 Cosmos DB → 연결 문자열에서 복사하세요.**

### 2. NODE_ENV
```
production
```

### 3. PORT (선택 사항)
```
8080
```
(주의: Azure App Service는 기본적으로 PORT 환경 변수를 자동으로 설정합니다)

---

## 설정 방법

1. Azure Portal에서 App Service 열기
2. 왼쪽 메뉴 → "구성" 클릭
3. "새 애플리케이션 설정" 클릭
4. 위의 각 변수를 이름/값으로 입력
5. "저장" 클릭
6. 앱이 자동으로 재시작됩니다

---

## 확인 방법

환경 변수가 올바르게 설정되었는지 확인:
1. App Service → SSH (또는 Kudu Console)
2. `printenv | grep MONGODB_URI` 실행
