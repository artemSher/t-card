import http from "k6/http";
import { check, sleep, group } from "k6";
import { Trend, Rate, Counter } from "k6/metrics";

// ─── Кастомные метрики ───────────────────────────────────────────────────────
const pageLoadTime = new Trend("page_load_time", true);
const errorRate = new Rate("error_rate");
const successfulRequests = new Counter("successful_requests");

// ─── URL приложения ──────────────────────────────────────────────────────────
const BASE_URL = __ENV.BASE_URL || "https://t-card.vercel.app";

// ─── Сценарии нагрузки ───────────────────────────────────────────────────────
export const options = {
  scenarios: {
    // Профиль 1: 50 пользователей, плавный рост
    light_load: {
      executor: "ramping-vus",
      exec: "loadTest",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 50 },
        { duration: "1m", target: 50 },
        { duration: "15s", target: 0 },
      ],
      gracefulRampDown: "10s",
      tags: { scenario: "light_50" },
    },
    // Профиль 2: 100 пользователей, плавный рост
    medium_load: {
      executor: "ramping-vus",
      exec: "loadTest",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 100 },
        { duration: "2m", target: 100 },
        { duration: "15s", target: 0 },
      ],
      startTime: "2m",
      gracefulRampDown: "10s",
      tags: { scenario: "medium_100" },
    },
    // Профиль 3: 500 пользователей, стресс-тест
    stress_load: {
      executor: "ramping-vus",
      exec: "loadTest",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 500 },
        { duration: "1m", target: 500 },
        { duration: "15s", target: 0 },
      ],
      startTime: "5m",
      gracefulRampDown: "15s",
      tags: { scenario: "stress_500" },
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<3000", "p(99)<5000"],
    error_rate: ["rate<0.05"],
    http_req_failed: ["rate<0.05"],
  },
};

// ─── Основной тест ───────────────────────────────────────────────────────────
export function loadTest() {
  group("Главная страница (RoleSelection)", () => {
    const res = http.get(BASE_URL);

    const success = check(res, {
      "статус 200": (r) => r.status === 200,
      "содержит root div": (r) => r.body && r.body.includes("id=\"root\""),
      "время < 2с": (r) => r.timings.duration < 2000,
    });

    errorRate.add(!success);
    if (success) successfulRequests.add(1);
    pageLoadTime.add(res.timings.duration);
  });

  sleep(1);

  group("Страница входа соискателя", () => {
    const res = http.get(`${BASE_URL}/`, {
      headers: { "Cache-Control": "no-cache" },
    });

    const success = check(res, {
      "статус 200": (r) => r.status === 200,
      "содержит root div": (r) => r.body && r.body.includes("id=\"root\""),
    });

    errorRate.add(!success);
    if (success) successfulRequests.add(1);
    pageLoadTime.add(res.timings.duration);
  });

  sleep(1);

  group("Страница входа работодателя", () => {
    const res = http.get(`${BASE_URL}/`, {
      headers: { "Cache-Control": "no-cache" },
    });

    const success = check(res, {
      "статус 200": (r) => r.status === 200,
      "содержит root div": (r) => r.body && r.body.includes("id=\"root\""),
    });

    errorRate.add(!success);
    if (success) successfulRequests.add(1);
    pageLoadTime.add(res.timings.duration);
  });

  sleep(1);

  group("Статические ресурсы (CSS bundle)", () => {
    const res = http.get(`${BASE_URL}/assets/index-C50w-Vhe.css`);

    const success = check(res, {
      "статус 200": (r) => r.status === 200,
    });

    errorRate.add(!success);
    if (success) successfulRequests.add(1);
    pageLoadTime.add(res.timings.duration);
  });

  sleep(1);
}

// ─── Отчёт после теста ───────────────────────────────────────────────────────
export function handleSummary(data) {
  const m = data.metrics;
  const safe = (v, suffix = "") => (v != null ? v.toFixed(0) + suffix : "N/A");
  const safeRate = (v) => (v != null ? (v * 100).toFixed(2) + "%" : "N/A");
  const safeCount = (v) => (v != null ? String(v) : "N/A");

  const report = {
    testDate: new Date().toISOString(),
    baseUrl: BASE_URL,
    summary: {
      totalRequests: safeCount(m.http_reqs?.values?.count),
      totalErrors: safeCount(m.http_req_failed?.values?.count),
      errorRate: safeRate(m.http_req_failed?.values?.rate),
      avgResponseTime: safe(m.http_req_duration?.values?.avg, "ms"),
      p95ResponseTime: safe(m.http_req_duration?.values?.["p(95)"], "ms"),
      p99ResponseTime: safe(m.http_req_duration?.values?.["p(99)"], "ms"),
      minResponseTime: safe(m.http_req_duration?.values?.min, "ms"),
      maxResponseTime: safe(m.http_req_duration?.values?.max, "ms"),
      totalDuration: ((data.state?.testRunDurationMs || 0) / 1000).toFixed(0) + "s",
      checksPassed: safeCount(m.checks?.values?.passes),
      checksFailed: safeCount(m.checks?.values?.fails),
    },
    thresholds: data.thresholds || {},
    raw: data,
  };

  return {
    "load-testing/report/k6-results.json": JSON.stringify(report, null, 2),
    stdout: textSummary(data),
  };
}

function textSummary(data) {
  const m = data.metrics;
  const safe = (v, suffix = "") => (v != null ? v.toFixed(0) + suffix : "N/A");
  const safeRate = (v) => (v != null ? (v * 100).toFixed(2) + "%" : "N/A");
  const safeCount = (v) => (v != null ? String(v) : "N/A");
  return `
╔══════════════════════════════════════════════════════════════╗
║          ОТЧЁТ НАГРУЗОЧНОГО ТЕСТИРОВАНИЯ T-CARD             ║
╠══════════════════════════════════════════════════════════════╣
║  URL: ${BASE_URL.padEnd(52)}║
║  Дата: ${new Date().toISOString().padEnd(52)}║
╠══════════════════════════════════════════════════════════════╣
║  ОСНОВНЫЕ МЕТРИКИ                                            ║
║  Всего запросов:     ${safeCount(m.http_reqs?.values?.count).padEnd(42)}║
║  Ошибок:             ${safeCount(m.http_req_failed?.values?.count).padEnd(42)}║
║  Error rate:         ${safeRate(m.http_req_failed?.values?.rate).padEnd(42)} ║
║  Успешных проверок:  ${safeCount(m.checks?.values?.passes).padEnd(42)}║
║  Провалено проверок: ${safeCount(m.checks?.values?.fails).padEnd(42)}║
╠══════════════════════════════════════════════════════════════╣
║  ВРЕМЯ ОТКЛИКА                                               ║
║  Среднее:            ${safe(m.http_req_duration?.values?.avg, "ms").padEnd(42)}║
║  Минимальное:        ${safe(m.http_req_duration?.values?.min, "ms").padEnd(42)}║
║  Максимальное:       ${safe(m.http_req_duration?.values?.max, "ms").padEnd(42)}║
║  P95:                ${safe(m.http_req_duration?.values?.["p(95)"], "ms").padEnd(42)}║
║  P99:                ${safe(m.http_req_duration?.values?.["p(99)"], "ms").padEnd(42)}║
╚══════════════════════════════════════════════════════════════╝
`;
}
