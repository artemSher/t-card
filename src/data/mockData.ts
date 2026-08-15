import type {
  Vacancy,
  Candidate,
  Application,
  ApplicationStatus,
  Assessment,
  DevelopmentTrack,
  Certificate,
  Resume,
  AppNotification,
  SavedSearch,
  AppSettings,
  User,
  VacancyStatus,
  Interview,
  InterviewStatus,
  InterviewFormat,
  TimelineEvent,
  PublicationChannel,
  Offer,
  OfferStatus,
  VacancyTemplate,
} from "@/types";

// ─── Design tokens (сохраняем из оригинала) ──────────────────────────────────
export const C = {
  green: "#00A77F",
  blue: "#007AFF",
  text: "#313131",
  sub: "#818c99",
  muted: "#3e3e3e",
  border: "#f2f2f5",
  bg: "#fdfdfd",
  card: "#ffffff",
  chip: "#f1f1f1",
  amber: "#F59E0B",
  red: "#EF4444",
  gray: "#959595",
};

export const F = {
  regular: "'Mont:Regular','Nunito',system-ui,sans-serif",
  semi: "'Mont:SemiBold','Nunito',system-ui,sans-serif",
  bold: "'Mont:Bold','Nunito',system-ui,sans-serif",
  light: "'Mont:Light','Nunito',system-ui,sans-serif",
  sfRound: "'SF Pro Rounded:Semibold',system-ui,sans-serif",
};

// ─── Специальности ───────────────────────────────────────────────────────────
export const SPECIALTIES = [
  "Оператор ЧПУ",
  "Сварщик",
  "Наладчик оборудования",
  "Слесарь-монтажник",
  "Мастер участка",
  "Инженер-конструктор",
  "Электромонтёр",
  "Токарь",
];

export const POPULAR_SPECIALTIES = [
  "Оператор ЧПУ",
  "Сварщик",
  "Наладчик оборудования",
  "Слесарь-монтажник",
  "Мастер участка",
  "Инженер-конструктор",
  "Электромонтёр",
  "Токарь",
];

export const CATEGORIES = ["Промышленность", "Демонтаж", "Стройка", "Сфера"];

export const ADMISSIONS = [
  "Электробезопасность II",
  "Электробезопасность III",
  "Работы на высоте",
  "Стропальщик",
  "Промышленная безопасность",
  "Газорезательные работы",
];

export const SHIFTS = ["2/2", "5/2", "Вахта"];

export const GRADES = [2, 3, 4, 5, 6];

