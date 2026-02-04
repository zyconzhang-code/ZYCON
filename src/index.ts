import cron from "node-cron";
import config from "./config/index.js";
import { fetchAllSources } from "./sources/index.js";
import { processArticles } from "./pipeline/index.js";
import { enrichArticles } from "./pipeline/enrich.js";
import { saveRawArticles, saveEvents, getEventsByDate, markSent, getSentEventIds, saveRunLog, getRunLog } from "./storage/dao.js";
import { buildDailyReport } from "./report.js";
import { renderEmailHtml, renderEmailText } from "./email/template.js";
import { sendEmail } from "./email/sender.js";
import { nowInZone, toDateKey } from "./utils/date.js";
import { logger } from "./utils/logger.js";

async function fetchAndProcess(dateKey: string) {
  const { items, errors } = await fetchAllSources();
  const enriched = await enrichArticles(items);
  saveRawArticles(enriched);
  const events = await processArticles(enriched, dateKey);
  saveEvents(events);
  const status = errors.length ? "partial" : "ok";
  saveRunLog(dateKey, status, errors);
  return { events, errors };
}

async function sendReport(dateKey: string) {
  const events = getEventsByDate(dateKey);
  const runLog = getRunLog(dateKey);
  const sentIds = getSentEventIds(dateKey);

  if (sentIds.length) {
    logger.warn("该日期已发送过日报，跳过发送。");
    return;
  }

  const report = buildDailyReport(events, runLog?.errors ?? [], dateKey);
  const subject = `${config.subjectPrefix}${dateKey} | ${config.subjectTags.join("/")}`;
  const html = renderEmailHtml(report);
  const text = renderEmailText(report);

  await sendEmail(subject, html, text);
  markSent(report.items.map((item) => item.id), dateKey);
  logger.info("邮件发送完成", { dateKey, count: report.items.length });
}

async function runOnce() {
  const dateKey = toDateKey(nowInZone(config.timezone), config.timezone);
  const { events, errors } = await fetchAndProcess(dateKey);
  const report = buildDailyReport(events, errors, dateKey);
  const subject = `${config.subjectPrefix}${dateKey} | ${config.subjectTags.join("/")}`;
  const html = renderEmailHtml(report);
  const text = renderEmailText(report);
  await sendEmail(subject, html, text);
  markSent(report.items.map((item) => item.id), dateKey);
  logger.info("一次性任务完成", { dateKey, count: report.items.length });
}

function schedule() {
  logger.info("启动定时任务", { schedule: config.cronSchedule, timezone: config.timezone });
  cron.schedule(
    config.cronSchedule,
    () => {
      runOnce().catch((error) => logger.error("定时任务失败", error));
    },
    { timezone: config.timezone }
  );
}

const command = process.argv[2] ?? "schedule";

switch (command) {
  case "fetch": {
    const dateKey = toDateKey(nowInZone(config.timezone), config.timezone);
    fetchAndProcess(dateKey)
      .then((result) => logger.info("抓取完成", { count: result.events.length }))
      .catch((error) => logger.error("抓取失败", error));
    break;
  }
  case "send": {
    const dateKey = toDateKey(nowInZone(config.timezone), config.timezone);
    sendReport(dateKey).catch((error) => logger.error("发送失败", error));
    break;
  }
  case "run-once": {
    runOnce().catch((error) => logger.error("执行失败", error));
    break;
  }
  case "schedule":
  default:
    schedule();
    break;
}
