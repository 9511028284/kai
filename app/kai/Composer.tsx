import {
  AlertTriangle,
  Clock3,
  Cpu,
  Globe2,
  Loader2,
  Mic,
  MicOff,
  Radio,
  Send,
} from "lucide-react";
import type { BackendStatus } from "./types";
import { cn, formatTime } from "./utils";

type ComposerProps = {
  assistantActivity: string;
  modelName: string;
  webProvider: string;
  lastSyncAt: string | null;
  backendStatus: BackendStatus;
  isAdmin: boolean;
  isListening: boolean;
  input: string;
  isSending: boolean;
  onStartVoiceDictation: () => void;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
};

export function Composer({
  assistantActivity,
  modelName,
  webProvider,
  lastSyncAt,
  backendStatus,
  isAdmin,
  isListening,
  input,
  isSending,
  onStartVoiceDictation,
  onInputChange,
  onSendMessage,
}: ComposerProps) {
  return (
    <div className="border-t border-stone-200 bg-white px-4 py-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-stone-500">
          <span className="flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5 text-emerald-600" />
            {assistantActivity}
          </span>
          <span className="hidden sm:inline">/</span>
          <span className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5" />
            {modelName}
          </span>
          <span className="hidden sm:inline">/</span>
          <span className="flex items-center gap-1.5">
            <Globe2 className="h-3.5 w-3.5" />
            Web fallback {webProvider}
          </span>
          {lastSyncAt && (
            <>
              <span className="hidden sm:inline">/</span>
              <span className="flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                Synced {formatTime(lastSyncAt)}
              </span>
            </>
          )}
        </div>

        {backendStatus === "offline" && (
          <div className="mb-2 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            <AlertTriangle className="h-4 w-4" />
            Backend is offline. Start FastAPI on port 8000 to chat.
          </div>
        )}

        <div className="rounded-lg border border-stone-200 bg-stone-50 p-2 shadow-sm">
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={onStartVoiceDictation}
              className={cn(
                "rounded-lg p-3 transition",
                isListening
                  ? "bg-red-500 text-white"
                  : "text-stone-500 hover:bg-white hover:text-stone-950"
              )}
              title="Voice dictation"
            >
              {isListening ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </button>

            <textarea
              value={input}
              onChange={(event) => onInputChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  onSendMessage();
                }
              }}
              placeholder={
                isListening
                  ? "Listening..."
                  : "Message KAI, or ask it to search the web..."
              }
              rows={1}
              className="max-h-40 min-h-12 flex-1 resize-none bg-transparent px-2 py-3 text-sm leading-6 text-stone-950 outline-none placeholder:text-stone-400"
            />

            <button
              type="button"
              onClick={onSendMessage}
              disabled={isSending || !input.trim()}
              className="rounded-lg bg-stone-950 p-3 text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40"
              title="Send"
            >
              {isSending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <p className="mt-2 text-center text-xs text-stone-500">
          {isAdmin
            ? "Admin Jarvis mode. Web retrieval is read-only; Mac and destructive tools still require approval."
            : "Team GPT mode. Web retrieval is read-only and chat stays under your account."}
        </p>
      </div>
    </div>
  );
}
