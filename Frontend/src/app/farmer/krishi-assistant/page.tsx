"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Sprout, User, Plus, Loader2, MessageCircle, Sparkles } from "lucide-react";
import { getAuthStatus, sendChatMessage, getChatConversations, type ChatConversation, type ChatMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";

const starterPrompts = [
  "What crops are best for winter in loam soil?",
  "Suggest an organic way to treat tomato leaf blight",
  "What is the average price trend of rice currently?",
  "NPK recommendations for potato planting",
];

export default function KrishiAssistantPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<number | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  async function fetchConversations() {
    try {
      setLoadingHistory(true);
      const data = await getChatConversations();
      const list = Array.isArray(data) ? data : (data as any)?.results || [];
      setConversations(list);
      
      // If we already have a selected conversation, refresh its messages
      if (selectedConvId) {
        const current = list.find((c: ChatConversation) => c.id === selectedConvId);
        if (current) {
          setMessages(current.messages || []);
        }
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoadingHistory(false);
    }
  }

  // Scroll to bottom when messages list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle selecting a conversation
  function handleSelectConversation(convId: number) {
    setSelectedConvId(convId);
    const conv = conversations.find((c) => c.id === convId);
    if (conv) {
      setMessages(conv.messages || []);
    }
  }

  // Handle starting a new conversation
  function handleNewConversation() {
    setSelectedConvId(undefined);
    setMessages([]);
  }

  // Send a message
  async function handleSend(text: string) {
    if (!text.trim() || isLoading) return;
    const userMessageText = text.trim();
    setInput("");

    // Add user message optimistically
    const tempUserMsg: ChatMessage = {
      id: Date.now(),
      sender: "user",
      message: userMessageText,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      // Ensure user is authenticated
      await getAuthStatus();
      
      const response = await sendChatMessage(userMessageText, selectedConvId);
      
      if (response && response.id) {
        setSelectedConvId(response.id);
        
        // Refresh conversations list to include this new message/conv
        const allConversations = await getChatConversations();
        const list = Array.isArray(allConversations) ? allConversations : (allConversations as any)?.results || [];
        setConversations(list);
        
        const current = list.find((c: ChatConversation) => c.id === response.id);
        if (current) {
          setMessages(current.messages || []);
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      // Show error in chat
      const errorMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: "bot",
        message: error instanceof Error ? error.message : "Unable to reach HAMRO KRISHI SEWA. Please try again.",
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <PageHeader 
        title="Krishi Assistant" 
        description="Interact with our AI chatbot powered by Gemini to ask about crops, diseases, pricing, and general farming guidance." 
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 min-h-[400px] overflow-hidden">
        {/* Left Column: Sidebar / Chat History */}
        <div className="hidden lg:flex flex-col bg-white/60 leaf-shape border border-dark/5 p-4 overflow-hidden h-full shadow-sm shadow-dark/5">
          <button
            onClick={handleNewConversation}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 mb-4 bg-primary text-cream hover:bg-primary/95 transition duration-200 font-medium text-sm leaf-shape-sm shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Conversation
          </button>

          <p className="text-[10px] font-mono tracking-wider text-dark/40 mb-2 px-1 uppercase">Recent Chats</p>
          
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {loadingHistory ? (
              <div className="flex flex-col items-center justify-center py-8 text-dark/40 gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-xs">Loading history...</span>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8 text-xs text-dark/40">
                No past conversations.
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = selectedConvId === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`w-full text-left px-3 py-2.5 text-sm transition rounded-xl flex items-start gap-2.5 ${
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-dark/70 hover:bg-dark/5 hover:text-dark"
                    }`}
                  >
                    <MessageCircle className={`h-4 w-4 mt-0.5 shrink-0 ${isActive ? "text-primary" : "text-dark/40"}`} />
                    <span className="truncate flex-1">{conv.title || "Untitled Conversation"}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat Workspace */}
        <div className="flex flex-col bg-white/70 leaf-shape border border-dark/5 overflow-hidden h-full shadow-sm shadow-dark/5">
          {/* Active Conversation Title Header (Small screens / display title) */}
          <div className="flex items-center justify-between border-b border-dark/5 px-6 py-4 bg-white/40">
            <div className="flex items-center gap-2">
              <span className="leaf-shape-sm flex h-8 w-8 items-center justify-center bg-primary/10 text-primary">
                <Sprout className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-dark">
                  {selectedConvId
                    ? conversations.find((c) => c.id === selectedConvId)?.title || "HAMRO KRISHI SEWA Chatbot"
                    : "HAMRO KRISHI SEWA Assistant"}
                </p>
                <p className="text-[10px] text-dark/40 uppercase font-mono">Gemini AI Model Active</p>
              </div>
            </div>

            {/* Mobile New Chat Action Button */}
            <button
              onClick={handleNewConversation}
              className="lg:hidden flex items-center justify-center p-2 rounded-xl text-primary hover:bg-primary/10 transition"
              title="New Chat"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto py-10">
                <div className="leaf-shape-sm flex h-16 w-16 items-center justify-center bg-primary/10 text-primary mb-4 shadow-sm">
                  <Sprout className="h-8 w-8 animate-pulse" />
                </div>
                <h3 className="font-display text-xl text-dark font-semibold">Namaste! I am your Krishi Assistant</h3>
                <p className="mt-2 text-sm text-dark/50">
                  Ask me anything about crop cultivation, identifying diseases, soil nutrients, latest prices, or organic solutions.
                </p>

                {/* Suggestions Grid */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  {starterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="text-left p-3.5 rounded-2xl bg-white border border-dark/5 text-xs text-dark/70 hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition duration-150 flex items-start gap-2.5 shadow-sm"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-primary/70 mt-0.5 shrink-0" />
                      <span>{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => {
                  const isBot = msg.sender === "bot";
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3 max-w-[85%] ${
                        isBot ? "mr-auto" : "ml-auto flex-row-reverse"
                      }`}
                    >
                      <div
                        className={`leaf-shape-sm flex h-8 w-8 shrink-0 items-center justify-center shadow-sm ${
                          isBot ? "bg-primary/10 text-primary" : "bg-dark/10 text-dark"
                        }`}
                      >
                        {isBot ? <Sprout className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </div>
                      <div
                        className={`px-4 py-3 text-sm leading-relaxed ${
                          isBot
                            ? "bg-white border border-dark/5 text-dark rounded-2xl rounded-tl-none shadow-sm"
                            : "bg-primary text-cream rounded-2xl rounded-tr-none shadow-sm"
                        }`}
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-3 max-w-[80%] mr-auto">
                <div className="leaf-shape-sm flex h-8 w-8 shrink-0 items-center justify-center bg-primary/10 text-primary shadow-sm">
                  <Sprout className="h-4 w-4 animate-spin" />
                </div>
                <div className="bg-white border border-dark/5 text-dark rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Form */}
          <div className="border-t border-dark/5 p-4 bg-white/40">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about seeds, weather, plant care..."
                disabled={isLoading}
                className="flex-1 leaf-shape-sm border border-dark/10 bg-white/90 px-4 py-3 text-sm text-dark placeholder-dark/40 outline-none focus:border-primary/50 transition duration-150 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="leaf-shape-sm flex h-11 w-11 shrink-0 items-center justify-center bg-primary text-cream hover:bg-primary/95 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
