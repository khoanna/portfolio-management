"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot } from "lucide-react";
import useAI from "@/services/useAI";
import { useUserContext } from "@/context";
import { ChatResponse } from "@/type/Chat";

interface Message {
    id: number;
    sender: "user" | "model";
    text: string;
}

export default function ChatBoxPage() {
    const { aiLoading, getHistoryChat, generateMessage } = useAI();
    const context = useUserContext();

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            sender: "model",
            text: "Xin chào 👋 Tôi là Walleto Bot — trợ lý tài chính của bạn. Bạn muốn tôi giúp gì hôm nay?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoadingResponse, setIsLoadingResponse] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch chat history on mount
    useEffect(() => {
        const fetchHistory = async () => {
            if (!context?.user?.idUser) return;
            
            try {
                const response = await getHistoryChat(context.user.idUser);
                const history: ChatResponse[] = response?.data || [];
                
                // Convert history to messages format
                const historyMessages: Message[] = history.map((chat, index) => ({
                    id: Date.now() + index,
                    sender: chat.role === "user" ? "user" : "model",
                    text: chat.message,
                }));
                
                // Add history after welcome message
                setMessages((prev) => [prev[0], ...historyMessages]);
            } catch (error) {
                console.error("Error loading chat history:", error);
            }
        };
        
        fetchHistory();
    }, [context?.user?.idUser]);

    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !context?.user?.idUser || isLoadingResponse) return;

        const userMessage = input.trim();
        const newMsg: Message = { id: Date.now(), sender: "user", text: userMessage };
        setMessages((prev) => [...prev, newMsg]);
        setInput("");
        setIsLoadingResponse(true);

        try {
            // Call API to generate response
            const response = await generateMessage({
                body: {
                    idUser: context.user.idUser,
                    userMessage: userMessage,
                }
            });

            // Extract bot response from API - handle {aiResponse: "message"} format
            let botMessage = "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.";
            
            if (response?.data) {
                // If response.data is an object with aiResponse property
                if (typeof response.data === 'object' && response.data.aiResponse) {
                    botMessage = response.data.aiResponse;
                }
                // If response.data is already a string
                else if (typeof response.data === 'string') {
                    botMessage = response.data;
                }
            }
            
            // Clean up message - remove escape characters but keep markdown
            botMessage = botMessage
                .replace(/\\n/g, '\n')           // Replace \n with actual newline
                .replace(/\\"/g, '"')            // Replace \" with "
                .replace(/\\'/g, "'")            // Replace \' with '
                .replace(/\\\\/g, '\\')          // Replace \\ with \
                .trim();                         // Remove extra whitespace
            
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: "model",
                    text: botMessage,
                },
            ]);
        } catch (error) {
            console.error("Error generating message:", error);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: "model",
                    text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
                },
            ]);
        } finally {
            setIsLoadingResponse(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] sm:h-[calc(100vh-2rem)] bg-background rounded-xl border border-[var(--color-border)]/10 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--color-border)]/10 flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold">Chatbot Walleto</h2>
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
                            className={`max-w-[85%] sm:max-w-[70%] px-3 sm:px-4 py-2 sm:py-3 bg-foreground rounded-2xl shadow-sm text-xs sm:text-sm leading-relaxed transition-all whitespace-pre-wrap ${msg.sender === "user"
                                ? " rounded-br-none"
                                : "  rounded-bl-none"
                                }`}
                        >
                            {msg.sender === "model" ? (
                                // Format bot messages with markdown-like styling
                                msg.text.split('\n').map((line, i) => {
                                    // Parse **bold** text
                                    const parts = line.split(/(\*\*.*?\*\*)/g);
                                    return (
                                        <span key={i}>
                                            {parts.map((part, j) => {
                                                if (part.startsWith('**') && part.endsWith('**')) {
                                                    // Bold text
                                                    return <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>;
                                                } else if (part.startsWith('*') && part.endsWith('*')) {
                                                    // Italic text
                                                    return <em key={j} className="italic">{part.slice(1, -1)}</em>;
                                                } else {
                                                    return <span key={j}>{part}</span>;
                                                }
                                            })}
                                            {i < msg.text.split('\n').length - 1 && <br />}
                                        </span>
                                    );
                                })
                            ) : (
                                // User messages - plain text
                                msg.text
                            )}
                        </div>
                    </div>
                ))}
                
                {/* Loading indicator */}
                {isLoadingResponse && (
                    <div className="flex items-center justify-start">
                        <div className="max-w-[85%] sm:max-w-[70%] px-3 sm:px-4 py-2 sm:py-3 bg-foreground rounded-2xl rounded-bl-none shadow-sm">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-[var(--color-text)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-[var(--color-text)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-[var(--color-text)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input box */}
            <div className="p-3 sm:p-4 border-t border-[var(--color-border)]/10 flex items-center gap-2 sm:gap-3 bg-background">
                <input
                    type="text"
                    placeholder="Hỏi gì đó..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={isLoadingResponse}
                    className="flex-1 px-3 sm:px-4 py-2 rounded-full bg-background text-xs sm:text-sm focus:outline-none border border-[var(--color-border)]/10 focus:ring-1 focus:ring-[#0066FF]/40 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                    onClick={handleSend}
                    disabled={isLoadingResponse || !input.trim()}
                    className="bg-[#0066FF] hover:bg-[#3385ff] p-2 rounded-full cursor-pointer transition-transform active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0066FF]"
                >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </div>
        </div>
    );
}
