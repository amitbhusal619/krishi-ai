"use client";

import { useState } from "react";
import { Send, Sprout, User } from "lucide-react";
import { getAuthStatus, sendChatMessage } from "@/lib/api";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Namaste! Ask me anything about crops, prices, weather, or fertilizer." },
  ]);
  const [input, setInput] = useState("");

  async function send() {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((m) => [
      ...m,
      { from: "user", text },
    ]);
    setInput("");

    try {
      await getAuthStatus();
      const response = await sendChatMessage(text);
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
    <section className="px-6 py-16 md:px-12">
      <div className="mx-auto flex h-[70vh] max-w-2xl flex-col">
        <span className="font-mono text-xs tracking-wide text-primary">AI CHATBOT</span>
        <h1 className="mt-3 font-display text-3xl text-dark">Ask HAMRO KRISHI SEWA</h1>

        <div className="leaf-shape mt-6 flex flex-1 flex-col border border-dark/5 bg-white/70 p-5">
          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {messages.map((m, i) => (
              <div key={i} className={`flex items-start gap-3 ${m.from === "user" ? "flex-row-reverse" : ""}`}>
                <span className={`leaf-shape-sm flex h-8 w-8 shrink-0 items-center justify-center ${m.from === "bot" ? "bg-primary/10 text-primary" : "bg-dark/10 text-dark"}`}>
                  {m.from === "bot" ? <Sprout className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </span>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.from === "bot" ? "bg-beige text-dark" : "bg-primary text-cream"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="mt-4 flex items-center gap-2 border-t border-dark/5 pt-4"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. My tomato leaves are yellow"
              className="leaf-shape-sm flex-1 border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none"
            />
            <button type="submit" className="leaf-shape-sm flex h-11 w-11 items-center justify-center bg-primary text-cream">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
