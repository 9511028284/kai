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
    <div className="flex flex-1 flex-col justify-center py-5 sm:py-10">
      <div className="mb-5 flex items-start gap-3 sm:mb-6 sm:items-center">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-stone-950 text-white sm:h-12 sm:w-12">
          {isAdmin ? (
            <ShieldCheck className="h-6 w-6" />
          ) : (
            <Sparkles className="h-6 w-6" />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">
            {isAdmin ? "Jarvis mode is ready, Kashif." : "How can I help you?"}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-stone-500">
            {isAdmin
              ? "TeenVerseHub context, web fallback, business strategy, scripts, code, and voice are online."
              : "Ask for writing, coding, research, ideas, explanations, or voice conversation."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
        <div className="rounded-lg border border-stone-200 bg-white p-3 sm:p-4">
          <Activity className="mb-2 h-5 w-5 text-emerald-600 sm:mb-3" />
          <div className="text-sm font-semibold">Live state</div>
          <p className="mt-1 hidden text-xs leading-5 text-stone-500 sm:block">
            {backendStatus === "online"
              ? "Backend, model route, and memory checks are active."
              : "Backend status needs attention."}
          </p>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-3 sm:p-4">
          <Globe2 className="mb-2 h-5 w-5 text-cyan-600 sm:mb-3" />
          <div className="text-sm font-semibold">Web fallback</div>
          <p className="mt-1 hidden text-xs leading-5 text-stone-500 sm:block">
            Auto search can ground public or current answers with sources.
          </p>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-3 sm:p-4">
          <Zap className="mb-2 h-5 w-5 text-amber-600 sm:mb-3" />
          <div className="text-sm font-semibold">Fast mode</div>
          <p className="mt-1 hidden text-xs leading-5 text-stone-500 sm:block">
            Shorter, direct answers first with deeper detail when useful.
          </p>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-3 sm:p-4">
          <Gauge className="mb-2 h-5 w-5 text-rose-600 sm:mb-3" />
          <div className="text-sm font-semibold">Execution</div>
          <p className="mt-1 hidden text-xs leading-5 text-stone-500 sm:block">
            Scripts, plans, code, and next actions are formatted for immediate
            use.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:mt-6 sm:grid-cols-2 sm:gap-3">
        <button
          type="button"
          onClick={onStartVoiceConversation}
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-left text-sm font-medium text-emerald-800 transition hover:border-emerald-300 sm:p-4"
        >
          <Headphones className="mb-2 h-5 w-5 sm:mb-3" />
          Start one-on-one voice conversation
        </button>

        {(isAdmin ? quickPrompts.admin : quickPrompts.user).map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onSendPrompt(prompt)}
            className="rounded-lg border border-stone-200 bg-white p-3 text-left text-sm leading-5 text-stone-700 transition hover:border-stone-300 hover:bg-stone-50 sm:p-4"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