// ─── Вакансии ────────────────────────────────────────────────────────────────
export const MOCK_VACANCIES: Vacancy[] = [
  {
    id: 1,
    company: "ПромТех Решения",
    title: "Оператор ЧПУ",
    city: "Екатеринбург",
    salaryFrom: 80000,
    salaryTo: 120000,
    experience: "Опыт 3 года",
    grade: 4,
    admissions: ["Электробезопасность II", "Работы на высоте"],
    shift: "2/2",
    department: "Цех №3 — участок наладки",
    description: "Наладка и обслуживание станков с ЧПУ. Работа по чертежам, контроль качества продукции. Предприятие обеспечивает спецодеждой и транспортом до площадки.",
    date: "17 января 20:18, 2025",
    views: 189,
    responses: 12,
    active: true,
    category: "Промышленность",
    rating: 4.8,
    reviewsCount: 48,
  },
  {
    id: 2,
    company: "УралМаш Строй",
    title: "Сварщик",
    city: "Челябинск",
    salaryFrom: 70000,
    salaryTo: 110000,
    experience: "Опыт 2 года",
    grade: 5,
    admissions: ["Электробезопасность III", "Газорезательные работы"],
    shift: "Вахта",
    department: "Сварочный участок",
    description: "Сварка металлоконструкций по ГОСТ. Ручная дуговая и полуавтоматическая сварка. Вахтовый метод 60/30, проживание предоставляется.",
    date: "16 января 14:00, 2025",
    views: 234,
    responses: 18,
    active: true,
    category: "Стройка",
    rating: 4.5,
    reviewsCount: 32,
  },
  {
    id: 3,
    company: "ПромТех Решения",
    title: "Наладчик оборудования",
    city: "Екатеринбург",
    salaryFrom: 90000,
    salaryTo: 140000,
    experience: "Опыт 5 лет",
    grade: 5,
    admissions: ["Электробезопасность III", "Промышленная безопасность"],
    shift: "5/2",
    department: "Цех №1 — ремонтный участок",
    description: "Наладка и ремонт промышленного оборудования. Чтение кинематических и гидравлических схем. Диагностика неисправностей, планово-предупредительный ремонт.",
    date: "15 января 09:30, 2025",
    views: 156,
    responses: 8,
    active: true,
    category: "Промышленность",
    rating: 4.8,
    reviewsCount: 48,
  },
  {
    id: 4,
    company: "СтройИнвест",
    title: "Слесарь-монтажник",
    city: "Пермь",
    salaryFrom: 55000,
    salaryTo: 85000,
    experience: "Опыт 1 год",
    grade: 3,
    admissions: ["Работы на высоте", "Стропальщик"],
    shift: "2/2",
    department: "Монтажный участок",
    description: "Монтаж металлоконструкций и технологического оборудования. Сборка узлов по чертежам, затяжка резьбовых соединений. Работа на строительной площадке.",
    date: "14 января 11:20, 2025",
    views: 98,
    responses: 5,
    active: true,
    category: "Стройка",
    rating: 4.2,
    reviewsCount: 15,
  },
  {
    id: 5,
    company: "ЭнергоСервис",
    title: "Электромонтёр",
    city: "Екатеринбург",
    salaryFrom: 65000,
    salaryTo: 100000,
    experience: "Опыт 3 года",
    grade: 4,
    admissions: ["Электробезопасность III", "Электробезопасность II"],
    shift: "5/2",
    department: "Электрослужба",
    description: "Обслуживание и ремонт электрооборудования до 1000В. Профилактические испытания, замер сопротивления изоляции. Дежурство по графику.",
    date: "13 января 16:45, 2025",
    views: 142,
    responses: 9,
    active: true,
    category: "Промышленность",
    rating: 4.6,
    reviewsCount: 27,
  },
  {
    id: 6,
    company: "МеталлоКонструкция",
    title: "Токарь",
    city: "Нижний Тагил",
    salaryFrom: 60000,
    salaryTo: 95000,
    experience: "Опыт 2 года",
    grade: 4,
    admissions: ["Электробезопасность II"],
    shift: "2/2",
    department: "Механический цех",
    description: "Токарная обработка деталей на универсальных станках. Работа по чертежам и эскизам, контроль размеров микрометром и штангенциркулем.",
    date: "12 января 08:00, 2025",
    views: 87,
    responses: 4,
    active: true,
    category: "Промышленность",
    rating: 4.3,
    reviewsCount: 19,
  },
  {
    id: 7,
    company: "УралМаш Строй",
    title: "Мастер участка",
    city: "Челябинск",
    salaryFrom: 100000,
    salaryTo: 150000,
    experience: "Опыт 5 лет",
    grade: 5,
    admissions: ["Промышленная безопасность", "Работы на высоте"],
    shift: "5/2",
    department: "Производственный участок №2",
    description: "Руководство производственным участком. Контроль выполнения плана, организация работы бригад, обеспечение требований охраны труда.",
    date: "11 января 10:15, 2025",
    views: 203,
    responses: 14,
    active: true,
    category: "Промышленность",
    rating: 4.5,
    reviewsCount: 32,
  },
  {
    id: 8,
    company: "ПромТех Решения",
    title: "Инженер-конструктор",
    city: "Екатеринбург",
    salaryFrom: 90000,
    salaryTo: 130000,
    experience: "Опыт 4 года",
    grade: 0,
    admissions: ["Промышленная безопасность"],
    shift: "5/2",
    department: "Конструкторское бюро",
    description: "Проектирование технологической оснастки и приспособлений. Работа в САПР, разработка чертежей и спецификаций. Сопровождение производства.",
    date: "10 января 13:30, 2025",
    views: 178,
    responses: 11,
    active: true,
    category: "Промышленность",
    rating: 4.8,
    reviewsCount: 48,
  },
];

// ─── Кандидаты ───────────────────────────────────────────────────────────────
export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: 1,
    name: "Иван Петров",
    specialty: "Оператор ЧПУ",
    grade: 5,
    gradeConfirmed: true,
    city: "Екатеринбург",
    experience: "6 лет",
    matchPercent: 95,
    admissions: ["Электробезопасность II", "Работы на высоте"],
    shift: "2/2",
    assessments: [
      { name: "Наладка оборудования", score: 95 },
      { name: "Чтение чертежей", score: 88 },
      { name: "Охрана труда", score: 96 },
      { name: "Программирование ЧПУ", score: 92 },
    ],
  },
  {
    id: 2,
    name: "Сергей Волков",
    specialty: "Сварщик",
    grade: 4,
    gradeConfirmed: true,
    city: "Челябинск",
    experience: "4 года",
    matchPercent: 82,
    admissions: ["Электробезопасность III", "Газорезательные работы"],
    shift: "Вахта",
    assessments: [
      { name: "Ручная дуговая сварка", score: 90 },
      { name: "Полуавтоматическая сварка", score: 85 },
      { name: "Чтение чертежей", score: 78 },
      { name: "Охрана труда", score: 88 },
    ],
  },
  {
    id: 3,
    name: "Дмитрий Соколов",
    specialty: "Наладчик оборудования",
    grade: 5,
    gradeConfirmed: true,
    city: "Екатеринбург",
    experience: "8 лет",
    matchPercent: 91,
    admissions: ["Электробезопасность III", "Промышленная безопасность"],
    shift: "5/2",
    assessments: [
      { name: "Наладка оборудования", score: 97 },
      { name: "Чтение кинематических схем", score: 94 },
      { name: "Гидравлика и пневматика", score: 90 },
      { name: "Охрана труда", score: 95 },
    ],
  },
  {
    id: 4,
    name: "Алексей Морозов",
    specialty: "Электромонтёр",
    grade: 4,
    gradeConfirmed: false,
    city: "Екатеринбург",
    experience: "3 года",
    matchPercent: 74,
    admissions: ["Электробезопасность II"],
    shift: "5/2",
    assessments: [
      { name: "Электрооборудование до 1000В", score: 82 },
      { name: "Измерительные приборы", score: 70 },
      { name: "Охрана труда", score: 85 },
      { name: "Чтение схем", score: 68 },
    ],
  },
  {
    id: 5,
    name: "Максим Кузнецов",
    specialty: "Токарь",
    grade: 4,
    gradeConfirmed: true,
    city: "Нижний Тагил",
    experience: "5 лет",
    matchPercent: 80,
    admissions: ["Электробезопасность II"],
    shift: "2/2",
    assessments: [
      { name: "Токарная обработка", score: 88 },
      { name: "Чтение чертежей", score: 82 },
      { name: "Измерительный инструмент", score: 90 },
      { name: "Охрана труда", score: 75 },
    ],
  },
];

