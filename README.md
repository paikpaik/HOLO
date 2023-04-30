# 홀로(HOLO) : "1인 가구를 위한 식품 쇼핑몰 프로젝트"

## 프로젝트 주제

![no.11_그렇팀](/uploads/9b82a087b57e3c59ec480b8ca5665d66/no.11_그렇팀.jpg)

<br />

## 서비스 소개

#### 상품 등록, 장바구니 추가, 주문하기 등 쇼핑몰의 핵심 서비스를 구현합니다.

1. 회원가입, 로그인, 회원정보 수정 등 **유저 정보 관련 CRUD**
2. **상품 목록 조회** 및, **상품 상세 정보**를 조회 가능함.
3. 장바구니에 상품을 추가할 수 있으며, **장바구니에서 바로 결제** 작업이 가능함.
4. 장바구니는 서버 DB가 아닌, 프론트 단에서 저장 및 관리됨 (local Storage)
5. 장바구니에서 주문을 진행하며, **주문 완료 후 조회 및 삭제**가 가능함.
6. **nodemailer gmail**을 활용해 관리자의 회원 삭제, 주문 취소시 **이메일 발송기능** 구현.

<br />

## 데모 사이트 (로고를 클릭하면 사이트로 이동합니다)

[![holo_logo_1_](/uploads/1e66457403897161f2385da96d4d592a/holo_logo_1_.png)](http://kdt-sw-4-team11.elicecoding.com/)

### 1-1. API DOCS

-https://early-flock-0c8.notion.site/API-DOCS-7ecadf6217954b8ca45715e405dce988

## Tech Stack

![image](/uploads/377f651701a8b5c0501991051a581b01/image.png)

<br/>

## Infra

![image](/uploads/66b4e4a49c42a24c2f90af74581f6a08/image.png)

<br/>

## 👪 구성원 역할

<br />

| 이름 | 담당 업무 |
| :--: | :------: |
| ⭐️엄윤주⭐️ | BE (팀장) |
| ⭐️노재열⭐️ | BE |
| ⭐️임정훈⭐️ | BE |
| ⭐️최현준⭐️ | FE |
| ⭐️이하경⭐️ | FE |
| ⭐️김소현⭐️ | FE |

### 프론트엔드

- **Vanilla javascript**, html, css (**Bootstrap css**)
- Daum kakao 주소 api
- 최현준
  - 상품 목록, 상세 페이지, 장바구니
- 이하경
  - 메인 페이지, 로그인, 회원가입 페이지
- 김소현
  - 마이 페이지, 관리자 페이지

### 백엔드

- **Express** (nodemon으로 실행됩니다.)
- Mongodb, Mongoose
- cors
- 엄윤주
  - Oder 관련 스키마, 모델 설계 및 API 구현, CSS 작업
- 노재열
  - Product, Category 관련 스키마, 모델 설계 및 API 구현
- 임정훈
  - User, Admin 관련 스키마, 모델 설계 및 API 구현

### 폴더 구조

- 프론트: `views` 폴더 내 페이지별 폴더 구성
- 백: 3계층 폴더 구조 (model, service, router)
- 실행: **프론트, 백 동시에, express로 실행**

<br />

## Collaboration Tools

- Figma : 초반 기획시 빠른 레이아웃을 잡기 위해 사용
- Notion : API 명세서, API DOCS 등 활용
- Discord : 팀원간 커뮤니케이션 및 매일 아침 스크럼 진행
- Gitlab : Code Repository
- Gitlab Issue : Trouble Shooting 내역 기제
- Gitlab Wiki : 🔗[프로젝트 과정 기록](https://kdt-gitlab.elice.io/sw_track/class_04/web_project/team11/holo/-/wikis/%ED%9A%8C%EC%9D%98%EB%A1%9D)
- Postman Teams : API 테스트 진행

## Scrum

- 매일 오전 10시 스크럼 진행
- 프론트, 백의 개발 진행상황 및 이슈 공유
- 필요시 프론트/백/전체 오프라인 미팅 진행

## 코드 컨벤션

- RESTful한 API 작성
- 파일명 및 변수명 lowerCamelCase 사용
- Class, ID Selector : 프론트엔드 재량
- DOM 요소 : 프론트엔드 재량

<br />

## 배포

- pm2를 이용한 서버 오픈 및 nginx를 활용한 배포

## 서버 실행 방법

```bash
git clone {.....repository_name}.git
cd {repository_name}
npm install
npm run start
```

### .env 설정

```
PORT = {PORT}
JWT_SECRET_KEY = {YOUR_JWT_SECRET_KEY}
MONGODB_URL = {YOUR_MONGODB_URL}
```

