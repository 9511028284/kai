import { Globe2, Loader2, Menu, RefreshCw, Wifi, WifiOff } from "lucide-react";
import type { BackendStatus } from "./types";
import { cn, getStatusClasses } from "./utils";

type AppHeaderProps = {
  backendStatus: BackendStatus;
  isAdmin: boolean;
  email?: string | null;
  webProvider: string;
  onToggleSidebar: () => void;
  onRefreshStatus: () => void;
};

export function AppHeader({
  backendStatus,
  isAdmin,
  email,
  webProvider,
  onToggleSidebar,
  onRefreshStatus,
}: AppHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-stone-200 bg-white/95 px-4 backdrop-blur">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-950"
          title="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-sm font-semibold">
              {isAdmin ? "KAI Jarvis Mode" : "KAI GPT Mode"}
            </h1>
            <span className="hidden rounded-md bg-emerald-100 px-2 py-1 text-[11px] font-medium text-emerald-700 sm:inline-flex">
              TeenVerseHub context
            </span>
          </div>
          <p className="truncate text-xs text-stone-500">{email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={cn(
            "hidden items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs sm:flex",
            getStatusClasses(backendStatus)
          )}
        >
          {backendStatus === "online" ? (
            <Wifi className="h-3.5 w-3.5" />
          ) : backendStatus === "offline" ? (
            <WifiOff className="h-3.5 w-3.5" />
          ) : (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          )}
          Backend {backendStatus}
        </div>

        <div className="hidden items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs text-cyan-700 lg:flex">
          <Globe2 className="h-3.5 w-3.5" />
          Web {webProvider}
        </div>

        <button
          type="button"
          onClick={onRefreshStatus}
          className="rounded-lg border border-stone-200 bg-white p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-950"
          title="Refresh status"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