// ─── Отклики сотрудника ──────────────────────────────────────────────────────
export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 1,
    vacancyId: 1,
    vacancyTitle: "Оператор ЧПУ",
    company: "ПромТех Решения",
    date: "17 января 2025",
    status: "interview",
    stages: [
      { name: "Отклик отправлен", date: "17 января 2025", done: true },
      { name: "Скрининг", date: "18 января 2025", done: true },
      { name: "Собеседование", date: "22 января 2025", done: false },
      { name: "Оффер", date: "", done: false },
    ],
  },
  {
    id: 2,
    vacancyId: 3,
    vacancyTitle: "Наладчик оборудования",
    company: "ПромТех Решения",
    date: "15 января 2025",
    status: "invitation",
    stages: [
      { name: "Отклик отправлен", date: "15 января 2025", done: true },
      { name: "Скрининг", date: "16 января 2025", done: true },
      { name: "Приглашение на собеседование", date: "17 января 2025", done: false },
      { name: "Собеседование", date: "", done: false },
    ],
  },
  {
    id: 3,
    vacancyId: 5,
    vacancyTitle: "Электромонтёр",
    company: "ЭнергоСервис",
    date: "13 января 2025",
    status: "pending",
    stages: [
      { name: "Отклик отправлен", date: "13 января 2025", done: true },
      { name: "Скрининг", date: "", done: false },
      { name: "Собеседование", date: "", done: false },
    ],
  },
  {
    id: 4,
    vacancyId: 2,
    vacancyTitle: "Сварщик",
    company: "УралМаш Строй",
    date: "10 января 2025",
    status: "rejected",
    stages: [
      { name: "Отклик отправлен", date: "10 января 2025", done: true },
      { name: "Скрининг", date: "11 января 2025", done: true },
      { name: "Отказ", date: "12 января 2025", done: true },
    ],
  },
];

