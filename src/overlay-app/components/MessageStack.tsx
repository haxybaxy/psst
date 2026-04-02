import { MessageToast } from "./MessageToast";
import { useOverlayMessages } from "../hooks/useOverlayMessages";

export function MessageStack() {
  const { toasts } = useOverlayMessages();

  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <MessageToast key={toast.id} message={toast} />
      ))}
    </div>
  );
}
