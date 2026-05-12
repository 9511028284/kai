import { Bot, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";

type AuthScreenProps = {
  authEmail: string;
  authPassword: string;
  authMode: "login" | "signup";
  authError: string;
  isAuthLoading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onAuthModeToggle: () => void;
  onSubmit: () => void;
};

export function AuthScreen({
  authEmail,
  authPassword,
  authMode,
  authError,
  isAuthLoading,
  onEmailChange,
  onPasswordChange,
  onAuthModeToggle,
  onSubmit,
}: AuthScreenProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f1ec] px-4 py-8 text-stone-950">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-stone-200 bg-white shadow-xl md:grid-cols-[1fr_420px]">
        <section className="hidden bg-[#121412] p-10 text-white md:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400 text-stone-950">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">KAI Command Center</div>
              <div className="text-xs text-stone-400">Private AI workspace</div>
            </div>
          </div>

          <h1 className="max-w-lg text-4xl font-semibold leading-tight">
            Role-based AI for TeenVerseHub, strategy, scripts, code, and research.
          </h1>

          <div className="mt-10 grid gap-3">
            <div className="rounded-lg border border-emerald-400/25 bg-emerald-400/10 p-4">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-emerald-200">
                <ShieldCheck className="h-4 w-4" />
                Admin Jarvis Mode
              </div>
              <p className="text-sm leading-6 text-stone-300">
                Private founder context, TeenVerseHub planning, voice, tasks,
                and operational thinking.
              </p>
            </div>

            <div className="rounded-lg border border-cyan-400/25 bg-cyan-400/10 p-4">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-cyan-200">
                <Bot className="h-4 w-4" />
                Team GPT Mode
              </div>
              <p className="text-sm leading-6 text-stone-300">
                Clean assistant mode for writing, coding, questions, ideas, and
                web-grounded summaries.
              </p>
            </div>
          </div>
        </section>

        <section className="p-6 sm:p-8">
          <div className="mb-8">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-stone-950 text-white">
              <Lock className="h-5 w-5" />
            </div>

            <h2 className="text-2xl font-semibold">
              {authMode === "login" ? "Login to KAI" : "Create KAI account"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              Secure Supabase authentication for admin and team access.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-stone-600">
                Email
              </span>
              <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-4">
                <Mail className="h-4 w-4 text-stone-400" />
                <input
                  value={authEmail}
                  onChange={(event) => onEmailChange(event.target.value)}
                  className="h-12 flex-1 bg-transparent text-sm outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-stone-600">
                Password
              </span>
              <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-4">
                <Lock className="h-4 w-4 text-stone-400" />
                <input
                  value={authPassword}
                  onChange={(event) => onPasswordChange(event.target.value)}
                  type="password"
                  className="h-12 flex-1 bg-transparent text-sm outline-none"
                  placeholder="Your password"
                />
              </div>
            </label>

            {authError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {authError}
              </div>
            )}

            <button
              type="button"
              onClick={onSubmit}
              disabled={isAuthLoading}
              className="flex h-12 w-full items-center justify-center rounded-lg bg-stone-950 font-semibold text-white transition hover:bg-stone-800 disabled:opacity-60"
            >
              {isAuthLoading
                ? "Please wait..."
                : authMode === "login"
                ? "Login"
                : "Sign up"}
            </button>

            <button
              type="button"
              onClick={onAuthModeToggle}
              className="w-full rounded-lg px-4 py-3 text-sm text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
            >
              {authMode === "login"
                ? "Need an account? Sign up"
                : "Already have an account? Login"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