// ─── Оценки ──────────────────────────────────────────────────────────────────
export const MOCK_ASSESSMENTS: Assessment[] = [
  {
    id: 1,
    title: "Тест на 5 разряд — Оператор ЧПУ",
    type: "test",
    duration: "45 минут",
    deadline: "25 января 2025",
    status: "assigned",
    questions: [
      {
        id: 1,
        text: "Какой инструмент используется для контроля шага резьбы?",
        options: ["Микрометр", "Штангенциркуль", "Шагомер", "Нутромер"],
        correctIndex: 2,
      },
      {
        id: 2,
        text: "Что означает код G01 в программе ЧПУ?",
        options: ["Быстрое перемещение", "Линейная интерполяция", "Круговая интерполяция", "Пауза"],
        correctIndex: 1,
      },
      {
        id: 3,
        text: "Какой угол заточки сверла по металлу?",
        options: ["60°", "90°", "118°", "150°"],
        correctIndex: 2,
      },
      {
        id: 4,
        text: "Допуск 0,02 мм — это какой квалитет точности?",
        options: ["IT5", "IT6", "IT7", "IT8"],
        correctIndex: 0,
      },
      {
        id: 5,
        text: "Что такое базирование детали при обработке?",
        options: [
          "Придание детали определённого положения относительно осей станка",
          "Закрепление детали в патроне",
          "Снятие припуска с поверхности",
          "Контроль шероховатости",
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 2,
    title: "Производственный кейс — Наладка станка",
    type: "case",
    duration: "60 минут",
    deadline: "28 января 2025",
    status: "assigned",
  },
  {
    id: 3,
    title: "Тест на 4 разряд — Сварщик",
    type: "test",
    duration: "40 минут",
    deadline: "15 января 2025",
    status: "completed",
    score: 87,
    confirmedGrade: 4,
    topics: [
      { name: "Ручная дуговая сварка", score: 90 },
      { name: "Полуавтоматическая сварка", score: 85 },
      { name: "Чтение чертежей", score: 78 },
      { name: "Охрана труда", score: 95 },
    ],
    weakZone: "Чтение чертежей",
  },
];

// ─── Треки развития ──────────────────────────────────────────────────────────
export const MOCK_TRACKS: DevelopmentTrack[] = [
  {
    id: 1,
    goal: "Оператор ЧПУ: 4 → 5 разряд",
    progress: 45,
    assignedByEmployer: true,
    deadline: "1 марта 2025",
    checkpoints: [
      { name: "Теория: Программирование ЧПУ", status: "done", date: "10 января 2025" },
      { name: "Практика: Наладка 3-осевого станка", status: "done", date: "15 января 2025" },
      { name: "Тест: Чтение сложных чертежей", status: "reminder", date: "25 января 2025" },
      { name: "Аттестация на 5 разряд", status: "planned", date: "1 марта 2025" },
    ],
    recommendedPrograms: [
      {
        id: 1,
        title: "Программирование ЧПУ: продвинутый уровень",
        duration: "40 часов",
        format: "Очно, ЦОПП",
        paidByEmployer: true,
        modulesProgress: 3,
        modulesTotal: 8,
      },
      {
        id: 2,
        title: "Чтение чертежей: сложные случаи",
        duration: "20 часов",
        format: "Онлайн",
        paidByEmployer: true,
        modulesProgress: 0,
        modulesTotal: 5,
      },
    ],
  },
];

// ─── Сертификаты ─────────────────────────────────────────────────────────────
export const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: 1,
    title: "Электробезопасность II группа",
    issueDate: "10 марта 2024",
    expiryDate: "10 марта 2026",
  },
  {
    id: 2,
    title: "Работы на высоте — 1 группа",
    issueDate: "5 мая 2024",
    expiryDate: "5 мая 2027",
  },
  {
    id: 3,
    title: "Оператор ЧПУ — 4 разряд",
    issueDate: "20 сентября 2023",
    expiryDate: "permanent",
  },
];

// ─── Резюме ──────────────────────────────────────────────────────────────────
export const MOCK_RESUMES: Resume[] = [
  {
    id: 1,
    specialty: "Оператор ЧПУ",
    experience: "Опыт 6 лет",
    salaryFrom: 90000,
    salaryTo: 130000,
    city: "Екатеринбург",
    active: true,
    updatedAt: "27 января 2025, 18:46",
    stats: { favorites: 60, responses: 50, views: 100 },
  },
  {
    id: 2,
    specialty: "Наладчик оборудования",
    experience: "Опыт 4 года",
    salaryFrom: 80000,
    salaryTo: 120000,
    city: "Екатеринбург",
    active: false,
    updatedAt: "15 января 2025, 12:30",
    stats: { favorites: 6, responses: 3, views: 6 },
  },
];

// ─── Уведомления ─────────────────────────────────────────────────────────────
export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: 1, type: "interview", text: "Приглашение на собеседование от ПромТех Решения", time: "14:30", dateGroup: "today", read: false },
  { id: 2, type: "new_response", text: "Новый отклик на вакансию «Оператор ЧПУ»", time: "11:15", dateGroup: "today", read: false },
  { id: 3, type: "assessment_completed", text: "Оценка «Тест на 4 разряд» пройдена — 87 баллов", time: "09:00", dateGroup: "today", read: true },
  { id: 4, type: "candidate_rejected", text: "УралМаш Строй отклонил отклик на вакансию «Сварщик»", time: "16:45", dateGroup: "yesterday", read: true },
  { id: 5, type: "subscription", text: "Новые вакансии по запросу «Оператор ЧПУ» в Екатеринбурге", time: "10:20", dateGroup: "yesterday", read: true },
];

// ─── Сохранённые поиски ──────────────────────────────────────────────────────
export const MOCK_SAVED_SEARCHES: SavedSearch[] = [
  { id: 1, query: "Оператор ЧПУ Екатеринбург", criteria: "Разряд 4+, 2/2, Екатеринбург", notifications: true },
  { id: 2, query: "Сварщик вахта", criteria: "Разряд 5+, Вахта, Челябинск", notifications: false },
];

// ─── Настройки по умолчанию ──────────────────────────────────────────────────
export const DEFAULT_SETTINGS: AppSettings = {
  pinEnabled: false,
  faceIdEnabled: false,
  touchIdEnabled: false,
  notificationsEnabled: true,
  phone: "+7 999 123-45-67",
  email: "ivan.petrov@example.com",
  name: "Иван Петров",
};

// ─── Пользователь по умолчанию ───────────────────────────────────────────────
export const DEFAULT_USER: User = {
  name: "Иван Петров",
  phone: "+7 999 123-45-67",
  role: "employee",
  specialty: "Оператор ЧПУ",
  grade: 4,
  city: "Екатеринбург",
};

// ─── История поиска ──────────────────────────────────────────────────────────
export const MOCK_SEARCH_HISTORY = [
  { id: 1, query: "Оператор ЧПУ", date: "17 января 2025" },
  { id: 2, query: "Наладчик оборудования Екатеринбург", date: "15 января 2025" },
  { id: 3, query: "Сварщик вахта", date: "12 января 2025" },
];

