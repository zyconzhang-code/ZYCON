import config from "../config/index.js";
import type { FundingEvent } from "../types.js";
import { splitSentences, truncateText, normalizeWhitespace } from "../utils/text.js";

async function summarizeWithLLM(event: FundingEvent) {
  if (!config.llm.provider || !config.llm.apiKey) return null;
  const baseUrl = config.llm.baseUrl ?? "https://api.openai.com/v1";
  const model = config.llm.model ?? "gpt-4o-mini";

  const prompt = `你是一级市场融资新闻摘要助手。根据以下信息生成摘要，输出严格JSON格式：{"summary":"...","bullets":["","..."]}。
要求：summary 30-60字，bullets 2-4条，中文输出。
信息：\n标题：${event.title}\n公司：${event.company ?? "未知"}\n轮次：${event.round ?? "未披露"}\n金额：${event.amountText ?? "未披露"}\n投资方：${event.investors.join("、") || "未披露"}\n领域：${event.tags.join("、")}\n来源：${event.sourceName}`;

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.llm.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "你是资深投融资新闻编辑。" },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    })
  });

  if (!res.ok) {
    throw new Error(`LLM HTTP ${res.status}`);
  }
  const json = (await res.json()) as any;
  const content = json.choices?.[0]?.message?.content ?? "";
  try {
    const parsed = JSON.parse(content);
    if (parsed.summary && Array.isArray(parsed.bullets)) {
      return {
        summary: String(parsed.summary),
        bullets: parsed.bullets.map((item: string) => String(item)).slice(0, 4)
      };
    }
  } catch {
    return null;
  }
  return null;
}

function ruleSummary(event: FundingEvent) {
  const company = event.company ?? "该公司";
  const round = event.round ? `完成${event.round}` : "获得融资";
  const amount = event.amountText ? `，金额${event.amountText}` : "";
  const investors = event.investors.length ? `，投资方包括${event.investors.slice(0, 4).join("、")}` : "";
  const tags = event.tags.length ? `，聚焦${event.tags.join("、")}` : "";
  let summary = normalizeWhitespace(`${company}${round}${amount}${investors}${tags}。`);

  if (summary.length < 30) {
    const sentences = splitSentences(`${event.title} ${event.summary}`);
    if (sentences.length) {
      summary = normalizeWhitespace(`${summary} ${sentences[0]}`);
    }
  }
  summary = truncateText(summary, 80);

  const bullets: string[] = [];
  if (event.round || event.amountText) {
    bullets.push(`融资轮次：${event.round ?? "未披露"}；金额：${event.amountText ?? "未披露"}`);
  }
  if (event.investors.length) {
    bullets.push(`投资方：${event.investors.slice(0, 6).join("、")}`);
  }
  if (event.tags.length) {
    bullets.push(`领域标签：${event.tags.join("、")}`);
  }
  bullets.push(`来源：${event.sourceName}；多源验证：${event.sourceCount}家`);

  return { summary, bullets: bullets.slice(0, 4) };
}

export async function summarizeEvents(events: FundingEvent[]) {
  for (const event of events) {
    try {
      const llm = await summarizeWithLLM(event);
      if (llm) {
        event.summary = llm.summary;
        event.bullets = llm.bullets;
        continue;
      }
    } catch {
      // fall back to rules
    }
    const rules = ruleSummary(event);
    event.summary = rules.summary;
    event.bullets = rules.bullets;
  }
  return events;
}
