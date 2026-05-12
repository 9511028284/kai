import type { BackendStatus, ToolResult, WebRetrieval } from "./types";

export const quickPrompts = {
  admin: [
    "Make a TeenVerseHub 7-day growth plan",
    "Write a premium reel script for TeenVerseHub",
    "Search latest teen freelancing platform ideas",
    "Design a safe student project marketplace system",
  ],
  user: [
    "Explain this topic simply",
    "Help me write better content",
    "Debug my code",
    "Search the web and summarize sources",
  ],
};

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function truncateText(value: string, maxLength = 64) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3).trim()}...`;
}

export function formatTime(value?: string | null) {
  if (!value) return "Just now";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Just now";

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getWebRetrieval(
  toolResult?: ToolResult | null
): WebRetrieval | null {
  if (!toolResult) return null;

  if (toolResult.action === "web_retrieval") {
    return toolResult;
  }

  if (toolResult.web_retrieval) {
    return toolResult.web_retrieval;
  }

  return null;
}

export function getStatusClasses(status: BackendStatus) {
  if (status === "online") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "offline") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}