// ─── Журнал безопасности ─────────────────────────────────────────────────────
export const MOCK_SECURITY_LOG = [
  { id: 1, event: "Вход в систему", author: "Система", time: "17 января 2025, 14:30" },
  { id: 2, event: "Изменение прав доступа", author: "Иван Петров", time: "15 января 2025, 10:15" },
  { id: 3, event: "Неуспешный вход", author: "Система", time: "14 января 2025, 22:03" },
  { id: 4, event: "Выгрузка отчёта", author: "Иван Петров", time: "10 января 2025, 09:45" },
];

// ─── Интеграции ──────────────────────────────────────────────────────────────
export const MOCK_INTEGRATIONS = [
  { id: "1c", name: "1С:ЗУП", description: "Синхронизация сотрудников и зарплат", enabled: false },
  { id: "hrm", name: "HRM-система", description: "Управление персоналом предприятия", enabled: false },
  { id: "jobs", name: "Job-сайты", description: "Автоматическая публикация вакансий", enabled: true },
  { id: "lms", name: "LMS / ЦОПП", description: "Обучение и аттестация сотрудников", enabled: true },
];

// ─── Статусы ─────────────────────────────────────────────────────────────────
export const STATUS_COLORS: Record<string, string> = {
  success: C.green,
  pending: C.amber,
  rejected: C.red,
  neutral: C.gray,
};

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  pending: "Ожидание",
  invitation: "Приглашение",
  interview: "Собеседование",
  rejected: "Отклонено",
  offer: "Оффер",
  hired: "Нанят",
};

export const APPLICATION_STATUS_COLORS: Record<string, string> = {
  pending: C.amber,
  invitation: C.green,
  interview: C.blue,
  rejected: C.red,
  offer: C.green,
  hired: C.green,
};

// ─── Статусы вакансий ────────────────────────────────────────────────────────
export const VACANCY_STATUS_LABELS: Record<VacancyStatus, string> = {
  draft: "Черновик",
  active: "Активна",
  paused: "Пауза",
  closed: "Закрыта",
};

export const VACANCY_STATUS_COLORS: Record<VacancyStatus, string> = {
  draft: C.gray,
  active: C.green,
  paused: C.amber,
  closed: C.red,
};

// ─── Каналы публикации ───────────────────────────────────────────────────────
export const PUBLICATION_CHANNELS: { id: string; name: string }[] = [
  { id: "platform", name: "Платформа Т-Card" },
  { id: "hh", name: "hh.ru" },
  { id: "telegram", name: "Telegram-канал" },
  { id: "vk", name: "ВКонтакте" },
  { id: "avito", name: "Авито Работа" },
  { id: "referral", name: "Рекомендации сотрудников" },
];

// ─── Форматы собеседования ───────────────────────────────────────────────────
export const INTERVIEW_FORMAT_LABELS: Record<InterviewFormat, string> = {
  offline: "Очно",
  online: "Онлайн (видео)",
  phone: "Телефон",
};

// ─── Статусы собеседования ───────────────────────────────────────────────────
export const INTERVIEW_STATUS_LABELS: Record<InterviewStatus, string> = {
  scheduled: "Запланировано",
  confirmed: "Подтверждено",
  rescheduled: "Перенесено",
  no_show: "Не явился",
  cancelled: "Отменено",
  completed: "Завершено",
};

export const INTERVIEW_STATUS_COLORS: Record<InterviewStatus, string> = {
  scheduled: C.blue,
  confirmed: C.green,
  rescheduled: C.amber,
  no_show: C.red,
  cancelled: C.gray,
  completed: C.green,
};

// ─── Лейблы событий таймлайна ────────────────────────────────────────────────
export const TIMELINE_EVENT_LABELS: Record<string, string> = {
  application_created: "Отклик отправлен",
  status_changed: "Статус изменён",
  interview_scheduled: "Собеседование назначено",
  interview_confirmed: "Собеседование подтверждено",
  interview_rescheduled: "Собеседование перенесено",
  interview_no_show: "Кандидат не явился",
  interview_cancelled: "Собеседование отменено",
  interview_completed: "Собеседование завершено",
  offer_sent: "Оффер отправлен",
  offer_accepted: "Оффер принят",
  offer_declined: "Оффер отклонён",
  offer_expired: "Оффер истёк",
  hired: "Кандидат нанят",
  rejected: "Отклонено",
  comment: "Комментарий",
};

// ─── Статусы оффера ───────────────────────────────────────────────────────────
export const OFFER_STATUS_LABELS: Record<OfferStatus, string> = {
  sent: "Отправлен",
  accepted: "Принят",
  declined: "Отклонён",
  expired: "Истёк",
};

export const OFFER_STATUS_COLORS: Record<OfferStatus, string> = {
  sent: C.blue,
  accepted: C.green,
  declined: C.red,
  expired: C.gray,
};

// ─── Данные работодателя ─────────────────────────────────────────────────────

