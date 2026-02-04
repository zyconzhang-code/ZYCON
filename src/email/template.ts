import type { DailyReport, FundingEvent } from "../types.js";
import { truncateText } from "../utils/text.js";

function formatDate(date?: string) {
  if (!date) return "日期不详";
  const dt = new Date(date);
  if (Number.isNaN(dt.getTime())) return "日期不详";
  return dt.toISOString().slice(0, 10);
}

function renderOtherSources(event: FundingEvent) {
  if (!event.otherSources.length) return "";
  const links = event.otherSources
    .map((src) => `<a href="${src.url}" target="_blank" rel="noreferrer">${src.name}</a>`)
    .join(" / ");
  return `<div class="other-sources">其他来源(${event.otherSources.length})：${links}</div>`;
}

export function renderEmailHtml(report: DailyReport) {
  const { dateKey, domainCounts, total, maxAmountItem, highestRoundItem, items, errors } = report;
  const domainSummary = Object.entries(domainCounts)
    .map(([tag, count]) => `<span class="badge">${tag} ${count}</span>`)
    .join(" ");

  const maxAmount = maxAmountItem
    ? `${maxAmountItem.company ?? maxAmountItem.title} ${maxAmountItem.amountText ?? "未披露"}`
    : "未披露";
  const maxRound = highestRoundItem
    ? `${highestRoundItem.company ?? highestRoundItem.title} ${highestRoundItem.round ?? "未披露"}`
    : "未披露";

  const errorBlock = errors.length
    ? `<div class="errors"><strong>失败源：</strong>${errors
        .map((err) => `${err.sourceName} (${truncateText(err.message, 60)})`)
        .join("；")}</div>`
    : "";

  const cards = items.length
    ? items
        .map(
          (event, index) => `
      <div class="card">
        <div class="card-header">
          <div class="rank">#${index + 1}</div>
          <div class="title">
            <a href="${event.mainUrl}" target="_blank" rel="noreferrer">${event.title}</a>
          </div>
        </div>
        <div class="meta">
          <span>公司：${event.company ?? "未披露"}</span>
          <span>轮次：${event.round ?? "未披露"}</span>
          <span>金额：${event.amountText ?? "未披露"}</span>
          <span>时间：${formatDate(event.publishedAt)}</span>
        </div>
        <div class="meta">
          <span>投资方：${event.investors.length ? event.investors.join("、") : "未披露"}</span>
        </div>
        <div class="summary">${event.summary}</div>
        <ul class="bullets">
          ${event.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
        </ul>
        <div class="tags">
          ${event.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
        <div class="source">来源：${event.sourceName} | 多源验证：${event.sourceCount}</div>
        ${renderOtherSources(event)}
      </div>
    `
        )
        .join("")
    : `<div class="card"><div class="summary">今日暂无符合条件的融资新闻。</div></div>`;

  return `
  <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: "Helvetica Neue", Arial, sans-serif; background: #f6f7fb; color: #1f2937; }
        .container { max-width: 960px; margin: 0 auto; padding: 24px; }
        .header { background: linear-gradient(135deg, #0f172a, #1e293b); color: #fff; padding: 20px; border-radius: 12px; }
        .header h1 { margin: 0 0 6px 0; font-size: 22px; }
        .header .meta { font-size: 13px; opacity: 0.9; }
        .summary-card { background: #fff; border-radius: 12px; padding: 16px; margin-top: 16px; box-shadow: 0 6px 20px rgba(15, 23, 42, 0.08); }
        .summary-grid { display: flex; gap: 16px; flex-wrap: wrap; font-size: 14px; }
        .badge { display: inline-block; background: #eef2ff; color: #4338ca; padding: 4px 8px; border-radius: 999px; font-size: 12px; margin: 2px 6px 2px 0; }
        .card { background: #fff; border-radius: 12px; padding: 16px; margin-top: 16px; box-shadow: 0 6px 20px rgba(15, 23, 42, 0.06); }
        .card-header { display: flex; align-items: center; gap: 12px; }
        .rank { background: #0ea5e9; color: #fff; padding: 4px 10px; border-radius: 8px; font-weight: bold; }
        .title a { color: #0f172a; font-weight: 600; text-decoration: none; }
        .title a:hover { text-decoration: underline; }
        .meta { font-size: 13px; color: #475569; margin-top: 8px; display: flex; flex-wrap: wrap; gap: 12px; }
        .summary { margin-top: 10px; font-size: 14px; }
        .bullets { margin: 10px 0 0 0; padding-left: 18px; }
        .bullets li { margin-bottom: 6px; }
        .tags { margin-top: 10px; }
        .tag { display: inline-block; background: #fef9c3; color: #92400e; padding: 3px 8px; border-radius: 999px; font-size: 12px; margin-right: 6px; }
        .source { margin-top: 8px; font-size: 12px; color: #64748b; }
        .other-sources { margin-top: 6px; font-size: 12px; color: #94a3b8; }
        .errors { margin-top: 16px; font-size: 12px; color: #dc2626; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>一级市场融资日报</h1>
          <div class="meta">日期：${dateKey} | 共 ${total} 条 | Top ${items.length}</div>
        </div>

        <div class="summary-card">
          <div class="summary-grid">
            <div>领域分布：${domainSummary || "无"}</div>
            <div>最大单笔：${maxAmount}</div>
            <div>最高轮次：${maxRound}</div>
          </div>
        </div>

        ${cards}
        ${errorBlock}
      </div>
    </body>
  </html>
  `;
}

export function renderEmailText(report: DailyReport) {
  const lines: string[] = [];
  lines.push(`一级市场融资日报 (${report.dateKey})`);
  lines.push(`总条数：${report.total} | Top ${report.items.length}`);
  lines.push(`领域分布：${Object.entries(report.domainCounts)
    .map(([tag, count]) => `${tag}${count}`)
    .join(" ")}`);
  if (report.maxAmountItem) {
    lines.push(`最大单笔：${report.maxAmountItem.company ?? report.maxAmountItem.title} ${report.maxAmountItem.amountText ?? "未披露"}`);
  }
  if (report.highestRoundItem) {
    lines.push(`最高轮次：${report.highestRoundItem.company ?? report.highestRoundItem.title} ${report.highestRoundItem.round ?? "未披露"}`);
  }
  lines.push("\n详情：");
  if (!report.items.length) {
    lines.push("今日暂无符合条件的融资新闻。");
  }

  report.items.forEach((event, index) => {
    lines.push(`\n#${index + 1} ${event.title}`);
    lines.push(`公司：${event.company ?? "未披露"}`);
    lines.push(`轮次：${event.round ?? "未披露"}`);
    lines.push(`金额：${event.amountText ?? "未披露"}`);
    lines.push(`投资方：${event.investors.length ? event.investors.join("、") : "未披露"}`);
    lines.push(`摘要：${event.summary}`);
    event.bullets.forEach((bullet) => lines.push(`- ${bullet}`));
    lines.push(`领域：${event.tags.join("、")}`);
    lines.push(`时间：${formatDate(event.publishedAt)}`);
    lines.push(`来源：${event.sourceName}`);
    lines.push(`链接：${event.mainUrl}`);
    if (event.otherSources.length) {
      lines.push(`其他来源(${event.otherSources.length})：${event.otherSources.map((src) => src.url).join(" ")}`);
    }
  });

  if (report.errors.length) {
    lines.push("\n失败源：");
    report.errors.forEach((err) => {
      lines.push(`- ${err.sourceName}: ${err.message}`);
    });
  }

  return lines.join("\n");
}
