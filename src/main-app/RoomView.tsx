import { useRoom } from "./hooks/useRoom";
import { StatusBar } from "./components/StatusBar";
import { MessageHistory } from "./components/MessageHistory";
import { MessageComposer } from "./components/MessageComposer";

interface RoomViewProps {
  roomCode: string;
  displayName: string;
  onLeave: () => void;
}

export function RoomView({ roomCode, displayName, onLeave }: RoomViewProps) {
  const { messages, peers, isConnected, sendMessage, leaveRoom } = useRoom({
    roomCode,
    displayName,
  });

  const handleLeave = () => {
    leaveRoom();
    onLeave();
  };

  return (
    <>
      <StatusBar
        roomCode={roomCode}
        peers={peers}
        isConnected={isConnected}
        onLeave={handleLeave}
      />
      <MessageHistory messages={messages} currentUser={displayName} />
      <MessageComposer onSend={sendMessage} disabled={!isConnected} />
    </>
  );
}