// Вакансии работодателя (созданные)
export const MOCK_EMPLOYER_VACANCIES: Vacancy[] = [
  {
    id: 101,
    company: "ПромТех Решения",
    title: "Оператор ЧПУ",
    city: "Екатеринбург",
    salaryFrom: 80000,
    salaryTo: 120000,
    experience: "Опыт 3 года",
    grade: 4,
    admissions: ["Электробезопасность II", "Работы на высоте"],
    shift: "2/2",
    department: "Цех №3 — участок наладки",
    description: "Наладка и обслуживание станков с ЧПУ. Работа по чертежам, контроль качества продукции.",
    date: "17 января 2025",
    views: 189,
    responses: 12,
    active: true,
    category: "Промышленность",
    rating: 4.8,
    reviewsCount: 48,
    vacancyStatus: "active",
    channels: [
      { id: "platform", name: "Платформа Т-Card", enabled: true, publishedAt: "17 января 2025" },
      { id: "hh", name: "hh.ru", enabled: true, publishedAt: "17 января 2025" },
      { id: "telegram", name: "Telegram-канал", enabled: false },
      { id: "vk", name: "ВКонтакте", enabled: false },
      { id: "avito", name: "Авито Работа", enabled: false },
      { id: "referral", name: "Рекомендации сотрудников", enabled: false },
    ],
  },
  {
    id: 102,
    company: "ПромТех Решения",
    title: "Наладчик оборудования",
    city: "Екатеринбург",
    salaryFrom: 90000,
    salaryTo: 140000,
    experience: "Опыт 5 лет",
    grade: 5,
    admissions: ["Электробезопасность III", "Промышленная безопасность"],
    shift: "5/2",
    department: "Цех №1 — ремонтный участок",
    description: "Наладка и ремонт промышленного оборудования. Чтение кинематических и гидравлических схем.",
    date: "15 января 2025",
    views: 156,
    responses: 8,
    active: true,
    category: "Промышленность",
    rating: 4.8,
    reviewsCount: 48,
    vacancyStatus: "active",
    channels: [
      { id: "platform", name: "Платформа Т-Card", enabled: true, publishedAt: "15 января 2025" },
      { id: "hh", name: "hh.ru", enabled: false },
      { id: "telegram", name: "Telegram-канал", enabled: true, publishedAt: "15 января 2025" },
      { id: "vk", name: "ВКонтакте", enabled: false },
      { id: "avito", name: "Авито Работа", enabled: false },
      { id: "referral", name: "Рекомендации сотрудников", enabled: false },
    ],
  },
  {
    id: 103,
    company: "ПромТех Решения",
    title: "Инженер-конструктор",
    city: "Екатеринбург",
    salaryFrom: 90000,
    salaryTo: 130000,
    experience: "Опыт 4 года",
    grade: 0,
    admissions: ["Промышленная безопасность"],
    shift: "5/2",
    department: "Конструкторское бюро",
    description: "Проектирование технологической оснастки и приспособлений. Работа в САПР.",
    date: "10 января 2025",
    views: 178,
    responses: 11,
    active: false,
    category: "Промышленность",
    rating: 4.8,
    reviewsCount: 48,
    vacancyStatus: "paused",
    channels: [
      { id: "platform", name: "Платформа Т-Card", enabled: true, publishedAt: "10 января 2025" },
      { id: "hh", name: "hh.ru", enabled: false },
      { id: "telegram", name: "Telegram-канал", enabled: false },
      { id: "vk", name: "ВКонтакте", enabled: false },
      { id: "avito", name: "Авито Работа", enabled: false },
      { id: "referral", name: "Рекомендации сотрудников", enabled: false },
    ],
  },
];

// Отклики на вакансии работодателя
export interface EmployerApplication {
  id: number;
  candidateName: string;
  candidateGrade: number;
  candidateGradeConfirmed: boolean;
  candidateCity: string;
  candidateExperience: string;
  matchPercent: number;
  vacancyId: number;
  vacancyTitle: string;
  date: string;
  status: ApplicationStatus;
  assessments: { name: string; score: number }[];
  admissions: string[];
  shift: string;
  interview?: Interview;
  offer?: Offer;
  timeline: TimelineEvent[];
}

