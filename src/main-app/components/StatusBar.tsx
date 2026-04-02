import { Peer } from "../../lib/types";

interface StatusBarProps {
  roomCode: string;
  peers: Peer[];
  isConnected: boolean;
  onLeave: () => void;
}

export function StatusBar({
  roomCode,
  peers,
  isConnected,
  onLeave,
}: StatusBarProps) {
  return (
    <div className="status-bar">
      <div className="status-left">
        <span className={`status-dot ${isConnected ? "connected" : ""}`} />
        <span className="room-code">{roomCode}</span>
        <span className="peer-count">
          {peers.length} {peers.length === 1 ? "person" : "people"}
        </span>
      </div>
      <button className="leave-btn" onClick={onLeave}>
        Leave
      </button>
    </div>
  );
}
