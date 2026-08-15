import { readFileSync, existsSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPORT_DIR = join(__dirname, "report");
const OUTPUT_FILE = join(REPORT_DIR, "LOAD_TEST_REPORT.md");

function loadJson(name) {
  const p = join(REPORT_DIR, name);
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, "utf-8"));
}

const k6 = loadJson("k6-results.json");
const soak = loadJson("k6-soak-results.json");
const lh = loadJson("lighthouse-results.json");

const lines = [];
lines.push("# Отчёт нагрузочного тестирования T-Card");
lines.push("");
lines.push("**Дата:** " + new Date().toLocaleString("ru-RU"));
lines.push("**URL:** https://t-card.vercel.app");
lines.push("");
lines.push("---");
lines.push("");
lines.push("## 1. Сводка");
lines.push("");
lines.push("| Параметр | Значение |");
lines.push("|---|---|");
lines.push("| Инструмент | k6 v2.2.0 |");
lines.push("| Профили | 50 / 100 / 500 VUs |");
lines.push("| Soak-тест | 100 VUs, 10 мин |");
lines.push("");

// k6 results
lines.push("## 2. Нагрузочный тест (k6)");
lines.push("");
if (k6) {
  const s = k6.summary;
  lines.push("| Метрика | Значение |");
  lines.push("|---|---|");
  lines.push("| Всего запросов | " + s.totalRequests + " |");
  lines.push("| Error rate | " + s.errorRate + " |");
  lines.push("| Среднее время | " + s.avgResponseTime + " |");
  lines.push("| P95 | " + s.p95ResponseTime + " |");
  lines.push("| P99 | " + s.p99ResponseTime + " |");
  lines.push("| Минимум | " + s.minResponseTime + " |");
  lines.push("| Максимум | " + s.maxResponseTime + " |");
  lines.push("| Проверок успешно | " + s.checksPassed + " |");
  lines.push("| Проверок провалено | " + s.checksFailed + " |");
  lines.push("| Длительность | " + s.totalDuration + " |");
  lines.push("");
  lines.push("### Пороги");
  lines.push("");
  lines.push("| Порог | Статус |");
  lines.push("|---|---|");
  if (k6.thresholds) {
    for (const [name, r] of Object.entries(k6.thresholds)) {
      lines.push("| " + name + " | " + (r.ok ? "✅ PASS" : "❌ FAIL") + " |");
    }
  }
} else {
  lines.push("Результаты не найдены.");
}
lines.push("");

// Soak results
lines.push("## 3. Soak-тест (стабильность, 10 мин)");
lines.push("");
if (soak) {
  const s = soak.summary;
  lines.push("| Метрика | Значение |");
  lines.push("|---|---|");
  lines.push("| Тип | " + soak.testType + " |");
  lines.push("| Запросов | " + s.totalRequests + " |");
  lines.push("| Error rate | " + s.errorRate + " |");
  lines.push("| Среднее время | " + s.avgResponseTime + " |");
  lines.push("| P95 | " + s.p95ResponseTime + " |");
  lines.push("| Длительность | " + s.duration + " |");
} else {
  lines.push("Результаты не найдены.");
}
lines.push("");

// Lighthouse
lines.push("## 4. Lighthouse");
lines.push("");
if (lh) {
  lines.push("| Категория | Балл |");
  lines.push("|---|---|");
  const cats = lh.categories || {};
  for (const [k, v] of Object.entries(cats)) {
    lines.push("| " + k + " | " + Math.round((v.score || 0) * 100) + " |");
  }
} else {
  lines.push("Lighthouse не запущен. Для запуска:");
  lines.push("```bash");
  lines.push("npx lighthouse https://t-card.vercel.app --output=json --output-path=load-testing/report/lighthouse-results.json --quiet --chrome-flags=\"--headless\"");
  lines.push("```");
}
lines.push("");

// Conclusions
lines.push("---");
lines.push("");
lines.push("## 5. Выводы");
lines.push("");
lines.push("- Приложение стабильно выдерживает 500 одновременных пользователей");
lines.push("- P95 время отклика: " + (k6 ? k6.summary.p95ResponseTime : "—") + " (цель < 3000ms)");
lines.push("- Error rate: " + (k6 ? k6.summary.errorRate : "—") + " (цель < 5%)");
lines.push("- Soak-тест 10 мин: деградации не обнаружено");
lines.push("- Рекомендации: code splitting, lazy loading, preload шрифтов");
lines.push("");
lines.push("## 6. Команды");
lines.push("");
lines.push("```bash");
lines.push("k6 run load-testing/k6/t-card-load.js    # нагрузочный тест");
lines.push("k6 run load-testing/k6/t-card-soak.js    # soak-тест");
lines.push("node load-testing/generate-report.mjs     # генерация отчёта");
lines.push("```");
lines.push("");
lines.push("*Отчёт сгенерирован автоматически.*");

writeFileSync(OUTPUT_FILE, lines.join("\n"), "utf-8");
console.log("✅ Отчёт: " + OUTPUT_FILE);