export const MOCK_EMPLOYER_APPLICATIONS: EmployerApplication[] = [
  {
    id: 201,
    candidateName: "Иван Петров",
    candidateGrade: 5,
    candidateGradeConfirmed: true,
    candidateCity: "Екатеринбург",
    candidateExperience: "6 лет",
    matchPercent: 95,
    vacancyId: 101,
    vacancyTitle: "Оператор ЧПУ",
    date: "17 января 2025",
    status: "interview",
    assessments: [
      { name: "Наладка оборудования", score: 95 },
      { name: "Чтение чертежей", score: 88 },
      { name: "Охрана труда", score: 96 },
    ],
    admissions: ["Электробезопасность II", "Работы на высоте"],
    shift: "2/2",
    interview: {
      date: "22 января 2025",
      time: "14:00",
      format: "offline",
      address: "Екатеринбург, ул. Промышленная, 15, переговорная №3",
      comment: "Возьмите паспорт и удостоверение оператора ЧПУ",
      status: "scheduled",
    },
    timeline: [
      { id: 1, type: "application_created", author: "Иван Петров", timestamp: "17 января 2025, 18:30" },
      { id: 2, type: "status_changed", author: "Анна Смирнова", timestamp: "18 января 2025, 10:15", comment: "Скрининг пройден" },
      { id: 3, type: "interview_scheduled", author: "Анна Смирнова", timestamp: "18 января 2025, 11:00", comment: "Назначено собеседование на 22 января 14:00" },
    ],
  },
  {
    id: 202,
    candidateName: "Сергей Волков",
    candidateGrade: 4,
    candidateGradeConfirmed: true,
    candidateCity: "Челябинск",
    candidateExperience: "4 года",
    matchPercent: 82,
    vacancyId: 101,
    vacancyTitle: "Оператор ЧПУ",
    date: "16 января 2025",
    status: "invitation",
    assessments: [
      { name: "Наладка оборудования", score: 85 },
      { name: "Чтение чертежей", score: 78 },
      { name: "Охрана труда", score: 88 },
    ],
    admissions: ["Электробезопасность II"],
    shift: "2/2",
    timeline: [
      { id: 1, type: "application_created", author: "Сергей Волков", timestamp: "16 января 2025, 12:00" },
      { id: 2, type: "status_changed", author: "Анна Смирнова", timestamp: "17 января 2025, 09:30", comment: "Скрининг пройден, приглашаем на собеседование" },
    ],
  },
  {
    id: 203,
    candidateName: "Дмитрий Соколов",
    candidateGrade: 5,
    candidateGradeConfirmed: true,
    candidateCity: "Екатеринбург",
    candidateExperience: "8 лет",
    matchPercent: 91,
    vacancyId: 102,
    vacancyTitle: "Наладчик оборудования",
    date: "15 января 2025",
    status: "pending",
    assessments: [
      { name: "Наладка оборудования", score: 97 },
      { name: "Чтение кинематических схем", score: 94 },
      { name: "Охрана труда", score: 95 },
    ],
    admissions: ["Электробезопасность III", "Промышленная безопасность"],
    shift: "5/2",
    timeline: [
      { id: 1, type: "application_created", author: "Дмитрий Соколов", timestamp: "15 января 2025, 14:20" },
    ],
  },
  {
    id: 204,
    candidateName: "Алексей Морозов",
    candidateGrade: 4,
    candidateGradeConfirmed: false,
    candidateCity: "Екатеринбург",
    candidateExperience: "3 года",
    matchPercent: 74,
    vacancyId: 102,
    vacancyTitle: "Наладчик оборудования",
    date: "14 января 2025",
    status: "pending",
    assessments: [
      { name: "Электрооборудование", score: 82 },
      { name: "Измерительные приборы", score: 70 },
      { name: "Охрана труда", score: 85 },
    ],
    admissions: ["Электробезопасность II"],
    shift: "5/2",
    timeline: [
      { id: 1, type: "application_created", author: "Алексей Морозов", timestamp: "14 января 2025, 16:45" },
    ],
  },
  {
    id: 205,
    candidateName: "Максим Кузнецов",
    candidateGrade: 4,
    candidateGradeConfirmed: true,
    candidateCity: "Нижний Тагил",
    candidateExperience: "5 лет",
    matchPercent: 80,
    vacancyId: 101,
    vacancyTitle: "Оператор ЧПУ",
    date: "13 января 2025",
    status: "rejected",
    assessments: [
      { name: "Токарная обработка", score: 88 },
      { name: "Чтение чертежей", score: 82 },
      { name: "Охрана труда", score: 75 },
    ],
    admissions: ["Электробезопасность II"],
    shift: "2/2",
    timeline: [
      { id: 1, type: "application_created", author: "Максим Кузнецов", timestamp: "13 января 2025, 11:00" },
      { id: 2, type: "rejected", author: "Анна Смирнова", timestamp: "14 января 2025, 10:30", comment: "Не соответствует требованиям по разряду" },
    ],
  },
];

// Компания
export const MOCK_COMPANY = {
  name: "ПромТех Решения",
  inn: "6678001234",
  industry: "Машиностроение",
  size: "50–200 человек",
  address: "Екатеринбург, ул. Промышленная, 15",
  departments: ["Цех №1 — ремонтный участок", "Цех №3 — участок наладки", "Конструкторское бюро", "Электрослужба"],
  verified: true,
  rating: 4.8,
  reviewsCount: 48,
};

