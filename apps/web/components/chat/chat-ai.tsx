"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, Send, Bot, User } from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    role: "user" | "ai";
    content: string;
}

export const ChatAI = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "ai",
            content: "Hello! I'm your AI assistant. How can I help you today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);
    const originalInputRef = useRef("");

    const startListening = () => {
        if (
            "webkitSpeechRecognition" in window ||
            "SpeechRecognition" in window
        ) {
            // Store current input to append to
            originalInputRef.current = input;

            const SpeechRecognition =
                (window as any).SpeechRecognition ||
                (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = "en-IN";

            recognitionRef.current.onstart = () => {
                setIsListening(true);
            };

            recognitionRef.current.onresult = (event: any) => {
                const transcript = Array.from(event.results)
                    .map((result: any) => result[0])
                    .map((result) => result.transcript)
                    .join("");

                const previous = originalInputRef.current;
                const combinedInput = previous
                    ? `${previous} ${transcript}`
                    : transcript;

                setInput(combinedInput);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.start();
        } else {
            alert("Speech recognition is not supported in this browser.");
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on message updates
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userContent = input;
        setInput("");
        setIsLoading(true);

        const newUserMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: userContent,
        };

        setMessages((prev) => [...prev, newUserMessage]);

        // Create placeholder for AI response
        const aiMessageId = (Date.now() + 1).toString();
        const aiPlaceholder: Message = {
            id: aiMessageId,
            role: "ai",
            content: "", // Start with empty content
        };
        setMessages((prev) => [...prev, aiPlaceholder]);

        try {
            const response = await axios.post(
                "/api/chat/ai",
                { messages: [...messages, newUserMessage] },
                { responseType: "stream", adapter: "fetch" },
            );

            const reader = response.data.getReader();
            const decoder = new TextDecoder();

            let accumulatedContent = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split("\n");

                for (const line of lines) {
                    if (line.trim() === "data: [DONE]") {
                        setIsLoading(false);
                        break;
                    }
                    if (line.startsWith("data: ")) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            accumulatedContent += data.content;

                            setMessages((prev) =>
                                prev.map((msg) =>
                                    msg.id === aiMessageId
                                        ? {
                                            ...msg,
                                            content: accumulatedContent,
                                        }
                                        : msg,
                                ),
                            );
                        } catch {
                            // Suppress parse errors for partial chunks
                        }
                    }
                }
            }
        } catch (error) {
            console.error("AI Error:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to connect to AI";
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === aiMessageId
                        ? { ...msg, content: `Error: ${errorMessage}` }
                        : msg,
                ),
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col h-full bg-white dark:bg-zinc-950 overflow-hidden">
            {/* Glowing gradient at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none">
                <div className="absolute inset-0 bg-linear-to-t from-primary-color/20 via-primary-color/5 to-transparent blur-3xl" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary-color/30 blur-[100px] rounded-full" />
            </div>

            {/* Messages area */}
            <div
                ref={scrollRef}
                className="relative flex-1 overflow-y-auto px-4 md:px-6 py-8 space-y-6 scrollbar-none"
            >
                <div className="max-w-4xl mx-auto space-y-6">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className={cn(
                                    "flex items-start gap-x-4",
                                    message.role === "user"
                                        ? "flex-row-reverse"
                                        : "flex-row",
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                                        message.role === "ai"
                                            ? "bg-linear-to-br from-primary-color to-indigo-600 text-white"
                                            : "bg-linear-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 text-zinc-700 dark:text-zinc-300",
                                    )}
                                >
                                    {message.role === "ai" ? (
                                        <Bot className="w-5 h-5" />
                                    ) : (
                                        <User className="w-5 h-5" />
                                    )}
                                </div>
                                <div
                                    className={cn(
                                        "max-w-[80%] px-5 py-3.5 rounded-2xl text-base leading-relaxed shadow-sm min-h-11",
                                        message.role === "ai"
                                            ? "bg-zinc-100 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                                            : "bg-linear-to-br from-primary-color to-primary-color/90 text-white shadow-lg shadow-primary-color/20",
                                    )}
                                >
                                    {message.role === "ai" &&
                                        message.content === "" ? (
                                        <div className="flex gap-1.5 py-1">
                                            <span
                                                className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce"
                                                style={{ animationDelay: "0s" }}
                                            />
                                            <span
                                                className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce"
                                                style={{
                                                    animationDelay: "0.2s",
                                                }}
                                            />
                                            <span
                                                className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce"
                                                style={{
                                                    animationDelay: "0.4s",
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-200 dark:prose-pre:bg-zinc-800 prose-pre:p-0 prose-code:text-primary-color prose-code:before:content-none prose-code:after:content-none prose-a:text-primary-color prose-a:no-underline hover:prose-a:underline">
                                            {message.role === "ai" ? (
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        code({
                                                            node,
                                                            inline,
                                                            className,
                                                            children,
                                                            ...props
                                                        }: any) {
                                                            const match =
                                                                /language-(\w+)/.exec(
                                                                    className ||
                                                                    "",
                                                                );
                                                            return !inline &&
                                                                match ? (
                                                                <SyntaxHighlighter
                                                                    {...props}
                                                                    style={
                                                                        vscDarkPlus
                                                                    }
                                                                    language={
                                                                        match[1]
                                                                    }
                                                                    PreTag="div"
                                                                    className="rounded-md bg-zinc-950 p-4 m-0 overflow-x-auto"
                                                                >
                                                                    {String(
                                                                        children,
                                                                    ).replace(
                                                                        /\n$/,
                                                                        "",
                                                                    )}
                                                                </SyntaxHighlighter>
                                                            ) : (
                                                                <code
                                                                    {...props}
                                                                    className={cn(
                                                                        className,
                                                                        "bg-zinc-200 dark:bg-zinc-800 rounded px-1 py-0.5 font-mono text-sm",
                                                                    )}
                                                                >
                                                                    {children}
                                                                </code>
                                                            );
                                                        },
                                                    }}
                                                >
                                                    {message.content}
                                                </ReactMarkdown>
                                            ) : (
                                                <span className="text-white">
                                                    {message.content}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Input area */}
            <div className="relative p-6 pb-8">
                <div className="max-w-4xl mx-auto">
                    <div className="relative group bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-2 transition-all focus-within:ring-2 focus-within:ring-primary-color/40 focus-within:shadow-lg focus-within:shadow-primary-color/10 border border-zinc-200 dark:border-zinc-800 shadow-xl">
                        <div className="flex items-center gap-x-3">
                            <button
                                onClick={toggleListening}
                                className={cn(
                                    "p-3 rounded-xl transition-all",
                                    isListening
                                        ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                        : "text-zinc-500 hover:text-primary-color hover:bg-primary-color/10",
                                )}
                            >
                                <Mic
                                    className={cn(
                                        "w-5 h-5",
                                        isListening && "animate-pulse",
                                    )}
                                />
                            </button>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && handleSend()
                                }
                                placeholder="Message..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-base py-3 px-2 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none"
                                autoFocus
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className={cn(
                                    "p-3 rounded-xl transition-all duration-200",
                                    input.trim()
                                        ? "bg-linear-to-br from-primary-color to-primary-color/90 text-white shadow-lg shadow-primary-color/30 hover:shadow-xl hover:shadow-primary-color/40 hover:scale-105"
                                        : "text-zinc-400 dark:text-zinc-600 cursor-not-allowed",
                                )}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
