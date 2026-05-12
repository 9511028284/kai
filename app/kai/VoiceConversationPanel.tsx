import { Headphones, Loader2, Mic, Volume2 } from "lucide-react";
import type { VoiceStatus } from "./types";
import { cn } from "./utils";

type VoiceConversationPanelProps = {
  voiceStatus: VoiceStatus;
  onStop: () => void;
};

export function VoiceConversationPanel({
  voiceStatus,
  onStop,
}: VoiceConversationPanelProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <div
        className={cn(
          "mb-6 flex h-40 w-40 items-center justify-center rounded-full border-4 bg-white shadow-xl",
          voiceStatus === "listening" && "border-emerald-400",
          voiceStatus === "thinking" && "border-amber-400",
          voiceStatus === "speaking" && "border-cyan-400",
          voiceStatus === "idle" && "border-stone-200"
        )}
      >
        {voiceStatus === "listening" ? (
          <Mic className="h-16 w-16 text-emerald-500" />
        ) : voiceStatus === "thinking" ? (
          <Loader2 className="h-16 w-16 animate-spin text-amber-500" />
        ) : voiceStatus === "speaking" ? (
          <Volume2 className="h-16 w-16 text-cyan-500" />
        ) : (
          <Headphones className="h-16 w-16 text-stone-500" />
        )}
      </div>

      <h2 className="mb-2 text-3xl font-semibold">
        {voiceStatus === "listening"
          ? "Listening..."
          : voiceStatus === "thinking"
          ? "KAI is thinking..."
          : voiceStatus === "speaking"
          ? "KAI is speaking..."
          : "Voice conversation active"}
      </h2>

      <p className="max-w-xl text-sm leading-6 text-stone-500">
        Speak naturally. KAI will listen, answer, and continue the conversation
        under your account.
      </p>

      <button
        type="button"
        onClick={onStop}
        className="mt-8 rounded-lg bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
      >
        Stop voice conversation
      </button>
    </div>
  );
}
