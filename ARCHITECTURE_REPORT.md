# Архитектурный отчёт Т-Card

## Платформа рекрутинга промышленного персонала

**Версия документа:** 1.0  
**Дата:** 15 августа 2025  
**Стек:** React 19, TypeScript 5.7, Vite 8, Tailwind CSS 4, React Router 7

---

## Оглавление

1. [Обзор системы](#1-обзор-системы)
2. [Архитектурная диаграмма (C4 — Container)](#2-архитектурная-диаграмма-c4--container)
3. [Архитектура фронтенда](#3-архитектура-фронтенда)
4. [Архитектура бэкенда (проектируемая)](#4-архитектура-бэкенда-проектируемая)
5. [Диаграмма базы данных (ER)](#5-диаграмма-базы-данных-er)
6. [Диаграмма классов доменной модели](#6-диаграмма-классов-доменной-модели)
7. [Сценарий: Отклик соискателя на вакансию](#7-сценарий-отклик-соискателя-на-вакансию)
8. [Сценарий: Приглашение на собеседование (работодатель)](#8-сценарий-приглашение-на-собеседование-работодатель)
9. [Сценарий: Авторизация и выбор роли](#9-сценарий-авторизация-и-выбор-роли)
10. [Сценарий: Создание и публикация вакансии](#10-сценарий-создание-и-публикация-вакансии)
11. [Диаграмма состояний отклика (Application State Machine)](#11-диаграмма-состояний-отклика-application-state-machine)
12. [Диаграмма состояний вакансии (Vacancy State Machine)](#12-диаграмма-состояний-вакансии-vacancy-state-machine)
13. [Диаграмма пакетов (Component Diagram)](#13-диаграмма-пакетов-component-diagram)
14. [Структура проекта](#14-структура-проекта)
15. [State Management](#15-state-management)
16. [Безопасность и авторизация](#16-безопасность-и-авторизация)
17. [Развёртывание](#17-развёртывание)

---

## 1. Обзор системы

Т-Card — платформа для подбора промышленного персонала (рабочие специальности и ИТР). Система объединяет две роли:

- **Соискатель (Employee)** — поиск вакансий, отклики, оценка компетенций, развитие, резюме
- **Работодатель (Employer)** — управление вакансиями, кандидатами, откликами, аналитика

Платформа поддерживает два типа специальностей:
- **Рабочие специальности** — с тарифными разрядами (1–6), допусками (электробезопасность, работы на высоте и т.д.)
- **ИТР (инженерно-технические работники)** — с требованиями (ЕСКД, ГОСТ, САПР, грейды 5/7/8)

### Ключевые бизнес-процессы

| Процесс | Участники | Результат |
|---------|-----------|-----------|
| Отклик на вакансию | Соискатель | Создание заявки со статусом "pending" |
| Рассмотрение отклика | Работодатель | Переход в "invitation" или "rejected" |
| Назначение собеседования | Работодатель | Создание интервью, переход в "interview" |
| Оценка компетенций | Соискатель | Подтверждение разряда, заполнение профиля |
| Развитие (треки) | Соискатель | Прохождение чекпоинтов, обучение |
| Создание вакансии | Работодатель | Публикация вакансии из шаблона или с нуля |

---

## 2. Архитектурная диаграмма (C4 — Container)

```plantuml
@startuml C4_Container
!theme plain
skinparam backgroundColor #FFFFFF
skinparam roundCorner 12
skinparam componentStyle rectangle

title T-Card: Архитектура системы (C4 Container)

actor "Соискатель" as Emp
actor "Работодатель" as Er

package "Frontend (SPA)" {
  [React SPA\n(Vite + TS)] as SPA
  [React Router v7] as Router
  [AppContext\n(State Management)] as Ctx
  [LocalStorage\n(Persistence Layer)] as LS
}

package "Backend (проектируемый)" {
  [API Gateway] as API
  [Auth Service] as AuthSvc
  [Vacancy Service] as VacSvc
  [Application Service] as AppSvc
  [Assessment Service] as AssessSvc
  [Notification Service] as NotifSvc
  [Analytics Service] as AnalSvc
}

package "Data Layer" {
  database "PostgreSQL\n(Users, Vacancies,\nApplications, Interviews)" as DB
  database "Redis\n(Sessions, Cache)" as Redis
  database "S3 / MinIO\n(Files, Avatars,\nCertificates)" as S3
}

package "External" {
  [SMS Gateway\n(авторизация)] as SMS
  [Email Service\n(уведомления)] as Email
  [1С:ЗУП\n(интеграция)] as 1C
  [LMS / ЦОПП\n(обучение)] as LMS
}

Emp --> SPA
Er --> SPA
SPA --> Router : Маршрутизация
SPA --> Ctx : useApp()
Ctx --> LS : useLocalStorage()

SPA --> API : REST API\n(проектируемый)
API --> AuthSvc
API --> VacSvc
API --> AppSvc
API --> AssessSvc
API --> NotifSvc
API --> AnalSvc

AuthSvc --> SMS : OTP
NotifSvc --> Email : Уведомления
VacSvc --> DB
AppSvc --> DB
AssessSvc --> DB
AuthSvc --> Redis
AnalSvc --> DB

VacSvc ..> 1C : Синхронизация\n(план)
AssessSvc ..> LMS : Обучение\n(план)
AppSvc --> S3 : Резюме/Сертификаты

@enduml
```

---

## 3. Архитектура фронтенда

```plantuml
@startuml Frontend_Architecture
!theme plain
skinparam backgroundColor #FFFFFF
skinparam roundCorner 10
skinparam packageStyle folder

title Архитектура фронтенда (детально)

package "Entry Point" {
  [main.tsx] as Main
  [App.tsx\n(Router + Guards)] as App
  [index.css\n(Tailwind v4)] as CSS
}

package "Context Layer" {
  [AppProvider] as Provider
  [AppContext\n(role, user, settings,\nbookmarks, applications,\nresumes, savedSearches)] as Context
}

package "Hooks" {
  [useLocalStorage<T>] as HookLS
}

package "Layout Components" {
  [EmployeeLayout\n(Sidebar + Header)] as EmLayout
  [EmployerLayout\n(Sidebar + Header)] as ErLayout
  [AuthLayout\n(Phone + Code flow)] as AuthLayout
}

package "Employee Pages" as EmpPkg {
  [Home] as EmpHome
  [Vacancies\n(List + Detail)] as EmpVac
  [Applications\n(List + Detail)] as EmpApp
  [Search] as EmpSearch
  [Competence] as EmpComp
  [Assessments\n(List + Detail)] as EmpAssess
  [Development] as EmpDev
  [Resumes\n(List + Editor)] as EmpRes
  [Settings\n(Notifications + Settings)] as EmpSet
  [Profile] as EmpProfile
  [Auth\n(Login + Register)] as EmpAuth
}

package "Employer Pages" as ErPkg {
  [Home] as ErHome
  [Vacancies\n(List + Detail + Editor)] as ErVac
  [Candidates\n(List + Detail)] as ErCand
  [Applications\n(List + Detail)] as ErApp
  [Analytics] as ErAnal
  [Company\n(Profile + Edit)] as ErComp
  [Settings] as ErSet
  [Auth\n(Login + Register)] as ErAuth
}

package "UI Components" {
  [Card] as UICard
  [GreenBtn / OutlineBtn] as UIBtn
  [Chip / StatusBadge] as UIChip
  [Input / Select / Toggle] as UIInput
  [EmptyState / SuccessScreen] as UIEmpty
  [SectionHeader / ProgressBar] as UIHeader
}

package "Icons" {
  [Icons.tsx\n(20+ SVG иконок)] as Icons
}

package "Data Layer" {
  [mockData.ts\n(1274 строки:\nвакансии, кандидаты,\nотклики, оценки, треки,\nрезюме, уведомления,\nаналитика, шаблоны)] as Mock
  [types/index.ts\n(302 строки:\n20+ интерфейсов)] as Types
}

Main --> App
App --> Provider
Provider --> Context
Context --> HookLS
App --> EmLayout
App --> ErLayout
App --> AuthLayout

EmLayout --> EmpPkg
ErLayout --> ErPkg

EmpPkg --> UIComponents
ErPkg --> UIComponents
UIComponents --> Icons
EmpPkg --> Mock
ErPkg --> Mock
Mock --> Types

@enduml
```

---

## 4. Архитектура бэкенда (проектируемая)

```plantuml
@startuml Backend_Architecture
!theme plain
skinparam backgroundColor #FFFFFF
skinparam roundCorner 10
skinparam componentStyle rectangle

title Архитектура бэкенда (проектируемая, микросервисная)

cloud "API Gateway (Nginx / Traefik)" as Gateway

package "Auth Service" {
  [POST /auth/phone\n(отправка OTP)] as AuthPhone
  [POST /auth/verify\n(проверка кода)] as AuthVerify
  [POST /auth/register\n(регистрация)] as AuthReg
  [JWT Token\n(access + refresh)] as JWT
}

package "Vacancy Service" {
  [GET /vacancies\n(список + фильтры)] as VacList
  [GET /vacancies/:id\n(детали)] as VacDetail
  [POST /vacancies\n(создание)] as VacCreate
  [PUT /vacancies/:id\n(редактирование)] as VacEdit
  [PATCH /vacancies/:id/status\n(смена статуса)] as VacStatus
  [GET /vacancies/templates\n(шаблоны)] as VacTemplates
}

package "Application Service" {
  [GET /applications\n(отклики сотрудника)] as AppList
  [GET /applications/:id\n(детали отклика)] as AppDetail
  [POST /applications\n(создание отклика)] as AppCreate
  [PATCH /applications/:id/status\n(смена статуса)] as AppStatus
  [POST /applications/:id/interview\n(назначение собеседования)] as AppInterview
  [POST /applications/:id/chat\n(сообщение в чат)] as AppChat
}

package "Candidate Service" {
  [GET /candidates\n(список + поиск)] as CandList
  [GET /candidates/:id\n(детали)] as CandDetail
  [POST /candidates/:id/favorite\n(в избранное)] as CandFav
  [GET /candidates/match\n(подбор по вакансии)] as CandMatch
}

package "Assessment Service" {
  [GET /assessments\n(список оценок)] as AssessList
  [GET /assessments/:id\n(детали + вопросы)] as AssessDetail
  [POST /assessments/:id/submit\n(отправка ответов)] as AssessSubmit
  [GET /competence\n(профиль компетенций)] as Competence
}

package "Development Service" {
  [GET /tracks\n(треки развития)] as Tracks
  [POST /tracks/:id/checkpoint\n(отметка чекпоинта)] as Checkpoint
  [GET /programs\n(учебные программы)] as Programs
}

package "Notification Service" {
  [GET /notifications\n(список)] as NotifList
  [PATCH /notifications/:id/read\n(отметка прочитанным)] as NotifRead
  [WebSocket /ws\n(real-time)] as WS
}

package "Analytics Service" {
  [GET /analytics/overview\n(KPI)] as AnalOverview
  [GET /analytics/funnel\n(воронка найма)] as AnalFunnel
  [GET /analytics/vacancies\n(по вакансиям)] as AnalVac
}

package "Company Service" {
  [GET /company\n(профиль компании)] as CompProfile
  [PUT /company\n(редактирование)] as CompEdit
  [GET /company/departments\n(подразделения)] as CompDept
}

database "PostgreSQL" as PG
database "Redis" as RD
database "S3" as S3

Gateway --> AuthPhone
Gateway --> AuthVerify
Gateway --> AuthReg
Gateway --> VacList
Gateway --> VacDetail
Gateway --> VacCreate
Gateway --> VacEdit
Gateway --> VacStatus
Gateway --> VacTemplates
Gateway --> AppList
Gateway --> AppDetail
Gateway --> AppCreate
Gateway --> AppStatus
Gateway --> AppInterview
Gateway --> AppChat
Gateway --> CandList
Gateway --> CandDetail
Gateway --> CandFav
Gateway --> CandMatch
Gateway --> AssessList
Gateway --> AssessDetail
Gateway --> AssessSubmit
Gateway --> Competence
Gateway --> Tracks
Gateway --> Checkpoint
Gateway --> Programs
Gateway --> NotifList
Gateway --> NotifRead
Gateway --> WS
Gateway --> AnalOverview
Gateway --> AnalFunnel
Gateway --> AnalVac
Gateway --> CompProfile
Gateway --> CompEdit
Gateway --> CompDept

AuthVerify --> JWT
AuthReg --> PG
VacList --> PG
VacDetail --> PG
VacCreate --> PG
AppCreate --> PG
AppStatus --> PG
AppInterview --> PG
AppChat --> PG
CandList --> PG
CandMatch --> PG
AssessSubmit --> PG
Tracks --> PG
NotifList --> PG
AnalOverview --> PG
AnalFunnel --> PG
CompProfile --> PG

JWT --> RD : Сессии
WS --> RD : Pub/Sub

AppCreate --> S3 : Резюме
AssessSubmit --> S3 : Сертификаты

@enduml
```

---

## 5. Диаграмма базы данных (ER)

```plantuml
@startuml ER_Diagram
!theme plain
skinparam backgroundColor #FFFFFF
skinparam linetype ortho

title Диаграмма базы данных (ER)

entity "users" as users {
  *id : UUID <<PK>>
  --
  *phone : VARCHAR(20)
  *role : ENUM(employee, employer)
  name : VARCHAR(100)
  specialty : VARCHAR(100)
  grade : INT
  city : VARCHAR(100)
  about : TEXT
  photo_url : VARCHAR(255)
  created_at : TIMESTAMP
  updated_at : TIMESTAMP
}

entity "companies" as companies {
  *id : UUID <<PK>>
  --
  *name : VARCHAR(200)
  *inn : VARCHAR(12)
  industry : VARCHAR(100)
  address : TEXT
  verified : BOOLEAN
  rating : DECIMAL(2,1)
  reviews_count : INT
  user_id : UUID <<FK>> (owner)
}

entity "departments" as departments {
  *id : UUID <<PK>>
  --
  *company_id : UUID <<FK>>
  *name : VARCHAR(200)
}

entity "vacancies" as vacancies {
  *id : UUID <<PK>>
  --
  *company_id : UUID <<FK>>
  *title : VARCHAR(200)
  *city : VARCHAR(100)
  *salary_from : INT
  *salary_to : INT
  *experience : VARCHAR(50)
  grade : INT
  *shift : VARCHAR(20)
  *department_id : UUID <<FK>>
  *description : TEXT
  *category : VARCHAR(100)
  *status : ENUM(draft, active, paused, closed)
  views : INT
  responses : INT
  is_itr : BOOLEAN
  template_id : UUID <<FK>>
  created_at : TIMESTAMP
  updated_at : TIMESTAMP
}

entity "vacancy_admissions" as vac_admissions {
  *id : UUID <<PK>>
  --
  *vacancy_id : UUID <<FK>>
  *admission_name : VARCHAR(100)
}

entity "itr_requirements" as itr_req {
  *id : UUID <<PK>>
  --
  *vacancy_id : UUID <<FK>>
  *requirement : VARCHAR(50)
}

entity "vacancy_templates" as templates {
  *id : UUID <<PK>>
  --
  *title : VARCHAR(200)
  *category : VARCHAR(100)
  *city : VARCHAR(100)
  *salary_from : INT
  *salary_to : INT
  *experience : VARCHAR(50)
  grade : INT
  *shift : VARCHAR(20)
  *department : VARCHAR(200)
  *description : TEXT
  created_at : TIMESTAMP
}

entity "resumes" as resumes {
  *id : UUID <<PK>>
  --
  *user_id : UUID <<FK>>
  *specialty : VARCHAR(100)
  *experience : VARCHAR(50)
  *salary_from : INT
  *salary_to : INT
  *city : VARCHAR(100)
  is_active : BOOLEAN
  about : TEXT
  grade : INT
  education : VARCHAR(100)
  shift : VARCHAR(20)
  updated_at : TIMESTAMP
}

entity "resume_admissions" as res_admissions {
  *id : UUID <<PK>>
  --
  *resume_id : UUID <<FK>>
  *admission_name : VARCHAR(100)
}

entity "applications" as applications {
  *id : UUID <<PK>>
  --
  *user_id : UUID <<FK>>
  *vacancy_id : UUID <<FK>>
  *status : ENUM(pending, invitation, interview, rejected)
  *created_at : TIMESTAMP
  updated_at : TIMESTAMP
}

entity "application_stages" as stages {
  *id : UUID <<PK>>
  --
  *application_id : UUID <<FK>>
  *name : VARCHAR(100)
  *date : VARCHAR(50)
  *done : BOOLEAN
  *order : INT
}

entity "interviews" as interviews {
  *id : UUID <<PK>>
  --
  *application_id : UUID <<FK>>
  *date : VARCHAR(50)
  *time : VARCHAR(10)
  *format : ENUM(offline, online, phone)
  *address : TEXT
  comment : TEXT
  *status : ENUM(scheduled, confirmed, rescheduled, no_show, cancelled, completed)
}

entity "timeline_events" as timeline {
  *id : UUID <<PK>>
  --
  *application_id : UUID <<FK>>
  *type : ENUM(application_created, status_changed, interview_scheduled, interview_confirmed, interview_rescheduled, interview_no_show, interview_cancelled, interview_completed, rejected, comment)
  *author : VARCHAR(100)
  *timestamp : VARCHAR(100)
  comment : TEXT
}

entity "chat_messages" as chat {
  *id : UUID <<PK>>
  --
  *application_id : UUID <<FK>>
  *author : ENUM(employer, employee)
  *text : TEXT
  *created_at : TIMESTAMP
}

entity "assessments" as assessments {
  *id : UUID <<PK>>
  --
  *user_id : UUID <<FK>>
  *title : VARCHAR(200)
  *type : ENUM(test, case, simulation)
  *duration : VARCHAR(20)
  *deadline : VARCHAR(50)
  *status : ENUM(assigned, completed, expired)
  score : INT
  confirmed_grade : INT
  weak_zone : VARCHAR(100)
}

entity "assessment_questions" as questions {
  *id : UUID <<PK>>
  --
  *assessment_id : UUID <<FK>>
  *text : TEXT
  *options : JSONB
  *correct_index : INT
}

entity "assessment_topics" as topics {
  *id : UUID <<PK>>
  --
  *assessment_id : UUID <<FK>>
  *name : VARCHAR(100)
  *score : INT
}

entity "development_tracks" as tracks {
  *id : UUID <<PK>>
  --
  *user_id : UUID <<FK>>
  *goal : VARCHAR(200)
  *progress : INT
  assigned_by_employer : BOOLEAN
  *deadline : VARCHAR(50)
}

entity "checkpoints" as checkpoints {
  *id : UUID <<PK>>
  --
  *track_id : UUID <<FK>>
  *name : VARCHAR(200)
  *status : ENUM(done, reminder, planned)
  *date : VARCHAR(50)
}

entity "learning_programs" as programs {
  *id : UUID <<PK>>
  --
  *track_id : UUID <<FK>>
  *title : VARCHAR(200)
  *duration : VARCHAR(20)
  *format : VARCHAR(50)
  paid_by_employer : BOOLEAN
  modules_progress : INT
  modules_total : INT
}

entity "certificates" as certificates {
  *id : UUID <<PK>>
  --
  *user_id : UUID <<FK>>
  *title : VARCHAR(200)
  *issue_date : VARCHAR(50)
  *expiry_date : VARCHAR(50)
}

entity "notifications" as notifications {
  *id : UUID <<PK>>
  --
  *user_id : UUID <<FK>>
  *type : ENUM(new_response, assessment_completed, candidate_rejected, subscription, interview, invitation)
  *text : TEXT
  *time : VARCHAR(20)
  *date_group : ENUM(today, yesterday)
  *read : BOOLEAN
}

entity "saved_searches" as saved_searches {
  *id : UUID <<PK>>
  --
  *user_id : UUID <<FK>>
  *query : VARCHAR(200)
  *criteria : VARCHAR(200)
  notifications : BOOLEAN
}

entity "bookmarks" as bookmarks {
  *id : UUID <<PK>>
  --
  *user_id : UUID <<FK>>
  *vacancy_id : UUID <<FK>>
}

entity "user_admissions" as user_admissions {
  *id : UUID <<PK>>
  --
  *user_id : UUID <<FK>>
  *admission_name : VARCHAR(100)
}

' Relationships
users ||--o{ companies : "owns"
users ||--o{ resumes : "has"
users ||--o{ applications : "submits"
users ||--o{ assessments : "takes"
users ||--o{ development_tracks : "assigned"
users ||--o{ certificates : "holds"
users ||--o{ notifications : "receives"
users ||--o{ saved_searches : "saves"
users ||--o{ bookmarks : "bookmarks"
users ||--o{ user_admissions : "has"

companies ||--o{ departments : "has"
companies ||--o{ vacancies : "publishes"

departments ||--o{ vacancies : "contains"

vacancies ||--o{ vacancy_admissions : "requires"
vacancies ||--o{ itr_requirements : "requires (ITR)"
vacancies ||--o{ applications : "receives"
vacancies ||--o{ bookmarks : "saved by"

templates ||--o{ vacancies : "creates from"

resumes ||--o{ resume_admissions : "lists"

applications ||--o{ application_stages : "tracks"
applications ||--|| interviews : "has (0..1)"
applications ||--o{ timeline_events : "logs"
applications ||--o{ chat_messages : "contains"

assessments ||--o{ assessment_questions : "has"
assessments ||--o{ assessment_topics : "scores"

development_tracks ||--o{ checkpoints : "has"
development_tracks ||--o{ learning_programs : "recommends"

@enduml
```

---

## 6. Диаграмма классов доменной модели

```plantuml
@startuml Class_Diagram
!theme plain
skinparam backgroundColor #FFFFFF
skinparam classAttributeIconSize 0

title Доменная модель (TypeScript интерфейсы)

enum Role {
  employee
  employer
}

enum VacancyStatus {
  draft
  active
  paused
  closed
}

enum ApplicationStatus {
  pending
  invitation
  interview
  rejected
}

enum InterviewFormat {
  offline
  online
  phone
}

enum InterviewStatus {
  scheduled
  confirmed
  rescheduled
  no_show
  cancelled
  completed
}

enum AssessmentStatus {
  assigned
  completed
  expired
}

class User {
  name: string
  phone: string
  role: Role
  specialty?: string
  grade?: number
  city?: string
  photo?: string
  about?: string
}

class Company {
  name: string
  inn: string
  industry: string
  address: string
  departments: string[]
  verified: boolean
  rating: number
  reviewsCount: number
}

class Vacancy {
  id: number
  company: string
  title: string
  city: string
  salaryFrom: number
  salaryTo: number
  experience: string
  grade: number
  admissions: string[]
  shift: string
  department: string
  description: string
  category: string
  vacancyStatus?: VacancyStatus
  isITR?: boolean
  itrRequirements?: string[]
  templateId?: number
}

class VacancyTemplate {
  id: number
  title: string
  category: string
  city: string
  salaryFrom: number
  salaryTo: number
  experience: string
  grade: number
  admissions: string[]
  shift: string
  department: string
  description: string
  createdAt: string
}

class Candidate {
  id: number
  name: string
  specialty: string
  grade: number
  gradeConfirmed: boolean
  city: string
  experience: string
  matchPercent: number
  admissions: string[]
  shift: string
  assessments: AssessmentTopic[]
  description?: string
}

class AssessmentTopic {
  name: string
  score: number
}

class Application {
  id: number
  vacancyId: number
  vacancyTitle: string
  company: string
  date: string
  status: ApplicationStatus
  stages: Stage[]
}

class Stage {
  name: string
  date: string
  done: boolean
}

class EmployerApplication {
  id: number
  candidateName: string
  candidateGrade: number
  candidateCity: string
  candidateExperience: string
  candidateDescription?: string
  matchPercent: number
  vacancyId: number
  vacancyTitle: string
  status: ApplicationStatus
  assessments: AssessmentTopic[]
  admissions: string[]
  shift: string
  interview?: Interview
  timeline: TimelineEvent[]
}

class Interview {
  date: string
  time: string
  format: InterviewFormat
  address: string
  comment: string
  status: InterviewStatus
}

class TimelineEvent {
  id: number
  type: TimelineEventType
  author: string
  timestamp: string
  comment?: string
}

class Assessment {
  id: number
  title: string
  type: AssessmentType
  duration: string
  deadline: string
  status: AssessmentStatus
  score?: number
  confirmedGrade?: number
  topics?: AssessmentTopic[]
  weakZone?: string
  questions?: AssessmentQuestion[]
}

class AssessmentQuestion {
  id: number
  text: string
  options: string[]
  correctIndex: number
}

class DevelopmentTrack {
  id: number
  goal: string
  progress: number
  assignedByEmployer: boolean
  deadline: string
  checkpoints: Checkpoint[]
  recommendedPrograms: LearningProgram[]
}

class Checkpoint {
  name: string
  status: CheckpointStatus
  date: string
}

class LearningProgram {
  id: number
  title: string
  duration: string
  format: string
  paidByEmployer: boolean
  modulesProgress?: number
  modulesTotal?: number
}

class Certificate {
  id: number
  title: string
  issueDate: string
  expiryDate: string | "permanent"
}

class Resume {
  id: number
  specialty: string
  experience: string
  salaryFrom: number
  salaryTo: number
  city: string
  active: boolean
  updatedAt: string
  about?: string
  admissions?: string[]
  grade?: number
  education?: string
  shift?: string
  stats: ResumeStats
}

class ResumeStats {
  favorites: number
  responses: number
  views: number
}

class AppNotification {
  id: number
  type: NotificationType
  text: string
  time: string
  dateGroup: string
  read: boolean
}

class SavedSearch {
  id: number
  query: string
  criteria: string
  notifications: boolean
}

class AppSettings {
  pinEnabled: boolean
  faceIdEnabled: boolean
  touchIdEnabled: boolean
  notificationsEnabled: boolean
  phone: string
  email: string
  name: string
}

User --> Role
Vacancy --> VacancyStatus
Vacancy --> VacancyTemplate : "templateId"
Vacancy ..> PublicationChannel : "channels"
Application --> ApplicationStatus
Application --> Stage
EmployerApplication --> ApplicationStatus
EmployerApplication --> Interview
EmployerApplication --> TimelineEvent
EmployerApplication --> AssessmentTopic
Interview --> InterviewFormat
Interview --> InterviewStatus
Assessment --> AssessmentStatus
Assessment --> AssessmentTopic
Assessment --> AssessmentQuestion
DevelopmentTrack --> Checkpoint
DevelopmentTrack --> LearningProgram
Resume --> ResumeStats
Candidate --> AssessmentTopic

@enduml
```

---

## 7. Сценарий: Отклик соискателя на вакансию

```plantuml
@startuml Scenario_Apply
!theme plain
skinparam backgroundColor #FFFFFF
skinparam sequenceMessageAlign center

title Сценарий: Отклик соискателя на вакансию

actor "Соискатель" as Emp
participant "VacancyList\n(страница)" as VList
participant "VacancyDetail\n(страница)" as VDetail
participant "AppContext\n(useApp)" as Ctx
participant "useLocalStorage\n(hook)" as LS
database "localStorage\n(браузер)" as Storage

Emp -> VList : Открывает /employee/vacancies
VList -> VList : Загружает MOCK_VACANCIES\n+ фильтр по категории
VList --> Emp : Показывает список вакансий

Emp -> VList : Кликает на вакансию
VList -> VDetail : navigate(/employee/vacancies/:id)
VDetail -> VDetail : Находит вакансию по id
VDetail --> Emp : Показывает детали:\nзарплата, требования, описание

Emp -> VDetail : Выбирает резюме
VDetail --> Emp : Подсвечивает выбранное резюме

Emp -> VDetail : Нажимает "Откликнуться"
VDetail -> Ctx : addApplication({\n  id: Date.now(),\n  vacancyId, vacancyTitle,\n  company, date,\n  status: "pending",\n  stages: [\n    {Отклик отправлен, done: true},\n    {Рассмотрение, done: false},\n    {Собеседование, done: false}\n  ]\n})
Ctx -> LS : setApplications([newApp, ...prev])
LS -> Storage : localStorage.setItem(\n  "tcard:applications",\n  JSON.stringify(applications))
Storage --> LS : OK
LS --> Ctx : Обновлённый массив
Ctx --> VDetail : Состояние обновлено

VDetail -> VDetail : setApplied(true)
VDetail --> Emp : SuccessScreen:\n"Отклик отправлен"

note over Emp, Storage
  Этапы отклика (единый шаблон):
  1. Отклик отправлен (done: true)
  2. Рассмотрение (done: false)
  3. Собеседование (done: false)
  
  При отказе: этап "Отказ" заменяет "Собеседование"
end note

@enduml
```

---

## 8. Сценарий: Приглашение на собеседование (работодатель)

```plantuml
@startuml Scenario_Invite
!theme plain
skinparam backgroundColor #FFFFFF
skinparam sequenceMessageAlign center

title Сценарий: Приглашение на собеседование (работодатель)

actor "Работодатель" as Er
participant "EmployerApplicationList\n(страница)" as EList
participant "EmployerApplicationDetail\n(страница)" as EDetail
participant "useLocalStorage\n(employer:applications)" as ELS
database "localStorage\n(браузер)" as Storage

Er -> EList : Открывает /employer/applications
EList -> ELS : Загружает MOCK_EMPLOYER_APPLICATIONS
ELS -> Storage : getItem("tcard:employer:applications")
Storage --> ELS : JSON массив
ELS --> EList : apps[]
EList --> Er : Список откликов\n(фильтры: Все/Ожидание/\nПриглашение/Собеседование/Отказ)

Er -> EList : Кликает на отклик (status: pending)
EList -> EDetail : navigate(/employer/applications/:id)
EDetail -> EDetail : Находит отклик по id
EDetail --> Er : Детали кандидата:\nоценки, допуски, описание,\nтаймлайн, действия

Er -> EDetail : Нажимает "Пригласить на собеседование"
EDetail -> EDetail : setShowInviteForm(true)
EDetail --> Er : Форма приглашения:\ntextarea для комментария

Er -> EDetail : Вводит комментарий\n"Здравствуйте! Приглашаем вас\nна собеседование."
Er -> EDetail : Нажимает "Отправить"
EDetail -> EDetail : sendInvite()\n  1. Добавляет сообщение в chatMessages\n  2. Обновляет статус на "invitation"\n  3. Добавляет TimelineEvent\n  4. setShowChat(true) — авто-открытие чата

EDetail -> ELS : setApplications(\n  prev.map(a => a.id === id ?\n    {...a, status: "invitation",\n     timeline: [...a.timeline, newEvent]} : a))
ELS -> Storage : localStorage.setItem(...)
Storage --> ELS : OK

EDetail --> Er : Отображает активный чат\nс кандидатом\n(сообщение уже отправлено)

note over Er, Storage
  После отправки комментария:
  - Статус меняется на "invitation"
  - TimelineEvent: {type: "status_changed",\n  comment: "Приглашение на собеседование"}
  - Чат автоматически открывается
  - Работодатель может продолжить переписку
end note

@enduml
```

---

## 9. Сценарий: Авторизация и выбор роли

```plantuml
@startuml Scenario_Auth
!theme plain
skinparam backgroundColor #FFFFFF
skinparam sequenceMessageAlign center

title Сценарий: Авторизация и выбор роли

actor "Пользователь" as U
participant "RoleSelection\n(страница)" as Role
participant "EmployeeLogin /\nEmployerLogin" as Login
participant "PhoneInputPage" as Phone
participant "CodeVerificationPage" as Code
participant "AppContext" as Ctx
participant "RequireAuth\n(Guard)" as Guard

U -> Role : Открывает /
Role --> U : Выбор роли:\n[Соискатель] [Работодатель]

alt Соискатель
  U -> Role : Выбирает "Соискатель"
  Role -> Login : navigate(/employee/login)
  Login --> U : Форма входа\n(тестовые аккаунты / по телефону)
  
  alt Тестовый аккаунт
    U -> Login : Выбирает тестовый аккаунт
    Login -> Ctx : setRole("employee")\nsetAuthenticated(true)\nsetUser(testAccount)
    Login -> Guard : navigate(/employee)
  else По телефону
    U -> Login : Выбирает "По телефону"
    Login -> Phone : navigate(/employee/phone)
    Phone --> U : Ввод телефона
    U -> Phone : Вводит номер
    Phone -> Code : navigate(/employee/code)
    Code --> U : Ввод кода (any 4 digits)
    U -> Code : Вводит код
    Code -> Ctx : setRole("employee")\nsetAuthenticated(true)
    Code -> Guard : navigate(/employee)
  end
  
  Guard -> Ctx : Проверка isAuthenticated\n&& role === "employee"
  Guard --> U : EmployeeLayout + страницы
end

alt Работодатель
  U -> Role : Выбирает "Работодатель"
  Role -> Login : navigate(/employer/login)
  Login --> U : Форма входа работодателя
  
  U -> Login : Вводит данные / тестовый
  Login -> Ctx : setRole("employer")\nsetAuthenticated(true)
  Login -> Guard : navigate(/employer)
  
  Guard -> Ctx : Проверка isAuthenticated\n&& role === "employer"
  Guard --> U : EmployerLayout + страницы
end

note over U, Guard
  Guards:
  - RequireAuth: redirect to /employee/login if !auth
  - RequireEmployerAuth: redirect to /employer/login if !auth || role !== employer
  - RedirectIfAuth: redirect to /employee if already auth
  - RedirectIfEmployerAuth: redirect to /employer if already auth
end note

@enduml
```

---

## 10. Сценарий: Создание и публикация вакансии

```plantuml
@startuml Scenario_CreateVacancy
!theme plain
skinparam backgroundColor #FFFFFF
skinparam sequenceMessageAlign center

title Сценарий: Создание и публикация вакансии

actor "Работодатель" as Er
participant "EmployerVacancyList" as VList
participant "EmployerVacancyEditor" as Editor
participant "useLocalStorage\n(vacancies)" as VLS
database "localStorage" as Storage

Er -> VList : Открывает /employer/vacancies
VList --> Er : Список вакансий\n+ фильтры (статус, подразделение)\n+ кнопка "Создать вакансию"

Er -> VList : Нажимает "Создать вакансию"
VList -> Editor : navigate(/employer/vacancies/new)
Editor --> Er : Форма редактора:\n- Название, категория\n- Город, зарплата\n- Разряд/ИТР требования\n- Допуски, график\n- Подразделение\n- Описание

alt Из шаблона
  Er -> Editor : Выбирает шаблон
  Editor -> Editor : createFromTemplate(template)\nЗаполняет поля из VacancyTemplate
  Editor --> Er : Предзаполненная форма
end

Er -> Editor : Заполняет/редактирует поля
Er -> Editor : Нажимает "Сохранить"
Editor -> Editor : handleSave()\n  Валидация: title, salaryFrom,\n  salaryTo, description

Editor -> VLS : setVacancies(\n  [newVacancy, ...prev])
VLS -> Storage : localStorage.setItem(\n  "tcard:employer:vacancies",\n  JSON.stringify(vacancies))
Storage --> VLS : OK

Editor -> Editor : setSaved(true)\nsetShowSuccess(true)
Editor --> Er : SuccessScreen:\n"Вакансия создана"

note over Er, Storage
  VacancyTemplate содержит предзаполненные поля:
  title, category, city, salaryFrom/To,
  experience, grade, admissions, shift,
  department, description
  
  5 шаблонов: Оператор ЧПУ, Наладчик,
  Сварщик, Инженер-конструктор, Слесарь-ремонтник
end note

@enduml
```

---

## 11. Диаграмма состояний отклика (Application State Machine)

```plantuml
@startuml StateMachine_Application
!theme plain
skinparam backgroundColor #FFFFFF

title Диаграмма состояний отклика (Application)

state "pending\n(Ожидание)" as pending {
  state "Отклик отправлен ✓"
  state "Рассмотрение (ожидание)"
}

state "invitation\n(Приглашение)" as invitation {
  state "Рассмотрение ✓"
  state "Приглашение отправлено"
}

state "interview\n(Собеседование)" as interview {
  state "Собеседование назначено"
  state "Собеседование проведено"
}

state "rejected\n(Отказ)" as rejected {
  state "Авто-письмо отправлено:\n«Спасибо за ваш отклик.\nК сожалению, сейчас мы\nне готовы предложить\nвам эту вакансию.»"
}

[*] --> pending : Соискатель откликается\nна вакансию

pending --> invitation : Работодатель:\n"Пригласить на собеседование"\n(с комментарием → авто-открытие чата)
pending --> rejected : Работодатель:\n"Отклонить"

invitation --> interview : Работодатель:\n"Назначить собеседование"\n(дата, время, формат, адрес)
invitation --> rejected : Работодатель:\n"Отклонить"

interview --> rejected : Работодатель:\n"Отклонить"
interview --> interview : Перенос собеседования\n(reschedule)

rejected --> pending : Работодатель:\n"Вернуть в работу"

rejected --> [*] : Финальное состояние\n(может быть возвращён)

note right of pending
  Этапы (stages):
  1. Отклик отправлен ✓
  2. Рассмотрение
  3. Собеседование
end note

note right of rejected
  Структура отказа сохранена,
  текст заменён на авто-письмо.
  Оффер убран из цепочки.
end note

@enduml
```

---

## 12. Диаграмма состояний вакансии (Vacancy State Machine)

```plantuml
@startuml StateMachine_Vacancy
!theme plain
skinparam backgroundColor #FFFFFF

title Диаграмма состояний вакансии (Vacancy)

state "draft\n(Черновик)" as draft
state "active\n(Активна)" as active
state "paused\n(Пауза)" as paused
state "closed\n(Закрыта)" as closed

[*] --> draft : Создание вакансии\n(из шаблона или с нуля)

draft --> active : Публикация\n("Опубликовать")
active --> paused : "Поставить на паузу"
paused --> active : "Возобновить"
active --> closed : "Закрыть вакансию"
paused --> closed : "Закрыть вакансию"
closed --> draft : "Дублировать"\n(создать копию)

note right of active
  В активном состоянии:
  - Видна соискателям в поиске
  - Принимает отклики
  - Учитывается в аналитике
end note

note right of draft
  В черновике:
  - Не видна соискателям
  - Можно редактировать
  - Можно удалить
end note

@enduml
```

---

## 13. Диаграмма пакетов (Component Diagram)

```plantuml
@startuml Component_Diagram
!theme plain
skinparam backgroundColor #FFFFFF
skinparam componentStyle rectangle
skinparam packageStyle folder

title Диаграмма компонентов (Package Diagram)

package "src/" {
  package "main.tsx + App.tsx" as entry {
    [Router\n(Routes + Guards)]
    [AppProvider]
  }

  package "context/" {
    [AppContext]
  }

  package "hooks/" {
    [useLocalStorage]
  }

  package "types/" {
    [index.ts\n(20+ interfaces)]
  }

  package "data/" {
    [mockData.ts\n(1274 lines)]
  }

  package "components/" {
    package "layout/" {
      [EmployeeLayout]
      [EmployerLayout]
      [AuthLayout]
    }
    package "ui/" {
      [Card, GreenBtn, OutlineBtn]
      [Chip, StatusBadge, Input]
      [Select, Toggle, EmptyState]
      [SuccessScreen, SectionHeader]
      [ProgressBar]
    }
    package "icons/" {
      [Icons.tsx\n(20+ SVG icons)]
    }
  }

  package "pages/employee/" {
    [Home]
    [Vacancies]
    [Applications]
    [Search]
    [Competence]
    [Assessments]
    [Development]
    [Resumes]
    [Settings]
    [Profile]
    [Auth]
  }

  package "pages/employer/" {
    [Home]
    [Vacancies]
    [Candidates]
    [Applications]
    [Analytics]
    [Company]
    [CompanyEdit]
    [Settings]
    [Auth]
  }
}

entry --> AppContext
AppContext --> useLocalStorage
AppContext --> mockData : imports
entry --> EmployeeLayout
entry --> EmployerLayout
entry --> AuthLayout

EmployeeLayout --> pages/employee/
EmployerLayout --> pages/employer/

pages/employee/ --> components/ui/
pages/employer/ --> components/ui/
components/ui/ --> icons/
pages/employee/ --> mockData
pages/employer/ --> mockData
mockData --> types/

@enduml
```

---

## 14. Структура проекта

```
src/
├── main.tsx                    # Entry point — монтирование React
├── App.tsx                     # Роутинг + Guards (RequireAuth, RequireEmployerAuth)
├── index.css                   # Tailwind CSS v4 + глобальные стили
├── vite-env.d.ts               # Типы для Vite
│
├── context/
│   └── AppContext.tsx          # Глобальный state (role, user, settings, bookmarks, applications, resumes, savedSearches)
│
├── hooks/
│   └── useLocalStorage.ts      # Хук-обёртка над useState + localStorage (generic <T>)
│
├── types/
│   └── index.ts                # 20+ TypeScript интерфейсов (доменная модель)
│
├── data/
│   └── mockData.ts             # 1274 строки: mock-данные, дизайн-токены, константы, лейблы
│
├── components/
│   ├── layout/
│   │   ├── EmployeeLayout.tsx  # Sidebar + Header для соискателя (6 nav items)
│   │   ├── EmployerLayout.tsx  # Sidebar + Header для работодателя (7 nav items)
│   │   └── AuthLayout.tsx      # Layout для авторизации (phone + code flow)
│   ├── ui/
│   │   └── index.tsx           # 10+ UI компонентов (Card, GreenBtn, OutlineBtn, Chip, etc.)
│   └── icons/
│       └── Icons.tsx           # 20+ SVG иконок (Home, Search, Briefcase, Star, etc.)
│
├── pages/
│   ├── employee/               # 11 страниц соискателя
│   │   ├── Home.tsx            # Дашборд: статистика, рекомендации, треки
│   │   ├── Vacancies.tsx       # Список вакансий + детальная карточка + отклик
│   │   ├── Applications.tsx    # Список откликов + детальная карточка с этапами
│   │   ├── Search.tsx          # Поиск с фильтрами (разряд, допуски, город, график)
│   │   ├── Competence.tsx      # Профиль компетенций (радар-диаграмма по темам)
│   │   ├── Assessments.tsx     # Список оценок + прохождение теста
│   │   ├── Development.tsx     # Треки развития + учебные программы + сертификаты
│   │   ├── Resumes.tsx         # Список резюме + редактор
│   │   ├── Settings.tsx        # Уведомления + настройки (PIN, FaceID, push)
│   │   ├── Profile.tsx         # Профиль пользователя
│   │   └── Auth.tsx            # Авторизация (login + register, phone + code)
│   │
│   └── employer/               # 9 страниц работодателя
│       ├── Home.tsx            # Дашборд: KPI, последние отклики, активные вакансии
│       ├── Vacancies.tsx       # Список + детальная карточка + редактор вакансий
│       ├── Candidates.tsx      # Список кандидатов + детальная карточка
│       ├── Applications.tsx    # Список откликов + детальная карточка (таймлайн, чат, интервью)
│       ├── Analytics.tsx       # Аналитика: графики, воронка, топ-вакансии
│       ├── Company.tsx         # Профиль компании
│       ├── CompanyEdit.tsx     # Редактирование компании
│       ├── Settings.tsx        # Настройки работодателя
│       └── Auth.tsx            # Авторизация работодателя
│
└── assets/
    └── react.svg
```

---

## 15. State Management

### Текущая архитектура (Frontend-only)

Приложение использует **React Context + useLocalStorage** паттерн для управления состоянием:

```plantuml
@startuml State_Management
!theme plain
skinparam backgroundColor #FFFFFF

title State Management (AppContext + useLocalStorage)

package "AppContext State" {
  rectangle "role: Role | null" as role
  rectangle "isAuthenticated: boolean" as auth
  rectangle "user: User" as user
  rectangle "settings: AppSettings" as settings
  rectangle "bookmarks: number[]" as bookmarks
  rectangle "applications: Application[]" as apps
  rectangle "resumes: Resume[]" as resumes
  rectangle "savedSearches: SavedSearch[]" as searches
}

package "Actions" {
  rectangle "setRole(r)"
  rectangle "setAuthenticated(v)"
  rectangle "setUser(u)"
  rectangle "setSettings(s)"
  rectangle "toggleBookmark(id)"
  rectangle "addApplication(a)"
  rectangle "removeApplication(id)"
  rectangle "addResume(r)"
  rectangle "updateResume(r)"
  rectangle "addSavedSearch(s)"
  rectangle "toggleSavedSearchNotifications(id)"
  rectangle "logout()"
}

package "Persistence" {
  database "localStorage" as ls
}

role --> ls : "tcard:role"
auth --> ls : "tcard:auth"
user --> ls : "tcard:user"
settings --> ls : "tcard:settings"
bookmarks --> ls : "tcard:bookmarks"
apps --> ls : "tcard:applications"
resumes --> ls : "tcard:resumes"
searches --> ls : "tcard:savedSearches"

@enduml
```

### Ключевые особенности

| Аспект | Реализация |
|--------|-----------|
| **Глобальный state** | React Context API (AppProvider) |
| **Персистентность** | useLocalStorage hook (sync с localStorage) |
| **Локальный state** | useState в компонентах (фильтры, формы, UI) |
| **Employer state** | useLocalStorage напрямую в компонентах (vacancies, applications, templates) |
| **Навигация** | React Router v7 (useNavigate, useParams, useLocation) |
| **Типизация** | TypeScript strict mode, 20+ интерфейсов |

### Хранение данных (localStorage keys)

| Key | Тип | Назначение |
|-----|-----|-----------|
| `tcard:role` | `Role \| null` | Текущая роль пользователя |
| `tcard:auth` | `boolean` | Флаг авторизации |
| `tcard:user` | `User` | Данные пользователя |
| `tcard:settings` | `AppSettings` | Настройки (PIN, FaceID, push, контакты) |
| `tcard:bookmarks` | `number[]` | ID закладок вакансий |
| `tcard:applications` | `Application[]` | Отклики соискателя |
| `tcard:resumes` | `Resume[]` | Резюме соискателя |
| `tcard:savedSearches` | `SavedSearch[]` | Сохранённые поиски |
| `tcard:employer:vacancies` | `Vacancy[]` | Вакансии работодателя |
| `tcard:employer:applications` | `EmployerApplication[]` | Отклики на вакансии работодателя |
| `tcard:employer:templates` | `VacancyTemplate[]` | Шаблоны вакансий |
| `tcard:notifications` | `AppNotification[]` | Уведомления |

---

## 16. Безопасность и авторизация

### Текущая реализация (Frontend-only)

```plantuml
@startuml Security
!theme plain
skinparam backgroundColor #FFFFFF

title Безопасность и авторизация (текущая реализация)

rectangle "Route Guards" {
  rectangle "RequireAuth\n(employee)" as RA
  rectangle "RequireEmployerAuth\n(employer)" as REA
  rectangle "RedirectIfAuth\n(employee, уже авторизован)" as RIA
  rectangle "RedirectIfEmployerAuth\n(employer, уже авторизован)" as RIEA
}

rectangle "Auth Flow" {
  rectangle "RoleSelection → выбор роли"
  rectangle "Phone Input → ввод телефона"
  rectangle "Code Verification → OTP (any 4 digits)"
  rectangle "Register → регистрация нового пользователя"
}

rectangle "Security Settings" {
  rectangle "PIN-код (toggle)"
  rectangle "Face ID (toggle)"
  rectangle "Touch ID (toggle)"
  rectangle "Push-уведомления (toggle)"
  rectangle "Журнал безопасности\n(входы, изменения прав, неудачные попытки)"
}

RA --> "Проверка:\nisAuthenticated &&\nrole === employee\n→ иначе redirect /employee/login"
REA --> "Проверка:\nisAuthenticated &&\nrole === employer\n→ иначе redirect /employer/login"

@enduml
```

### Проектируемая безопасность (Backend)

| Механизм | Описание |
|----------|---------|
| **JWT (access + refresh)** | Access token — 15 мин, refresh — 7 дней |
| **OTP через SMS** | 4-значный код, срок жизни — 5 минут |
| **RBAC** | Role-Based Access Control (employee, employer) |
| **Rate limiting** | Защита от brute-force на OTP (3 попытки / 60 сек) |
| **HTTPS/TLS** | Транспортное шифрование |
| **CORS** Whitelist | Ограничение доменов |
| **Input validation** | Zod / class-validator на сервере |

---

## 17. Развёртывание

### Текущее развёртывание

```plantuml
@startuml Deployment
!theme plain
skinparam backgroundColor #FFFFFF
skinparam nodeStyle rectangle

title Развёртывание (текущее)

node "Vercel (CDN)" as Vercel {
  [Static Files\n(dist/)\nJS + CSS + HTML] as Static
}

node "Browser (Client)" as Browser {
  [React SPA] as SPA
  [localStorage] as LS
}

developer "Разработчик" as Dev

Dev -> Vercel : vercel deploy dist --prod
Vercel --> Static : CDN distribution
Browser -> Vercel : HTTPS GET /
Vercel --> Browser : index.html + JS + CSS
Browser -> SPA : Загрузка приложения
SPA -> LS : Чтение/запись state

@enduml
```

### Проектируемое развёртывание (Full-stack)

```plantuml
@startuml Deployment_Future
!theme plain
skinparam backgroundColor #FFFFFF
skinparam nodeStyle rectangle

title Развёртывание (проектируемое)

node "CDN (Vercel)" as CDN {
  [Frontend SPA\n(React + Vite)] as FE
}

node "API Gateway\n(Nginx / Traefik)" as GW {
  [Reverse Proxy\n+ Rate Limiting\n+ TLS Termination]
}

node "Kubernetes Cluster" as K8s {
  node "Auth Service" as KAuth
  node "Vacancy Service" as KVac
  node "Application Service" as KApp
  node "Assessment Service" as KAssess
  node "Notification Service" as KNotif
  node "Analytics Service" as KAnal
}

node "Data Layer" as Data {
  database "PostgreSQL\n(Primary + Replica)" as PG
  database "Redis Cluster\n(Sessions + Cache)" as Redis
  database "S3 / MinIO\n(Files)" as S3
}

node "External Services" as Ext {
  [SMS Gateway] as SMS
  [Email Service] as Email
  [1С:ЗУП] as 1C
  [LMS / ЦОПП] as LMS
}

CDN --> GW : API requests
GW --> KAuth
GW --> KVac
GW --> KApp
GW --> KAssess
GW --> KNotif
GW --> KAnal

KAuth --> Redis
KAuth --> PG
KVac --> PG
KApp --> PG
KAssess --> PG
KNotif --> Redis
KAnal --> PG

KApp --> S3
KAssess --> S3

KAuth --> SMS : OTP
KNotif --> Email : Уведомления
KVac ..> 1C : Интеграция (план)
KAssess ..> LMS : Интеграция (план)

@enduml
```

---

## Приложение А. Справочник типов

### Перечисления (Enums)

| Тип | Значения |
|-----|---------|
| `Role` | `employee`, `employer` |
| `VacancyStatus` | `draft`, `active`, `paused`, `closed` |
| `ApplicationStatus` | `pending`, `invitation`, `interview`, `rejected` |
| `InterviewFormat` | `offline`, `online`, `phone` |
| `InterviewStatus` | `scheduled`, `confirmed`, `rescheduled`, `no_show`, `cancelled`, `completed` |
| `AssessmentStatus` | `assigned`, `completed`, `expired` |
| `NotificationType` | `new_response`, `assessment_completed`, `candidate_rejected`, `subscription`, `interview`, `invitation` |

### Основные интерфейсы

| Интерфейс | Назначение | Кол-во полей |
|-----------|-----------|:------------:|
| `User` | Пользователь системы | 8 |
| `Company` | Компания-работодатель | 8 |
| `Vacancy` | Вакансия | 20 |
| `VacancyTemplate` | Шаблон вакансии | 12 |
| `Candidate` | Кандидат (со стороны работодателя) | 11 |
| `Application` | Отклик соискателя | 7 |
| `EmployerApplication` | Отклик (со стороны работодателя) | 15 |
| `Interview` | Собеседование | 6 |
| `TimelineEvent` | Событие таймлайна | 5 |
| `Assessment` | Оценка компетенций | 10 |
| `DevelopmentTrack` | Трек развития | 6 |
| `Resume` | Резюме | 13 |
| `AppNotification` | Уведомление | 6 |
| `AppSettings` | Настройки | 7 |
| `SavedSearch` | Сохранённый поиск | 4 |
| `Certificate` | Сертификат | 4 |

---

## Приложение Б. Бизнес-логика этапов найма

### Единый шаблон этапов (после рефакторинга)

```
Отклик отправлен → Рассмотрение → Собеседование
                                    ↓
                                  Отказ
```

| Этап | Кто инициирует | Статус | Действие |
|------|---------------|--------|----------|
| Отклик отправлен | Соискатель | `pending` | Создание Application |
| Рассмотрение | Работодатель | `pending` → `invitation` | Просмотр профиля, решение |
| Собеседование | Работодатель | `interview` | Назначение даты/формата |
| Отказ | Работодатель | `rejected` | Авто-письмо: «Спасибо за ваш отклик. К сожалению, сейчас мы не готовы предложить вам эту вакансию.» |

### Воронка найма (аналитика)

| Этап | Кол-во (mock) |
|------|:------------:|
| Просмотры | 523 |
| Отклики | 31 |
| Рассмотрение пройдено | 18 |
| Собеседование | 7 |
| Собеседование пройдено | 5 |
| Найм | 3 |

---

## Приложение В. Константы и справочники

| Справочник | Значения |
|-----------|---------|
| **SPECIALTIES** (16) | Оператор ЧПУ, Сварщик, Наладчик оборудования, Слесарь-монтажник, ... |
| **ITR_SPECIALTIES** (10) | Инженер-конструктор, Инженер-технолог, Инженер-проектировщик, ... |
| **CATEGORIES** (8) | Машиностроение, Металлообработка, Нефтегазовая, Пищевое производство, ... |
| **ADMISSIONS** (6) | Электробезопасность II/III, Работы на высоте, Стропальщик, ... |
| **SHIFTS** (3) | 2/2, 5/2, Вахта |
| **GRADES** (6) | 1, 2, 3, 4, 5, 6 |
| **ITR_REQUIREMENTS** (7) | ЕСКД, ЕСТД, ГОСТ, Сапр, Грейд 5, Грейд 7, Грейд 8 |
| **CONSTRUCTOR_DEPARTMENTS** (12) | Цех №1, Цех №2, Цех №3, Отдел расчётов, ... |

---

*Документ подготовлен на основе анализа исходного кода проекта Т-Card. Все диаграммы PlantUML можно отрендерить через [plantuml.com](https://www.plantuml.com/plantuml/uml/) или локально через `plantuml` CLI.*
