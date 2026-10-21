import { useState, useRef, useEffect, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar, initialConversations, type Conversation as ConversationMeta } from "@/components/app-sidebar";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputFooter,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { getMockReply, suggestions, type Suggestion } from "@/lib/mock-responses";
import athenaLogo from "@/athena.png";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  parts: { type: "text"; text: string }[];
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Athena — Assistente de estudos para mentes neurodivergentes" },
      {
        name: "description",
        content:
          "Athena é uma plataforma de estudos acolhedora e acessível, com chatbot de respostas simuladas, focada em clareza e baixa sobrecarga cognitiva para pessoas neurodivergentes.",
      },
      { property: "og:title", content: "Athena — Assistente de estudos" },
      {
        property: "og:description",
        content:
          "Plataforma de estudos acolhedora e acessível para pessoas neurodivergentes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

let messageCounter = 0;
function nextId() {
  messageCounter += 1;
  return `msg-${messageCounter}`;
}

function Index() {
  const [conversations] = useState<ConversationMeta[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState("new");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState<"ready" | "submitted" | "streaming">("ready");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleNewChat = useCallback(() => {
    setActiveConversationId("new");
    setMessages([]);
    setStatus("ready");
  }, []);

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    // For prototype: show a placeholder message from the selected mock conversation
    const conv = initialConversations.find((c) => c.id === id);
    if (conv) {
      setMessages([
        {
          id: nextId(),
          role: "user",
          parts: [{ type: "text", text: conv.preview }],
        },
        {
          id: nextId(),
          role: "assistant",
          parts: [
            {
              type: "text",
              text: `### ${conv.title} 📚\n\nEsta é uma conversa do histórico. No protótipo completo, suas mensagens anteriores apareceriam aqui.\n\nQuer continuar esta conversa? É só digitar sua próxima dúvida abaixo. 👇`,
            },
          ],
        },
      ]);
    }
    setStatus("ready");
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || status !== "ready") return;

      const userMsg: ChatMessage = {
        id: nextId(),
        role: "user",
        parts: [{ type: "text", text: trimmed }],
      };

      setMessages((prev) => [...prev, userMsg]);
      setStatus("submitted");

      const reply = getMockReply(trimmed);

      timeoutRef.current = setTimeout(() => {
        const assistantMsg: ChatMessage = {
          id: nextId(),
          role: "assistant",
          parts: [{ type: "text", text: reply.text }],
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setStatus("ready");
      }, reply.delay);
    },
    [status],
  );

  const handleSuggestion = useCallback(
    (suggestion: Suggestion) => {
      sendMessage(suggestion.prompt);
    },
    [sendMessage],
  );

  const hasMessages = messages.length > 0;

  return (
    <SidebarProvider>
      <div className="flex h-dvh w-full overflow-hidden bg-background">
        <AppSidebar
          activeId={activeConversationId}
          onSelect={handleSelectConversation}
          onNewChat={handleNewChat}
          conversations={conversations}
        />

        <SidebarInset className="flex flex-col">
          {/* Chat header */}
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card/50 px-4 backdrop-blur-sm">
            <SidebarTrigger className="shrink-0" />
            <div className="flex min-w-0 items-center gap-2.5">
              <img
                src={athenaLogo}
                alt=""
                width={28}
                height={28}
                className="shrink-0 rounded-md"
                loading="lazy"
              />
              <div className="flex min-w-0 flex-col leading-tight">
                <h1 className="font-heading text-sm font-semibold text-foreground">
                  Athena
                </h1>
                <span className="truncate text-xs text-muted-foreground">
                  {status === "ready"
                    ? "Pronta para ajudar 💜"
                    : "Pensando..."}
                </span>
              </div>
            </div>
          </header>

          {/* Chat conversation area */}
          <Conversation className="flex-1">
            <ConversationContent className="mx-auto max-w-3xl px-4 pb-4">
              {!hasMessages && status === "ready" ? (
                <WelcomeState
                  onSuggestion={handleSuggestion}
                  logo={athenaLogo}
                />
              ) : (
                <>
                  {messages.map((msg) => (
                    <Message key={msg.id} from={msg.role}>
                      {msg.role === "assistant" && (
                        <div className="flex items-center gap-2">
                          <img
                            src={athenaLogo}
                            alt="Athena"
                            width={24}
                            height={24}
                            className="rounded-md"
                            loading="lazy"
                          />
                          <span className="text-xs font-medium text-muted-foreground">
                            Athena
                          </span>
                        </div>
                      )}
                      <MessageContent
                        className={cn(
                          msg.role === "user" &&
                            "bg-athena-gradient text-primary-foreground rounded-2xl rounded-tr-md",
                        )}
                      >
                        <MessageResponse>{getText(msg)}</MessageResponse>
                      </MessageContent>
                    </Message>
                  ))}

                  {status === "submitted" && (
                    <Message from="assistant">
                      <div className="flex items-center gap-2">
                        <img
                          src={athenaLogo}
                          alt="Athena"
                          width={24}
                          height={24}
                          className="rounded-md"
                          loading="lazy"
                        />
                        <span className="text-xs font-medium text-muted-foreground">
                          Athena
                        </span>
                      </div>
                      <MessageContent>
                        <Shimmer className="text-sm" duration={2}>
                          Pensando na melhor forma de te ajudar...
                        </Shimmer>
                      </MessageContent>
                    </Message>
                  )}
                </>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          {/* Suggestion chips (only when no messages and ready) */}
          {!hasMessages && status === "ready" && (
            <div className="mx-auto w-full max-w-3xl px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleSuggestion(s)}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-sm text-foreground transition-all hover:border-primary/40 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="text-base leading-none">{s.emoji}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Composer */}
          <div className="mx-auto w-full max-w-3xl shrink-0 px-4 pb-4 pt-2">
            <PromptInput
              onSubmit={(message) => {
                sendMessage(message.text);
                setInputValue("");
              }}
              className="rounded-2xl border border-border bg-card shadow-sm focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-ring/20"
            >
              <PromptInputTextarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escreva sua dúvida ou como você está se sentindo..."
                className="min-h-[60px] resize-none border-0 bg-transparent text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
              />
              <PromptInputFooter className="border-t border-border/60 pt-2">
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  Enter para enviar · Shift+Enter para nova linha
                </span>
                <div className="ml-auto">
                  <PromptInputSubmit
                    status={status}
                    disabled={status !== "ready" || !inputValue.trim()}
                    className="bg-athena-gradient text-primary-foreground hover:opacity-90"
                  />
                </div>
              </PromptInputFooter>
            </PromptInput>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function getText(message: ChatMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function WelcomeState({
  onSuggestion,
  logo,
}: {
  onSuggestion: (s: Suggestion) => void;
  logo: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
      <div className="relative">
        <div className="absolute inset-0 -z-10 rounded-full bg-athena-gradient opacity-20 blur-2xl" />
        <img
          src={logo}
          alt="Athena"
          width={72}
          height={72}
          className="rounded-2xl"
          loading="lazy"
        />
      </div>

      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-bold text-athena-gradient">
          Olá! Eu sou a Athena
        </h2>
        <p className="mx-auto max-w-md text-[15px] leading-relaxed text-muted-foreground">
          Estou aqui pra te ajudar nos estudos — com calma, no seu ritmo.
          Pode me perguntar sobre dúvidas, foco, ansiedade, organização...
        </p>
      </div>

      <div className="rounded-xl bg-accent/40 px-4 py-3 text-sm text-accent-foreground">
        💜 Escolha um tema abaixo ou escreva sua própria dúvida
      </div>
    </div>
  );
}
