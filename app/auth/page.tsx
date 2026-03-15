"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { SignIn, SignUp, useUser } from "@clerk/nextjs";
import {
  ArrowLeft,
  Bot,
  Loader2,
  Mic,
  RefreshCcw,
  Send,
  Square,
  Sparkles,
  Stethoscope,
  Volume2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef, useState } from "react";
import remarkGfm from "remark-gfm";

type Message = {
  role: "user" | "bot";
  content: string;
  source?: "database" | "gemini" | "escalated" | "staff" | "system";
};

const quickPrompts = [
  "Find nearby hospitals for a cardiac emergency",
  "Explain the symptoms I should watch closely",
  "Give first-response steps before an ambulance arrives",
  "Summarize what I should tell the care team",
];

const navPillClass =
  "inline-flex h-14 items-center rounded-full border border-[#e6dfd6] bg-white px-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition-colors";

const navActionClass =
  "text-sm font-medium text-slate-700 hover:bg-[#fcfbf8] hover:text-slate-950";

const navAccentClass =
  "text-sm font-medium text-[#2748b7] hover:bg-[#e5ecff]";

const VOICE_ASSISTANT_ENABLED =
  process.env.ENABLE_VOICE_ASSISTANT === "true";

const LoadingSkeleton = () => (
  <div className="flex gap-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#eef2ff]">
      <div className="h-4 w-4 animate-pulse rounded-full bg-[#c8d4ff]" />
    </div>
    <div className="flex-1 space-y-2.5 rounded-[1.6rem] border border-[#ebe3d8] bg-white px-4 py-4 shadow-sm">
      <div className="h-4 w-32 animate-pulse rounded bg-[#ece8df]" />
      <div className="h-4 w-64 animate-pulse rounded bg-[#ece8df]" />
      <div className="h-4 w-48 animate-pulse rounded bg-[#ece8df]" />
    </div>
  </div>
);

function getWelcomeMessage(name?: string | null) {
  return {
    role: "bot" as const,
    content: `Hello ${name || "there"}! I'm your AI assistant. How can I help you today?`,
  };
}

function getSessionStorageKey(userId: string) {
  return `medconnect-chat-session:${userId}`;
}

function isMessage(value: unknown): value is Message {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as {
    role?: unknown;
    content?: unknown;
    source?: unknown;
  };

  return (
    (candidate.role === "user" || candidate.role === "bot") &&
    typeof candidate.content === "string" &&
    (candidate.source === undefined ||
      candidate.source === "database" ||
      candidate.source === "gemini" ||
      candidate.source === "escalated" ||
      candidate.source === "staff" ||
      candidate.source === "system")
  );
}

function parseStoredSession(rawValue: string | null) {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;

    if (Array.isArray(parsed)) {
      const messages = parsed.filter(isMessage);
      return messages.length > 0
        ? {
            messages,
            input: "",
          }
        : null;
    }

    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }

    const candidate = parsed as {
      messages?: unknown;
      input?: unknown;
    };

    if (!Array.isArray(candidate.messages)) {
      return null;
    }

    const messages = candidate.messages.filter(isMessage);

    return messages.length > 0
      ? {
          messages,
          input: typeof candidate.input === "string" ? candidate.input : "",
        }
      : null;
  } catch {
    return null;
  }
}

