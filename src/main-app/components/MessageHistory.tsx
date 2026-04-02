import { useEffect, useRef } from "react";
import { Message } from "../../lib/types";

interface MessageHistoryProps {
  messages: Message[];
  currentUser: string;
}

export function MessageHistory({ messages, currentUser }: MessageHistoryProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="message-history empty">
        <p>No messages yet. Say something!</p>
      </div>
    );
  }

  return (
    <div className="message-history">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`message ${msg.sender === currentUser ? "own" : "other"}`}
        >
          <span className="message-sender">{msg.sender}</span>
          <span className="message-text">{msg.text}</span>
          <span className="message-time">
            {new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
