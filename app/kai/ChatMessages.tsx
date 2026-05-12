import type { RefObject } from "react";
import { Bot, Loader2, User } from "lucide-react";
import type { Message } from "./types";
import { cn } from "./utils";
import { SourceStrip } from "./SourceStrip";

type ChatMessagesProps = {
  messages: Message[];
  isSending: boolean;
  assistantActivity: string;
  bottomRef: RefObject<HTMLDivElement | null>;
};

export function ChatMessages({
  messages,
  isSending,
  assistantActivity,
  bottomRef,
}: ChatMessagesProps) {
  return (
    <div className="space-y-6 py-8">
      {messages.map((message, index) => (
        <div
          key={`${message.role}-${index}-${message.created_at || ""}`}
          className={cn(
            "flex gap-3",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          {message.role === "assistant" && (
            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-950 text-white">
              <Bot className="h-4 w-4" />
            </div>
          )}

          <div
            className={cn(
              "max-w-[85%]",
              message.role === "user" ? "order-1" : ""
            )}
          >
            <div
              className={cn(
                "whitespace-pre-wrap rounded-lg px-5 py-3 text-sm leading-7 shadow-sm",
                message.role === "user"
                  ? "bg-stone-950 text-white"
                  : "border border-stone-200 bg-white text-stone-900"
              )}
            >
              {message.content}
            </div>
            {message.role === "assistant" && (
              <SourceStrip toolResult={message.tool_result} />
            )}
          </div>

          {message.role === "user" && (
            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-stone-700 shadow-sm">
              <User className="h-4 w-4" />
            </div>
          )}
        </div>
      ))}

      {isSending && (
        <div className="flex gap-3">
          <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-950 text-white">
            <Bot className="h-4 w-4" />
          </div>

          <div className="rounded-lg border border-stone-200 bg-white px-5 py-3 text-sm text-stone-500 shadow-sm">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
              {assistantActivity}
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
