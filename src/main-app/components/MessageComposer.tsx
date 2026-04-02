import { useState, useRef, useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { EVENTS } from "../../lib/events";

interface MessageComposerProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function MessageComposer({ onSend, disabled }: MessageComposerProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unlisten = listen(EVENTS.FOCUS_COMPOSER, () => {
      inputRef.current?.focus();
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText("");
    }
  };

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        autoFocus
      />
      <button type="submit" disabled={disabled || !text.trim()}>
        Send
      </button>
    </form>
  );
}
