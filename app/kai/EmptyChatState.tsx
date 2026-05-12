import {
  Activity,
  Gauge,
  Globe2,
  Headphones,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import type { BackendStatus } from "./types";
import { quickPrompts } from "./utils";

type EmptyChatStateProps = {
  isAdmin: boolean;
  backendStatus: BackendStatus;
  onStartVoiceConversation: () => void;
  onSendPrompt: (prompt: string) => void;
};

export function EmptyChatState({
  isAdmin,
  backendStatus,
  onStartVoiceConversation,
  onSendPrompt,
}: EmptyChatStateProps) {
  return (
    <div className="flex flex-1 flex-col justify-center py-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-stone-950 text-white">
          {isAdmin ? (
            <ShieldCheck className="h-6 w-6" />
          ) : (
            <Sparkles className="h-6 w-6" />
          )}
        </div>
        <div>
          <h2 className="text-3xl font-semibold">
            {isAdmin ? "Jarvis mode is ready, Kashif." : "How can I help you?"}
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            {isAdmin
              ? "TeenVerseHub context, web fallback, business strategy, scripts, code, and voice are online."
              : "Ask for writing, coding, research, ideas, explanations, or voice conversation."}
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <Activity className="mb-3 h-5 w-5 text-emerald-600" />
          <div className="text-sm font-semibold">Live state</div>
          <p className="mt-1 text-xs leading-5 text-stone-500">
            {backendStatus === "online"
              ? "Backend, model route, and memory checks are active."
              : "Backend status needs attention."}
          </p>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <Globe2 className="mb-3 h-5 w-5 text-cyan-600" />
          <div className="text-sm font-semibold">Web fallback</div>
          <p className="mt-1 text-xs leading-5 text-stone-500">
            Auto search can ground public or current answers with sources.
          </p>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <Zap className="mb-3 h-5 w-5 text-amber-600" />
          <div className="text-sm font-semibold">Fast mode</div>
          <p className="mt-1 text-xs leading-5 text-stone-500">
            Shorter, direct answers first with deeper detail when useful.
          </p>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <Gauge className="mb-3 h-5 w-5 text-rose-600" />
          <div className="text-sm font-semibold">Execution</div>
          <p className="mt-1 text-xs leading-5 text-stone-500">
            Scripts, plans, code, and next actions are formatted for immediate
            use.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onStartVoiceConversation}
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-left text-sm font-medium text-emerald-800 transition hover:border-emerald-300"
        >
          <Headphones className="mb-3 h-5 w-5" />
          Start one-on-one voice conversation
        </button>

        {(isAdmin ? quickPrompts.admin : quickPrompts.user).map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onSendPrompt(prompt)}
            className="rounded-lg border border-stone-200 bg-white p-4 text-left text-sm text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
