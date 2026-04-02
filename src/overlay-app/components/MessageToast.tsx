import { Message } from "../../lib/types";

interface MessageToastProps {
  message: Message;
}

export function MessageToast({ message }: MessageToastProps) {
  return (
    <div className="toast">
      <span className="toast-sender">{message.sender}</span>
      <span className="toast-text">{message.text}</span>
    </div>
  );
}
