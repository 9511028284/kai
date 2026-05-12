export type SourceResult = {
  title?: string;
  url?: string;
  snippet?: string;
  source?: string;
};

export type PageSummary = {
  title?: string;
  url?: string;
  summary?: string;
};

export type WebRetrieval = {
  action?: string;
  status?: string;
  query?: string;
  provider?: string;
  retrieved_at?: string;
  results?: SourceResult[];
  fetched_pages?: PageSummary[];
  error?: string;
};

export type ToolResult = WebRetrieval & {
  primary?: Record<string, unknown>;
  web_retrieval?: WebRetrieval;
};

export type Message = {
  role: "user" | "assistant";
  content: string;
  created_at?: string;
  intent?: Record<string, unknown>;
  tool_result?: ToolResult;
};

export type Profile = {
  user_id: string;
  email: string;
  display_name: string;
  role: "admin" | "user";
  ai_mode: "jarvis" | "gpt";
  preferences?: Record<string, unknown>;
};

export type SystemStatus = {
  app?: {
    name?: string;
    project?: string;
    model?: string;
  };
  ollama?: {
    status?: string;
    model_count?: number;
    models?: string[];
  };
  web?: {
    enabled?: boolean;
    provider?: string;
    google_cse_configured?: boolean;
    serpapi_configured?: boolean;
    searxng_configured?: boolean;
    max_results?: number;
    scrape_page_count?: number;
  };
  memory?: {
    total_messages?: number;
    last_message_at?: string | null;
  };
  tasks?: {
    total_tasks?: number;
    open_tasks?: number;
  };
};

export type VoiceStatus = "idle" | "listening" | "thinking" | "speaking";
export type SidebarTab = "history" | "settings";
export type BackendStatus = "online" | "offline" | "checking";

export type HistoryMessage = Message & {
  index: number;
};

export type SpeechRecognitionEventLike = {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
};

export type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

export type SpeechRecognitionWindow = typeof window & {
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
  SpeechRecognition?: SpeechRecognitionConstructor;
};
