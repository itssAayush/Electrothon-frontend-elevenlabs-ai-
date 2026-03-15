"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Mic } from "lucide-react";
import { useUser } from "@clerk/nextjs";

type Message = {
  id: number;
  chat_id: number;
  sender_type: "user" | "admin";
  sender_id: string;
  message: string;
  created_at: string;
};

interface DirectChatProps {
  initialQuestion?: string;
  onClose: () => void;
}

export function DirectChat({ initialQuestion, onClose }: DirectChatProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<number | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // TODO: Migrate chat backend to Firebase
  // For now, show the initial question as a system message
  useEffect(() => {
    if (initialQuestion) {
      setMessages([
        {
          id: 1,
          chat_id: 0,
          sender_type: "user",
          sender_id: user?.id || "",
          message: initialQuestion,
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          chat_id: 0,
          sender_type: "admin",
          sender_id: "system",
          message:
            "Support chat is being migrated to Firebase. A staff member will be with you shortly.",
          created_at: new Date().toISOString(),
        },
      ]);
    }
  }, [initialQuestion, user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    setIsLoading(true);
    const messageText = input.trim();
    setInput("");

    // Add optimistic message
    const newMessage: Message = {
      id: Date.now(),
      chat_id: chatId || 0,
      sender_type: "user",
      sender_id: user.id,
      message: messageText,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // TODO: Send message to Firebase backend
    console.warn("Direct chat send is pending Firebase migration.");

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-background border rounded-lg">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold">Support Chat</h2>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_type === "admin"
                ? "justify-start"
                : "justify-end"
                }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${message.sender_type === "admin"
                  ? "bg-muted"
                  : "bg-primary text-primary-foreground"
                  }`}
              >
                {message.message}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => {
              if ("webkitSpeechRecognition" in window) {
                const recognition = new (
                  window as any
                ).webkitSpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = "en-US";

                recognition.onresult = (event: any) => {
                  const transcript = event.results[0][0].transcript;
                  setInput(transcript);
                };

                recognition.start();
              } else {
                alert("Speech recognition is not supported in your browser.");
              }
            }}
            disabled={isLoading}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