export default function Home() {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"signIn" | "signUp">("signIn");
  const [messages, setMessages] = useState<Message[]>([
    getWelcomeMessage("there"),
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAudioId, setLoadingAudioId] = useState<number | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const activeUserId = user?.id;

  useEffect(() => {
    if (!isLoaded || !activeUserId) {
      return;
    }

    const storedSession = parseStoredSession(
      window.sessionStorage.getItem(getSessionStorageKey(activeUserId))
    );

    if (storedSession) {
      setMessages(storedSession.messages);
      setInput(storedSession.input);
      return;
    }

    setMessages([getWelcomeMessage(user?.firstName || user?.username)]);
    setInput("");
  }, [activeUserId, isLoaded, user?.firstName, user?.username]);

  useEffect(() => {
    if (!activeUserId) {
      return;
    }

    window.sessionStorage.setItem(
      getSessionStorageKey(activeUserId),
      JSON.stringify({
        messages,
        input,
      })
    );
  }, [activeUserId, input, messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  const getInitial = (name: string | null | undefined) =>
    ((name || "U").charAt(0) || "U").toUpperCase();

  const stopAudioPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    setPlayingAudioId(null);
  };

  useEffect(() => () => stopAudioPlayback(), []);

  const getSpeechText = (content: string) =>
    content
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
      .replace(/[`*_>#-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const handleListen = async (messageId: number, content: string) => {
    if (!VOICE_ASSISTANT_ENABLED) {
      return;
    }

    if (playingAudioId === messageId) {
      stopAudioPlayback();
      return;
    }

    stopAudioPlayback();
    setLoadingAudioId(messageId);

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: getSpeechText(content) }),
      });

      if (!response.ok) {
        const errorBody = await response
          .json()
          .catch(() => ({ error: "Failed to generate audio." }));
        throw new Error(errorBody.error || "Failed to generate audio.");
      }

      const audioBlob = await response.blob();

      if (!audioBlob.size) {
        throw new Error("No audio was returned.");
      }

      const objectUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(objectUrl);

      audioRef.current = audio;
      audioUrlRef.current = objectUrl;

      audio.onended = () => {
        if (audioRef.current === audio) {
          audioRef.current = null;
        }

        if (audioUrlRef.current === objectUrl) {
          URL.revokeObjectURL(objectUrl);
          audioUrlRef.current = null;
        }

        setPlayingAudioId(null);
      };

      audio.onerror = () => {
        stopAudioPlayback();
        toast({
          title: "Audio playback failed",
          description: "Unable to play the generated speech.",
          variant: "destructive",
        });
      };

      await audio.play();
      setPlayingAudioId(messageId);
    } catch (error) {
      toast({
        title: "Voice assistant unavailable",
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate speech.",
        variant: "destructive",
      });
    } finally {
      setLoadingAudioId((current) => (current === messageId ? null : current));
    }
  };

  const resetConversation = () => {
    stopAudioPlayback();
    const nextMessages = [getWelcomeMessage(user?.firstName || user?.username)];
    setMessages(nextMessages);
    setInput("");

    if (activeUserId) {
      window.sessionStorage.setItem(
        getSessionStorageKey(activeUserId),
        JSON.stringify({
          messages: nextMessages,
          input: "",
        })
      );
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !user) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "AI Response Error",
          description: data.error || "Failed to get response from AI",
          variant: "destructive",
        });

        if (data.response) {
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              content: data.response,
              source: "system",
            },
          ]);
          setIsLoading(false);
          return;
        }

        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: data.response,
          source: data.source,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            error instanceof Error
              ? `Error: ${error.message}`
              : "An error occurred. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage();
  };

  const handlePromptSelect = (prompt: string) => {
    setInput(prompt);
  };

  const studioIntro =
    messages.length === 1 && messages[0]?.role === "bot" && !isLoading;

  useEffect(() => {
    if (pathname !== "/auth") {
      return;
    }

    const queryString = window.location.search;
    router.replace(queryString ? `/app${queryString}` : "/app");
  }, [pathname, router]);

  if (pathname === "/auth") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f7f6f2] px-4">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f7f6f2] px-4">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-dvh bg-[#f7f6f2] text-slate-950">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(circle_at_top,rgba(251,170,100,0.18),transparent_46%),radial-gradient(circle_at_50%_20%,rgba(145,169,255,0.16),transparent_40%)]" />

        <header className="sticky top-0 z-20 border-b border-[#ece4d9] bg-[#f7f6f2]/92 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link
              href="/"
              className={cn(navPillClass, navActionClass, "gap-2")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to website
            </Link>

            <div className={cn(navPillClass, "gap-3 pr-6")}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f172a] text-white">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base font-semibold tracking-tight text-slate-950">
                  MedConnect AI Studio
                </div>
                <div className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                  Healthcare intelligence
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-12 lg:grid-cols-[1fr_420px] lg:py-16">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#e2e7ff] bg-[#eef3ff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#4660d2]">
              <Sparkles className="h-3.5 w-3.5" />
              MedConnect AI Studio
            </div>
            <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[0.95] tracking-[-0.04em] text-slate-950 sm:text-6xl">
              Triage, explain, and coordinate care from one white-space
              workspace.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Sign in to use the MedConnect assistant with a lighter AI-studio
              experience built for emergency support, hospital routing, and
              patient guidance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {quickPrompts.slice(0, 3).map((prompt) => (
                <div
                  key={prompt}
                  className="rounded-full border border-[#e6e0d7] bg-white px-4 py-2 text-sm text-slate-600 shadow-sm"
                >
                  {prompt}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#e7dfd4] bg-white/92 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                {authMode === "signIn" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Access the MedConnect assistant and continue from the main
                website.
              </p>
            </div>

            {authMode === "signIn" ? (
              <SignIn routing="hash" />
            ) : (
              <SignUp routing="hash" />
            )}

            <Button
              variant="ghost"
              className="mt-4 w-full"
              onClick={() =>
                setAuthMode(authMode === "signIn" ? "signUp" : "signIn")
              }
            >
              {authMode === "signIn"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#f7f6f2] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[24rem] bg-[radial-gradient(circle_at_top,rgba(251,170,100,0.18),transparent_48%),radial-gradient(circle_at_50%_20%,rgba(145,169,255,0.16),transparent_40%)]" />

      <header className="sticky top-0 z-30 border-b border-[#ece4d9] bg-[#f7f6f2]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className={cn(navPillClass, navActionClass, "gap-2")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to website
            </Link>

            <div className={cn(navPillClass, "hidden gap-3 pr-6 sm:flex")}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f172a] text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <div className="text-base font-semibold tracking-tight text-slate-950">
                  MedConnect AI Studio
                </div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                  Healthcare intelligence
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <div
              className={cn(
                navPillClass,
                "hidden min-w-[120px] justify-center text-sm font-medium text-slate-600 sm:inline-flex"
              )}
            >
              {user.firstName || user.username || "User"}
            </div>
            <Button
              variant="outline"
              className={cn(
                navPillClass,
                navAccentClass,
                "border-[#d9e3ff] bg-[#edf2ff] px-5"
              )}
              onClick={resetConversation}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              New chat
            </Button>
          </div>
        </div>
      </header>

      <div className="relative mx-auto flex min-h-[calc(100dvh-81px)] max-w-6xl flex-col px-4 pb-6 pt-6">
        <div className="flex-1 overflow-hidden">
          {studioIntro ? (
            <div className="flex h-full items-center justify-center">
              <div className="mx-auto w-full max-w-4xl text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#e2e7ff] bg-[#eef3ff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#4660d2]">
                  <Sparkles className="h-3.5 w-3.5" />
                  MedConnect AI Studio
                </div>
                <h1 className="mt-8 text-5xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-6xl">
                  What should MedConnect help with today?
                </h1>
                <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                  Use the assistant to understand symptoms, coordinate next
                  steps, or prepare a clean handoff for hospitals and care
                  teams.
                </p>

                <div className="mx-auto mt-10 max-w-3xl rounded-[2rem] border border-[#e6dfd6] bg-white/90 p-6 text-left shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef3ff] text-[#4660d2]">
                      <Stethoscope className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
                        Assistant
                      </p>
                      <p className="mt-3 text-lg leading-8 text-slate-700">
                        {messages[0].content}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handlePromptSelect(prompt)}
                      className="rounded-full border border-[#e6dfd6] bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-[#fcfbf8] hover:text-slate-950"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto pb-4">
              <div className="mx-auto max-w-4xl space-y-5 pb-24">
                {messages.map((message, index) => {
                  const isAudioLoading = loadingAudioId === index;
                  const isAudioPlaying = playingAudioId === index;

                  return (
                    <div
                      key={index}
                      className={cn(
                        "flex gap-3",
                        message.role === "user" && "justify-end"
                      )}
                    >
                      {message.role === "bot" ? (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef3ff] text-[#4660d2]">
                          <Bot className="h-5 w-5" />
                        </div>
                      ) : null}

                      <div
                        className={cn(
                          "max-w-[85%] rounded-[1.7rem] border px-5 py-4 shadow-sm",
                          message.role === "bot"
                            ? "border-[#e8e1d7] bg-white text-slate-700"
                            : "border-[#d9e4ff] bg-[#eef3ff] text-slate-950"
                        )}
                      >
                        {message.role === "bot" ? (
                          <div className="prose prose-sm max-w-none prose-p:leading-7 prose-pre:rounded-2xl prose-pre:bg-[#f7f6f2] prose-pre:p-4 prose-code:text-sm">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({ children }) => (
                                  <p className="mb-2 last:mb-0">{children}</p>
                                ),
                                table: ({ children }) => (
                                  <div className="my-2 overflow-auto">
                                    <table className="w-full border-collapse rounded-xl border border-[#e6dfd6] text-sm">
                                      {children}
                                    </table>
                                  </div>
                                ),
                                th: ({ children }) => (
                                  <th className="border border-[#e6dfd6] bg-[#faf8f4] px-3 py-2 text-left">
                                    {children}
                                  </th>
                                ),
                                td: ({ children }) => (
                                  <td className="border border-[#e6dfd6] px-3 py-2">
                                    {children}
                                  </td>
                                ),
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm leading-7">{message.content}</p>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          {message.source ? (
                            <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                              Source: {message.source}
                            </div>
                          ) : null}

                          {VOICE_ASSISTANT_ENABLED && message.role === "bot" ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="rounded-full border-[#d9e3ff] bg-[#edf2ff] text-[#2748b7] hover:bg-[#e5ecff]"
                              aria-label={
                                isAudioPlaying
                                  ? "Stop audio playback"
                                  : "Listen to AI response"
                              }
                              aria-pressed={isAudioPlaying}
                              disabled={isAudioLoading}
                              onClick={() =>
                                void handleListen(index, message.content)
                              }
                            >
                              {isAudioLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : isAudioPlaying ? (
                                <Square className="mr-2 h-4 w-4" />
                              ) : (
                                <Volume2 className="mr-2 h-4 w-4" />
                              )}
                              {isAudioLoading
                                ? "Preparing audio"
                                : isAudioPlaying
                                  ? "Stop"
                                  : "Listen"}
                            </Button>
                          ) : null}
                        </div>
                      </div>

                      {message.role === "user" ? (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#dde3f7] bg-white text-slate-700">
                          <span className="text-sm font-semibold">
                            {getInitial(user.firstName || user.username)}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  );
                })}

                {isLoading ? <LoadingSkeleton /> : null}

                <div ref={endRef} />
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 z-20 mt-6 bg-[linear-gradient(180deg,rgba(247,246,242,0),rgba(247,246,242,0.8)_28%,rgba(247,246,242,0.98))] pb-2 pt-8">
          <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
            <div className="rounded-[2rem] border border-[#dfe6ff] bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <div className="rounded-[1.55rem] bg-[linear-gradient(90deg,rgba(83,120,255,0.45),rgba(80,180,120,0.35),rgba(255,185,87,0.45))] p-[1px]">
                <div className="rounded-[1.5rem] bg-white px-4 py-4">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void sendMessage();
                      }
                    }}
                    placeholder="Describe symptoms, ask for emergency next steps, or plan a hospital handoff..."
                    disabled={isLoading}
                    className="min-h-[110px] resize-none border-0 px-0 py-0 text-base leading-7 text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-0"
                  />

                  <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2">
                      <div className="inline-flex items-center gap-2 rounded-full border border-[#e5dfd5] bg-[#faf8f4] px-3 py-2 text-sm font-medium text-slate-600">
                        <Sparkles className="h-4 w-4 text-[#4660d2]" />
                        MedConnect care assistant
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-full border-[#e5dfd5] bg-white hover:bg-[#faf8f4]"
                        onClick={() => {
                          if ("webkitSpeechRecognition" in window) {
                            const recognition = new (
                              window as typeof window & {
                                webkitSpeechRecognition: new () => {
                                  continuous: boolean;
                                  interimResults: boolean;
                                  lang: string;
                                  onresult: (event: {
                                    results: ArrayLike<
                                      ArrayLike<{ transcript: string }>
                                    >;
                                  }) => void;
                                  start: () => void;
                                };
                              }
                            ).webkitSpeechRecognition();

                            recognition.continuous = false;
                            recognition.interimResults = false;
                            recognition.lang = "en-US";

                            recognition.onresult = (event) => {
                              const transcript = event.results[0][0].transcript;
                              setInput(transcript);
                            };

                            recognition.start();
                          } else {
                            alert(
                              "Speech recognition is not supported in your browser."
                            );
                          }
                        }}
                        disabled={isLoading}
                      >
                        <Mic className="h-4 w-4" />
                      </Button>

                      <Button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="rounded-full border border-[#d9e3ff] bg-[#edf2ff] px-5 text-[#2748b7] hover:bg-[#e5ecff]"
                      >
                        Send
                        <Send className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}
