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
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center sm:px-6">
      <div
        className={cn(
          "mb-5 flex h-32 w-32 items-center justify-center rounded-full border-4 bg-white shadow-xl sm:mb-6 sm:h-40 sm:w-40",
          voiceStatus === "listening" && "border-emerald-400",
          voiceStatus === "thinking" && "border-amber-400",
          voiceStatus === "speaking" && "border-cyan-400",
          voiceStatus === "idle" && "border-stone-200"
        )}
      >
        {voiceStatus === "listening" ? (
          <Mic className="h-12 w-12 text-emerald-500 sm:h-16 sm:w-16" />
        ) : voiceStatus === "thinking" ? (
          <Loader2 className="h-12 w-12 animate-spin text-amber-500 sm:h-16 sm:w-16" />
        ) : voiceStatus === "speaking" ? (
          <Volume2 className="h-12 w-12 text-cyan-500 sm:h-16 sm:w-16" />
        ) : (
          <Headphones className="h-12 w-12 text-stone-500 sm:h-16 sm:w-16" />
        )}
      </div>

      <h2 className="mb-2 text-2xl font-semibold sm:text-3xl">
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
        className="mt-6 rounded-lg bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600 sm:mt-8 sm:px-6"
      >
        Stop voice conversation
      </button>
    </div>
  );
}
