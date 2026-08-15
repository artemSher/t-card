import http from "k6/http";
import { check, sleep, group } from "k6";
import { Trend, Rate } from "k6/metrics";

// ─── Soak test: длительная нагрузка 100 пользователей в течение 10 минут ──────
const BASE_URL = __ENV.BASE_URL || "https://t-card.vercel.app";
const pageLoadTime = new Trend("page_load_time", true);
const errorRate = new Rate("error_rate");

export const options = {
  scenarios: {
    soak: {
      executor: "constant-vus",
      vus: 100,
      duration: "10m",
      tags: { scenario: "soak_100" },
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<3000"],
    error_rate: ["rate<0.05"],
    http_req_failed: ["rate<0.05"],
  },
};

export default function () {
  group("Soak: главная страница", () => {
    const res = http.get(BASE_URL);
    const success = check(res, {
      "статус 200": (r) => r.status === 200,
      "содержит root div": (r) => r.body && r.body.includes("id=\"root\""),
    });
    errorRate.add(!success);
    pageLoadTime.add(res.timings.duration);
  });

  sleep(2);
}

export function handleSummary(data) {
  const m = data.metrics;
  const safe = (v, suffix = "") => (v != null ? v.toFixed(0) + suffix : "N/A");
  const safeRate = (v) => (v != null ? (v * 100).toFixed(2) + "%" : "N/A");
  const safeCount = (v) => (v != null ? String(v) : "N/A");

  return {
    "load-testing/report/k6-soak-results.json": JSON.stringify({
      testType: "Soak Test (10 минут, 100 VUs)",
      testDate: new Date().toISOString(),
      baseUrl: BASE_URL,
      summary: {
        totalRequests: safeCount(m.http_reqs?.values?.count),
        errorRate: safeRate(m.http_req_failed?.values?.rate),
        avgResponseTime: safe(m.http_req_duration?.values?.avg, "ms"),
        p95ResponseTime: safe(m.http_req_duration?.values?.["p(95)"], "ms"),
        p99ResponseTime: safe(m.http_req_duration?.values?.["p(99)"], "ms"),
        duration: ((data.state?.testRunDurationMs || 0) / 1000).toFixed(0) + "s",
      },
    }, null, 2),
  };
}
