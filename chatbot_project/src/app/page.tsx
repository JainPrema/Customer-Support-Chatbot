"use client";

import { useState } from "react";
import { Send, Bot, User } from "lucide-react";

export default function HelpMateChat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi, I’m HelpMate — your friendly support assistant! How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      const data = await res.json();
      const reply = data.answer || "🤖 Sorry, I couldn’t understand that.";

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: reply,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setIsTyping(false);
      }, 600);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Something went wrong. Please try again later.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6">
      <div className="w-full max-w-lg bg-gray-900/90 text-white backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700 flex flex-col h-[80vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-center py-4 rounded-t-3xl font-extrabold text-2xl shadow-lg tracking-wide">
          <div className="flex items-center justify-center gap-2 text-white drop-shadow-lg">
            <Bot size={26} className="text-yellow-200" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-200 font-extrabold">
              HelpMate Support
            </span>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-4 rounded-2xl shadow-md border ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-400 text-white"
                    : "bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600 text-gray-100"
                }`}
              >
                <div className="flex items-center gap-2 mb-1 text-xs text-gray-300">
                  {msg.sender === "user" ? <User size={14} /> : <Bot size={14} />}
                  <span>{msg.time}</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed text-sm">{msg.text}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-gray-400 text-xs animate-pulse">
              <Bot size={14} />
              <span>HelpMate is typing...</span>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-gray-700 flex items-center gap-2 bg-gray-800/90 rounded-b-3xl">
          <input
            className="flex-1 px-4 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={sendMessage}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white p-2 rounded-full transition shadow-lg"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