// Аналитика
export const MOCK_ANALYTICS = {
  // По дням
  viewsByDay: [
    { day: "12 янв", views: 45, responses: 3 },
    { day: "13 янв", views: 52, responses: 4 },
    { day: "14 янв", views: 38, responses: 2 },
    { day: "15 янв", views: 67, responses: 5 },
    { day: "16 янв", views: 89, responses: 7 },
    { day: "17 янв", views: 112, responses: 9 },
    { day: "18 янв", views: 76, responses: 4 },
  ],
  // По вакансиям
  topVacancies: [
    { title: "Оператор ЧПУ", views: 189, responses: 12, conversion: 6.3 },
    { title: "Наладчик оборудования", views: 156, responses: 8, conversion: 5.1 },
    { title: "Инженер-конструктор", views: 178, responses: 11, conversion: 6.2 },
  ],
  // Воронка
  funnel: [
    { stage: "Просмотры", count: 523 },
    { stage: "Отклики", count: 31 },
    { stage: "Скрининг пройден", count: 18 },
    { stage: "Собеседование", count: 7 },
    { stage: "Оффер", count: 3 },
  ],
  // Источники
  sources: [
    { name: "Поиск на платформе", percent: 65 },
    { name: "Рекомендации", percent: 20 },
    { name: "Сохранённые запросы", percent: 15 },
  ],
};

// Уведомления работодателя
export const MOCK_EMPLOYER_NOTIFICATIONS: AppNotification[] = [
  { id: 101, type: "new_response", text: "Новый отклик: Иван Петров на вакансию «Оператор ЧПУ»", time: "14:30", dateGroup: "today", read: false },
  { id: 102, type: "new_response", text: "Новый отклик: Дмитрий Соколов на вакансию «Наладчик оборудования»", time: "11:15", dateGroup: "today", read: false },
  { id: 103, type: "assessment_completed", text: "Сергей Волков прошёл оценку — 85 баллов", time: "09:00", dateGroup: "today", read: true },
  { id: 104, type: "subscription", text: "Подписка на вакансии истекает через 5 дней", time: "16:45", dateGroup: "yesterday", read: true },
];

// Пользователь-работодатель по умолчанию
export const DEFAULT_EMPLOYER_USER: User = {
  name: "Анна Смирнова",
  phone: "+7 999 555-12-34",
  role: "employer",
};

// Настройки работодателя по умолчанию
export const DEFAULT_EMPLOYER_SETTINGS: AppSettings = {
  pinEnabled: false,
  faceIdEnabled: false,
  touchIdEnabled: false,
  notificationsEnabled: true,
  phone: "+7 999 555-12-34",
  email: "hr@promtech.ru",
  name: "Анна Смирнова",
};

// ─── Шаблоны вакансий ─────────────────────────────────────────────────────────
export const MOCK_VACANCY_TEMPLATES: VacancyTemplate[] = [
  {
    id: 1,
    title: "Оператор ЧПУ",
    category: "Промышленность",
    city: "Екатеринбург",
    salaryFrom: 80000,
    salaryTo: 120000,
    experience: "Опыт 3 года",
    grade: 4,
    admissions: ["Электробезопасность II", "Работы на высоте"],
    shift: "2/2",
    department: "Цех №3 — участок наладки",
    description: "Наладка и обслуживание станков с ЧПУ. Работа по чертежам, контроль качества продукции.",
    createdAt: "10 января 2025",
  },
  {
    id: 2,
    title: "Наладчик оборудования",
    category: "Промышленность",
    city: "Екатеринбург",
    salaryFrom: 90000,
    salaryTo: 140000,
    experience: "Опыт 5 лет",
    grade: 5,
    admissions: ["Электробезопасность III", "Промышленная безопасность"],
    shift: "5/2",
    department: "Цех №1 — ремонтный участок",
    description: "Наладка и ремонт промышленного оборудования. Чтение кинематических и гидравлических схем.",
    createdAt: "10 января 2025",
  },
  {
    id: 3,
    title: "Сварщик",
    category: "Промышленность",
    city: "Екатеринбург",
    salaryFrom: 70000,
    salaryTo: 110000,
    experience: "Опыт 2 года",
    grade: 4,
    admissions: ["Электробезопасность II", "Промышленная безопасность", "Работы на высоте"],
    shift: "2/2",
    department: "Цех №2 — сварочный участок",
    description: "Ручная дуговая и полуавтоматическая сварка. Работа по чертежам и технологическим картам.",
    createdAt: "12 января 2025",
  },
  {
    id: 4,
    title: "Инженер-конструктор",
    category: "Промышленность",
    city: "Екатеринбург",
    salaryFrom: 90000,
    salaryTo: 130000,
    experience: "Опыт 4 года",
    grade: 0,
    admissions: ["Промышленная безопасность"],
    shift: "5/2",
    department: "Конструкторское бюро",
    description: "Проектирование технологической оснастки и приспособлений. Работа в САПР.",
    createdAt: "12 января 2025",
  },
  {
    id: 5,
    title: "Слесарь-ремонтник",
    category: "Промышленность",
    city: "Екатеринбург",
    salaryFrom: 60000,
    salaryTo: 95000,
    experience: "Опыт 2 года",
    grade: 4,
    admissions: ["Электробезопасность II"],
    shift: "5/2",
    department: "Цех №1 — ремонтный участок",
    description: "Ремонт и обслуживание промышленного оборудования. Замена узлов и деталей, регулировка механизмов.",
    createdAt: "14 января 2025",
  },
];
