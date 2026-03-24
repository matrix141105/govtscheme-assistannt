import { apiFetch } from "@/lib/api";
import { Send, Mic, Bot, UserCircle, Plus, MessageSquare, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useStateContext } from "@/context/StateContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface ChatSession {
  id: number;
  title: string;
  updated_at: string;
}

const initialMessages: Message[] = [
  { id: 1, text: "Namaste! Welcome to GovAssist AI. I can help you find government schemes, check your eligibility, or file a grievance. How can I assist you today?", sender: "bot" },
];

export function ChatArea() {
  const { language, t } = useLanguage();
  const { selectedState } = useStateContext();
  const { token, isAuthenticated } = useAuth();

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]); // Initialize empty, set via useEffect for translation

  useEffect(() => {
    // Set initial message language dynamically
    setMessages([
      { id: 1, text: t("Welcome Message"), sender: "bot" }
    ]);
  }, [language]); // Re-run when language changes

  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isSendingRef = useRef(false);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              currentTranscript += event.results[i][0].transcript;
            }
          }
          if (currentTranscript) {
            setInput((prev) => prev + (prev.length > 0 && !prev.endsWith(' ') ? ' ' : '') + currentTranscript.trim());
          }
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  // Update language when user changes app language
  useEffect(() => {
    if (recognitionRef.current) {
      if (language === "हिन्दी" || language === "Bhojpuri") {
        recognitionRef.current.lang = "hi-IN";
      } else if (language === "తెలుగు") {
        recognitionRef.current.lang = "te-IN";
      } else {
        recognitionRef.current.lang = "en-IN";
      }
    }
  }, [language]);

  // Handle Recording State
  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start recording", err);
      }
    } else {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  }, [isRecording]);

  // Fetch Chat Sessions on Mount (if logged in)
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchSessions();
    }
  }, [isAuthenticated, token]);

  const fetchSessions = async () => {
    try {
      const res = await apiFetch("/api/chats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    }
  };

  const loadSession = async (sessionId: number) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await apiFetch(`/api/chats/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        // Convert API messages to UI format
        const loadedMessages: Message[] = data.map((m: any) => ({
          id: m.id,
          text: m.content,
          sender: m.sender,
        }));
        setMessages(loadedMessages);
        setCurrentSessionId(sessionId);
      }
    } catch (error) {
      toast.error("Failed to load chat.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (e: React.MouseEvent, sessionId: number) => {
    e.stopPropagation();
    if (!token) return;
    if (!confirm("Are you sure you want to delete this chat?")) return;

    try {
      const res = await apiFetch(`/api/chats/${sessionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        if (currentSessionId === sessionId) {
          handleNewChat();
        }
        toast.success("Chat deleted.");
      }
    } catch (error) {
      toast.error("Failed to delete chat.");
    }
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([{ id: 1, text: t("Welcome Message"), sender: "bot" }]);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isSendingRef.current) return;

    isSendingRef.current = true;
    const userMsg: Message = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    const userInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const body: any = {
        message: userInput,
        language: language,
        state: selectedState,
      };
      if (currentSessionId) {
        body.session_id = currentSessionId;
      }

      const headers: any = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await apiFetch("/api/chat", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const botMsg: Message = {
        id: Date.now() + 1,
        text: data.response,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMsg]);

      // If a new session was created by the backend, update state and refresh list
      if (data.session_id && currentSessionId !== data.session_id) {
        setCurrentSessionId(data.session_id);
        fetchSessions();
      }

      // If existing session, refresh list to update timestamp/order
      if (currentSessionId) {
        fetchSessions();
      }

    } catch (error) {
      console.error("Error calling backend:", error);
      const errorMsg: Message = {
        id: Date.now() + 1,
        text: `Sorry, I'm having trouble connecting to the server. (${error instanceof Error ? error.message : "Unknown error"})`,
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      isSendingRef.current = false;
    }
  };

  return (
    <div className="flex flex-1 min-w-0 h-full">
      {/* History Sidebar (Only if logged in) */}
      {isAuthenticated && (
        <div className="w-64 bg-sidebar/95 border-r border-sidebar-border flex flex-col hidden md:flex">
          <div className="p-4 border-b border-border">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center gap-2 justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              {t("New Chat")}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {sessions.length === 0 ? (
              <div className="text-center text-muted-foreground text-xs py-4">No saved chats</div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => loadSession(session.id)}
                  className={`group flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors cursor-pointer ${currentSessionId === session.id
                    ? "bg-sidebar-accent text-sidebar-primary font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
                    }`}
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span className="flex-1 truncate">{session.title}</span>
                  <button
                    onClick={(e) => deleteSession(e, session.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full bg-gray-50/50">

        {/* Desktop Centered Container */}
        <div className="flex flex-col flex-1 w-full md:max-w-4xl md:mx-auto h-full bg-white md:shadow-sm md:border-x border-gray-100">
          {/* Header */}
          <header className="flex-shrink-0 flex items-center gap-3 px-6 py-4 border-b border-border bg-white z-10">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-bold text-foreground">{t("Government Services Assistant")}</h2>
              <p className="text-xs text-muted-foreground">{t("Powered by")}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">{t("Online")}</span>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-thin">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                {msg.sender === "bot" && (
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                )}
                <div
                  className={`select-text max-w-[85%] px-5 py-4 rounded-2xl text-[15px] leading-7 shadow-sm whitespace-pre-wrap ${msg.sender === "user"
                    ? "bg-chat-user text-chat-user-foreground rounded-br-md"
                    : "bg-chat-bot text-chat-bot-foreground rounded-bl-md"
                    }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && (
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <UserCircle className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start animate-in fade-in duration-300">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <div className="bg-chat-bot text-chat-bot-foreground rounded-bl-md px-5 py-4 rounded-2xl shadow-sm">
                  <div className="flex gap-1.5 items-center h-7 px-1">
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 px-4 md:px-6 py-4 border-t border-border bg-white">
            <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={isLoading ? t("Waiting") : t("Ask placeholder")}
                disabled={isLoading}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50"
              />
              <button
                onClick={() => {
                  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                  if (!SpeechRecognition) {
                    toast.error(t("Speech recognition is not supported in this browser."));
                    return;
                  }
                  setIsRecording(!isRecording);
                }}
                disabled={isLoading}
                className={`p-2 rounded-lg transition-colors ${isRecording ? "bg-destructive text-destructive-foreground animate-pulse" : "text-muted-foreground hover:text-foreground hover:bg-background"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                title={isRecording ? "Stop recording" : "Start voice input"}
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`p-2 rounded-lg transition-colors ${isLoading || !input.trim()
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
