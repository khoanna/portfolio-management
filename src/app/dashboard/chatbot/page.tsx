"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot } from "lucide-react";

interface Message {
    id: number;
    sender: "user" | "bot";
    text: string;
}

export default function ChatBoxPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            sender: "bot",
            text: "Xin chào 👋 Tôi là Walleto Bot — trợ lý tài chính của bạn. Bạn muốn tôi giúp gì hôm nay?",
        },
    ]);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const newMsg: Message = { id: Date.now(), sender: "user", text: input };
        setMessages((prev) => [...prev, newMsg]);
        setInput("");

        // Giả lập phản hồi bot
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: "bot",
                    text: "Tôi đã ghi nhận yêu cầu của bạn 🤖. Tính năng phản hồi thông minh sẽ sớm hoạt động!",
                },
            ]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] sm:h-[calc(100vh-4rem)] bg-background rounded-xl border border-[var(--color-border)]/10 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--color-border)]/10 flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold">Chatbot Walleto</h2>
                <button className="px-3 py-1 bg-foreground hover:brightness-110 active:scale-95 rounded-md text-xs sm:text-sm font-medium cursor-pointer transition">
                    Hội thoại đã lưu
                </button>
            </div>

            {/* Chat messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto nice-scroll px-4 sm:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4"
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex items-center ${msg.sender === "user" ? "justify-end" : "justify-start"
                            }`}
                    >

                        <div
                            className={`max-w-[85%] sm:max-w-[70%] px-3 sm:px-4 py-2 sm:py-3 bg-foreground rounded-2xl shadow-sm text-xs sm:text-sm leading-relaxed transition-all ${msg.sender === "user"
                                    ? " rounded-br-none"
                                    : "  rounded-bl-none"
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input box */}
            <div className="p-3 sm:p-4 border-t border-[var(--color-border)]/10 flex items-center gap-2 sm:gap-3 bg-background">
                <input
                    type="text"
                    placeholder="Hỏi gì đó..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1 px-3 sm:px-4 py-2 rounded-full bg-background text-xs sm:text-sm focus:outline-none border border-[var(--color-border)]/10 focus:ring-1 focus:ring-[#0066FF]/40"
                />
                <button
                    onClick={handleSend}
                    className="bg-[#0066FF] hover:bg-[#3385ff] p-2 rounded-full cursor-pointer transition-transform active:scale-95 shadow-md"
                >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </div>
        </div>
    );
}
