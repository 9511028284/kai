"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import type { Session } from "@supabase/supabase-js";
import { AppHeader } from "./kai/AppHeader";
import { AuthScreen } from "./kai/AuthScreen";
import { ChatMessages } from "./kai/ChatMessages";
import { Composer } from "./kai/Composer";
import { EmptyChatState } from "./kai/EmptyChatState";
import { Sidebar } from "./kai/Sidebar";
import { VoiceConversationPanel } from "./kai/VoiceConversationPanel";
import type {
  BackendStatus,
  Message,
  Profile,
  SidebarTab,
  SpeechRecognitionEventLike,
  SpeechRecognitionLike,
  SpeechRecognitionWindow,
  SystemStatus,
  VoiceStatus,
} from "./kai/types";
import { getWebRetrieval } from "./kai/utils";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const supabase = createClient();

  const [session, setSession] = useState<Session | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Login to start KAI.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [assistantActivity, setAssistantActivity] = useState("Standing by");
  const [isListening, setIsListening] = useState(false);
  const [isVoiceConversation, setIsVoiceConversation] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>("idle");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] =
    useState<SidebarTab>("history");
  const [backendStatus, setBackendStatus] =
    useState<BackendStatus>("checking");
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const voiceConversationRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const isSendingRef = useRef(false);

  const isAdmin = profile?.role === "admin" || profile?.ai_mode === "jarvis";
  const modelName =
    systemStatus?.app?.model || (isAdmin ? "llama3.1:8b" : "local model");
  const webProvider = systemStatus?.web?.provider || "auto";
  const historyItems = useMemo(
    () =>
      messages
        .map((message, index) => ({ ...message, index }))
        .filter((message) => message.role === "user")
        .slice(-8)
        .reverse(),
    [messages]
  );
  const latestRetrieval = useMemo(() => {
    const assistantWithSources = [...messages]
      .reverse()
      .find((message) => getWebRetrieval(message.tool_result));

    return getWebRetrieval(assistantWithSources?.tool_result);
  }, [messages]);

  function getAuthHeaders() {
    const token = session?.access_token;

    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  }

  function scrollToBottom() {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }

  function getSpeechRecognition() {
    const speechWindow = window as SpeechRecognitionWindow;
    return speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
  }

  async function refreshSystemStatus() {
    try {
      const response = await fetch(`${API_URL}/status`);

      if (!response.ok) return;

      const data = await response.json();
      setSystemStatus(data);
      setLastSyncAt(new Date().toISOString());
    } catch {
      // Backend root health is the source of truth for online/offline state.
    }
  }

  async function checkBackend() {
    setBackendStatus("checking");

    try {
      const response = await fetch(`${API_URL}/`);

      if (!response.ok) {
        throw new Error("Backend offline");
      }

      setBackendStatus("online");
      refreshSystemStatus();
    } catch {
      setBackendStatus("offline");
    }
  }

  async function loadProfile(currentSession?: Session | null) {
    const token = currentSession?.access_token || session?.access_token;
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Profile request failed.");
      }

      const data = await response.json();
      setProfile(data.profile);

      if (data.profile?.role === "admin") {
        setMessages([
          {
            role: "assistant",
            content:
              "Welcome back Kashif. Jarvis mode is active with TeenVerseHub context, web fallback, voice, tasks, and business/code strategy.",
          },
        ]);
      } else {
        setMessages([
          {
            role: "assistant",
            content:
              "Welcome to KAI. GPT mode is active for writing, coding, research, ideas, and productivity.",
          },
        ]);
      }
    } catch (error) {
      console.error("Profile load error:", error);
    }
  }

  async function loadHistory(currentSession?: Session | null) {
    const token = currentSession?.access_token || session?.access_token;
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return;

      const data = await response.json();

      if (Array.isArray(data.messages) && data.messages.length > 0) {
        setMessages(data.messages);
      }
    } catch {
      // History is helpful, but chat should still open if it fails.
    }
  }

  async function handleAuth() {
    setIsAuthLoading(true);
    setAuthError("");

    try {
      if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
        });

        if (error) throw error;

        if (data.session) {
          setSession(data.session);
          await loadProfile(data.session);
          await loadHistory(data.session);
        } else {
          setAuthError("Signup successful. Check email verification if enabled.");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });

        if (error) throw error;

        setSession(data.session);
        await loadProfile(data.session);
        await loadHistory(data.session);
      }
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Authentication failed."
      );
    } finally {
      setIsAuthLoading(false);
    }
  }

  async function logout() {
    stopVoiceConversation();
    await supabase.auth.signOut();

    setSession(null);
    setProfile(null);
    setMessages([
      {
        role: "assistant",
        content: "Login to start KAI.",
      },
    ]);
  }

  async function sendMessage(messageText?: string, speakReply = false) {
    const finalMessage = (messageText || input).trim();

    if (!finalMessage || isSendingRef.current || !session) return;

    setInput("");
    setIsSending(true);
    setAssistantActivity("Searching memory, tools, and web fallback");
    isSendingRef.current = true;

    if (speakReply) {
      setVoiceStatus("thinking");
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: finalMessage,
        created_at: new Date().toISOString(),
      },
    ]);

    scrollToBottom();

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          message: finalMessage,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Backend request failed");
      }

      const data = await response.json();

      if (data.profile) {
        setProfile(data.profile);
      }

      const reply = data.reply || "I did not get a response from KAI.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
          created_at: new Date().toISOString(),
          tool_result: data.tool_result || undefined,
        },
      ]);

      setBackendStatus("online");
      setAssistantActivity("Ready");

      if (speakReply) {
        await speakText(reply, true);
      }
    } catch (error) {
      setBackendStatus("offline");
      setAssistantActivity("Connection issue");

      const errorMessage =
        error instanceof Error
          ? `Backend connection error:\n\n${error.message}`
          : "Backend connection error.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
          created_at: new Date().toISOString(),
        },
      ]);

      if (speakReply) {
        await speakText("I faced a backend connection error.", true);
      }
    } finally {
      setIsSending(false);
      isSendingRef.current = false;
      scrollToBottom();
      refreshSystemStatus();
    }
  }

  function startNewChat() {
    stopVoiceConversation();

    setMessages([
      {
        role: "assistant",
        content: isAdmin
          ? "New Jarvis chat started. What should we build or manage now, Kashif?"
          : "New GPT chat started. What can I help you with?",
        created_at: new Date().toISOString(),
      },
    ]);

    setInput("");
    setActiveSidebarTab("history");
  }

  function clearChatOnScreen() {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared on screen.",
        created_at: new Date().toISOString(),
      },
    ]);
  }

  function startVoiceDictation() {
    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }

  async function speakText(text: string, continueConversation = false) {
    const cleanedText = text.replace(/\n/g, " ").trim();

    if (!cleanedText) {
      if (continueConversation && voiceConversationRef.current) {
        setTimeout(startVoiceConversationListening, 700);
      }
      return;
    }

    try {
      isSpeakingRef.current = true;
      setVoiceStatus("speaking");

      const response = await fetch(`${API_URL}/tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: cleanedText,
          voice: "Samantha",
        }),
      });

      if (!response.ok) {
        throw new Error("Backend TTS failed");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        isSpeakingRef.current = false;
        setVoiceStatus("idle");

        if (continueConversation && voiceConversationRef.current) {
          setTimeout(startVoiceConversationListening, 700);
        }
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        isSpeakingRef.current = false;
        setVoiceStatus("idle");

        if (continueConversation && voiceConversationRef.current) {
          setTimeout(startVoiceConversationListening, 700);
        }
      };

      await audio.play();
    } catch (error) {
      console.error("Backend TTS error, falling back to browser voice:", error);

      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.lang = "en-IN";
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onstart = () => {
        isSpeakingRef.current = true;
        setVoiceStatus("speaking");
      };

      utterance.onend = () => {
        isSpeakingRef.current = false;
        setVoiceStatus("idle");

        if (continueConversation && voiceConversationRef.current) {
          setTimeout(startVoiceConversationListening, 700);
        }
      };

      utterance.onerror = () => {
        isSpeakingRef.current = false;
        setVoiceStatus("idle");

        if (continueConversation && voiceConversationRef.current) {
          setTimeout(startVoiceConversationListening, 700);
        }
      };

      speechSynthesis.speak(utterance);
    }
  }

  function speakLastAssistantMessage() {
    const lastAssistant = [...messages]
      .reverse()
      .find((message) => message.role === "assistant");

    if (!lastAssistant) return;

    speakText(lastAssistant.content, false);
  }

  function startVoiceConversation() {
    if (!session) return;

    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      alert("Voice conversation is not supported in this browser. Use Chrome.");
      return;
    }

    voiceConversationRef.current = true;
    setIsVoiceConversation(true);

    speakText(
      isAdmin
        ? "Jarvis voice conversation is active. Speak now, Kashif."
        : "KAI voice conversation is active. Speak now.",
      true
    );
  }

  function stopVoiceConversation() {
    voiceConversationRef.current = false;
    setIsVoiceConversation(false);
    setIsListening(false);
    setVoiceStatus("idle");
    isSpeakingRef.current = false;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stop errors from inactive recognition sessions.
      }
    }

    speechSynthesis.cancel();
  }

  function startVoiceConversationListening() {
    if (
      !voiceConversationRef.current ||
      !session ||
      isSendingRef.current ||
      isSpeakingRef.current
    ) {
      return;
    }

    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      stopVoiceConversation();
      return;
    }

    try {
      const recognition = new SpeechRecognition();

      recognition.lang = "en-IN";
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatus("listening");
      };

      recognition.onresult = async (event: SpeechRecognitionEventLike) => {
        const transcript = event.results[0][0].transcript?.trim();

        setIsListening(false);

        if (!transcript) {
          setVoiceStatus("idle");

          if (voiceConversationRef.current) {
            setTimeout(startVoiceConversationListening, 700);
          }

          return;
        }

        await sendMessage(transcript, true);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceStatus("idle");

        if (voiceConversationRef.current) {
          setTimeout(startVoiceConversationListening, 1000);
        }
      };

      recognition.onend = () => {
        setIsListening(false);

        if (
          voiceConversationRef.current &&
          !isSendingRef.current &&
          !isSpeakingRef.current
        ) {
          setVoiceStatus("idle");
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setVoiceStatus("idle");

      if (voiceConversationRef.current) {
        setTimeout(startVoiceConversationListening, 1000);
      }
    }
  }

  useEffect(() => {
    const statusTimer = window.setTimeout(() => {
      checkBackend();
    }, 0);

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);

      if (data.session) {
        await loadProfile(data.session);
        await loadHistory(data.session);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);

        if (currentSession) {
          await loadProfile(currentSession);
          await loadHistory(currentSession);
        }
      }
    );

    const statusInterval = window.setInterval(checkBackend, 45000);

    return () => {
      window.clearTimeout(statusTimer);
      window.clearInterval(statusInterval);
      listener.subscription.unsubscribe();
      stopVoiceConversation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!session) {
    return (
      <AuthScreen
        authEmail={authEmail}
        authPassword={authPassword}
        authMode={authMode}
        authError={authError}
        isAuthLoading={isAuthLoading}
        onEmailChange={setAuthEmail}
        onPasswordChange={setAuthPassword}
        onAuthModeToggle={() =>
          setAuthMode((prev) => (prev === "login" ? "signup" : "login"))
        }
        onSubmit={handleAuth}
      />
    );
  }

  return (
    <main className="flex h-screen overflow-hidden bg-[#f4f1ec] text-stone-950">
      <Sidebar
        isOpen={sidebarOpen}
        backendStatus={backendStatus}
        isVoiceConversation={isVoiceConversation}
        activeTab={activeSidebarTab}
        historyItems={historyItems}
        latestRetrieval={latestRetrieval}
        isAdmin={isAdmin}
        modelName={modelName}
        profile={profile}
        assistantActivity={assistantActivity}
        systemStatus={systemStatus}
        messagesCount={messages.length}
        onRefreshStatus={checkBackend}
        onNewChat={startNewChat}
        onStartVoiceConversation={startVoiceConversation}
        onStopVoiceConversation={stopVoiceConversation}
        onTabChange={setActiveSidebarTab}
        onUseHistoryPrompt={setInput}
        onSpeakLastReply={speakLastAssistantMessage}
        onClearScreen={clearChatOnScreen}
        onLogout={logout}
      />

      <section className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          backendStatus={backendStatus}
          isAdmin={isAdmin}
          email={profile?.email || session.user.email}
          webProvider={webProvider}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onRefreshStatus={checkBackend}
        />

        {isVoiceConversation ? (
          <VoiceConversationPanel
            voiceStatus={voiceStatus}
            onStop={stopVoiceConversation}
          />
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-4">
              {messages.length <= 1 ? (
                <EmptyChatState
                  isAdmin={isAdmin}
                  backendStatus={backendStatus}
                  onStartVoiceConversation={startVoiceConversation}
                  onSendPrompt={sendMessage}
                />
              ) : (
                <ChatMessages
                  messages={messages}
                  isSending={isSending}
                  assistantActivity={assistantActivity}
                  bottomRef={bottomRef}
                />
              )}
            </div>
          </div>
        )}

        {!isVoiceConversation && (
          <Composer
            assistantActivity={assistantActivity}
            modelName={modelName}
            webProvider={webProvider}
            lastSyncAt={lastSyncAt}
            backendStatus={backendStatus}
            isAdmin={isAdmin}
            isListening={isListening}
            input={input}
            isSending={isSending}
            onStartVoiceDictation={startVoiceDictation}
            onInputChange={setInput}
            onSendMessage={() => sendMessage()}
          />
        )}
      </section>
    </main>
  );
}
