import {
  Brain,
  CheckCircle2,
  Database,
  Globe2,
  Headphones,
  History,
  LogOut,
  MessageSquare,
  PhoneOff,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Volume2,
} from "lucide-react";
import type {
  BackendStatus,
  HistoryMessage,
  Profile,
  SidebarTab,
  SystemStatus,
  WebRetrieval,
} from "./types";
import { cn, formatTime, truncateText } from "./utils";

type SidebarProps = {
  isOpen: boolean;
  backendStatus: BackendStatus;
  isVoiceConversation: boolean;
  activeTab: SidebarTab;
  historyItems: HistoryMessage[];
  latestRetrieval: WebRetrieval | null;
  isAdmin: boolean;
  modelName: string;
  profile: Profile | null;
  assistantActivity: string;
  systemStatus: SystemStatus | null;
  messagesCount: number;
  onRefreshStatus: () => void;
  onNewChat: () => void;
  onStartVoiceConversation: () => void;
  onStopVoiceConversation: () => void;
  onTabChange: (tab: SidebarTab) => void;
  onUseHistoryPrompt: (prompt: string) => void;
  onSpeakLastReply: () => void;
  onClearScreen: () => void;
  onLogout: () => void;
};

export function Sidebar({
  isOpen,
  backendStatus,
  isVoiceConversation,
  activeTab,
  historyItems,
  latestRetrieval,
  isAdmin,
  modelName,
  profile,
  assistantActivity,
  systemStatus,
  messagesCount,
  onRefreshStatus,
  onNewChat,
  onStartVoiceConversation,
  onStopVoiceConversation,
  onTabChange,
  onUseHistoryPrompt,
  onSpeakLastReply,
  onClearScreen,
  onLogout,
}: SidebarProps) {
  const webProvider = systemStatus?.web?.provider || "auto";

  return (
    <aside
      className={cn(
        "hidden border-r border-stone-800 bg-[#121412] text-white transition-all duration-300 md:flex md:flex-col",
        isOpen ? "md:w-80" : "md:w-0 md:overflow-hidden"
      )}
    >
      <div className="flex h-full min-w-80 flex-col">
        <div className="border-b border-white/10 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400 text-stone-950">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">KAI</div>
                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      backendStatus === "online"
                        ? "animate-pulse bg-emerald-400"
                        : backendStatus === "checking"
                        ? "animate-pulse bg-amber-400"
                        : "bg-red-400"
                    )}
                  />
                  {backendStatus === "online"
                    ? "Live system"
                    : backendStatus === "checking"
                    ? "Checking"
                    : "Backend offline"}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onRefreshStatus}
              className="rounded-lg p-2 text-stone-400 transition hover:bg-white/10 hover:text-white"
              title="Refresh system"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onNewChat}
            className="mb-2 flex w-full items-center gap-3 rounded-lg border border-white/10 px-3 py-3 text-sm text-stone-100 transition hover:bg-white/10"
          >
            <Plus className="h-4 w-4" />
            New chat
          </button>

          <button
            type="button"
            onClick={
              isVoiceConversation
                ? onStopVoiceConversation
                : onStartVoiceConversation
            }
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition",
              isVoiceConversation
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-emerald-400 text-stone-950 hover:bg-emerald-300"
            )}
          >
            {isVoiceConversation ? (
              <>
                <PhoneOff className="h-4 w-4" />
                Stop voice conversation
              </>
            ) : (
              <>
                <Headphones className="h-4 w-4" />
                Start voice conversation
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 border-b border-white/10 p-3">
          <button
            type="button"
            onClick={() => onTabChange("history")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition",
              activeTab === "history"
                ? "bg-white text-stone-950"
                : "text-stone-400 hover:bg-white/10 hover:text-white"
            )}
          >
            <History className="h-3.5 w-3.5" />
            History
          </button>

          <button
            type="button"
            onClick={() => onTabChange("settings")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition",
              activeTab === "settings"
                ? "bg-white text-stone-950"
                : "text-stone-400 hover:bg-white/10 hover:text-white"
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Settings
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {activeTab === "history" ? (
            <div className="space-y-2">
              <div className="px-2 text-xs font-medium uppercase tracking-wide text-stone-500">
                Recent prompts
              </div>

              {historyItems.length === 0 ? (
                <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm leading-6 text-stone-400">
                  Your prompt history will appear here after you start asking
                  KAI.
                </div>
              ) : (
                historyItems.map((item) => (
                  <button
                    key={`${item.index}-${item.content}`}
                    type="button"
                    onClick={() => onUseHistoryPrompt(item.content)}
                    className="w-full rounded-lg px-3 py-2 text-left transition hover:bg-white/10"
                  >
                    <div className="mb-1 flex items-center gap-2 text-xs text-stone-500">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {formatTime(item.created_at)}
                    </div>
                    <div className="text-sm leading-5 text-stone-200">
                      {truncateText(item.content, 78)}
                    </div>
                  </button>
                ))
              )}

              {latestRetrieval && (
                <div className="mt-4 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3">
                  <div className="mb-1 flex items-center gap-2 text-xs font-medium text-emerald-200">
                    <Search className="h-3.5 w-3.5" />
                    Last web retrieval
                  </div>
                  <p className="text-xs leading-5 text-stone-300">
                    {truncateText(
                      latestRetrieval.query || "Source-backed answer",
                      88
                    )}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="px-2 text-xs font-medium uppercase tracking-wide text-stone-500">
                System settings
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Brain className="h-4 w-4 text-emerald-300" />
                    Intelligence
                  </div>
                  <span className="rounded-md bg-white/10 px-2 py-1 text-[11px] text-stone-300">
                    {isAdmin ? "Jarvis" : "GPT"}
                  </span>
                </div>
                <div className="space-y-2 text-xs text-stone-300">
                  <div className="flex items-center justify-between">
                    <span>Model</span>
                    <span className="text-white">{modelName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Role</span>
                    <span className="text-white">{profile?.role || "user"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Activity</span>
                    <span className="text-white">{assistantActivity}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                  <Globe2 className="h-4 w-4 text-cyan-300" />
                  Web fallback
                </div>
                <div className="space-y-2 text-xs text-stone-300">
                  <div className="flex items-center justify-between">
                    <span>Status</span>
                    <span className="text-white">
                      {systemStatus?.web?.enabled === false ? "Off" : "Auto"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Provider</span>
                    <span className="text-white">{webProvider}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Scrape pages</span>
                    <span className="text-white">
                      {systemStatus?.web?.scrape_page_count ?? 2}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Google CSE</span>
                    <span className="text-white">
                      {systemStatus?.web?.google_cse_configured
                        ? "Configured"
                        : "Optional"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <Database className="mb-2 h-4 w-4 text-amber-300" />
                  <div className="text-lg font-semibold">
                    {systemStatus?.memory?.total_messages ?? messagesCount}
                  </div>
                  <div className="text-xs text-stone-400">Memory items</div>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <CheckCircle2 className="mb-2 h-4 w-4 text-emerald-300" />
                  <div className="text-lg font-semibold">
                    {systemStatus?.tasks?.open_tasks ?? 0}
                  </div>
                  <div className="text-xs text-stone-400">Open tasks</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2 border-t border-white/10 p-3">
          <button
            type="button"
            onClick={onSpeakLastReply}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-stone-300 transition hover:bg-white/10 hover:text-white"
          >
            <Volume2 className="h-4 w-4" />
            Speak last reply
          </button>

          <button
            type="button"
            onClick={onClearScreen}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-stone-300 transition hover:bg-white/10 hover:text-white"
          >
            <Trash2 className="h-4 w-4" />
            Clear screen
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-300 transition hover:bg-red-400/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
