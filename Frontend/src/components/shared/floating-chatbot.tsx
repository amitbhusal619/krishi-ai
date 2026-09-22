"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Sprout } from "lucide-react";
import { getAuthStatus, sendChatMessage } from "@/lib/api";

const starterPrompts = [
  "My tomato leaves are yellow",
  "What fertilizer should I use?",
  "Today's maize price?",
];

export function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: "bot" | "user"; text: string }[]>([
    { from: "bot", text: "Namaste! I'm the HAMRO KRISHI SEWA assistant. Ask me about crops, prices, or weather." },
  ]);
  const [input, setInput] = useState("");

  async function send(text: string) {
    if (!text.trim()) return;

    const trimmed = text.trim();
    setMessages((m) => [
      ...m,
      { from: "user", text: trimmed },
    ]);
    setInput("");

    try {
      await getAuthStatus();
      const response = await sendChatMessage(trimmed);
      const botReply = response.messages?.slice(-1)[0]?.message ?? "I’m here to help with farming questions.";
      setMessages((m) => [
        ...m,
        { from: "bot", text: botReply },
      ]);
    } catch (error) {
      setMessages((m) => [
        ...m,
        { from: "bot", text: error instanceof Error ? error.message : "Unable to reach the AI assistant right now." },
      ]);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="glass leaf-shape mb-4 flex h-96 w-80 flex-col p-4 shadow-2xl shadow-dark/20">
          <div className="flex items-center gap-2 border-b border-dark/10 pb-3">
            <span className="leaf-shape-sm flex h-8 w-8 items-center justify-center bg-primary text-cream">
              <Sprout className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-dark">Krishi Assistant</p>
              <p className="text-xs text-dark/50">Usually replies instantly</p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs ${
                  m.from === "bot"
                    ? "bg-white/80 text-dark"
                    : "ml-auto bg-primary text-cream"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="mb-2 flex flex-wrap gap-2">
            {starterPrompts.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="rounded-full border border-dark/10 px-3 py-1 text-[10px] text-dark/60 hover:bg-white/60"
              >
                {p}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="leaf-shape-sm flex-1 border border-dark/10 bg-white/80 px-3 py-2 text-xs outline-none"
            />
            <button
              type="submit"
              className="leaf-shape-sm flex h-9 w-9 items-center justify-center bg-primary text-cream"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle chatbot"
        className="leaf-shape flex h-14 w-14 items-center justify-center bg-dark text-cream shadow-xl shadow-dark/30 transition hover:bg-dark/90"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
