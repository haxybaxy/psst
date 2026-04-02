import { useState } from "react";
import { isSupabaseConfigured } from "../../lib/supabase";

interface RoomJoinProps {
  onJoin: (roomCode: string, displayName: string) => void;
}

export function RoomJoin({ onJoin }: RoomJoinProps) {
  const [roomCode, setRoomCode] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim() && displayName.trim()) {
      onJoin(roomCode.trim(), displayName.trim());
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="room-join">
        <h2>Configure Supabase</h2>
        <p className="setup-hint">
          Create a <code>.env</code> file in the project root with:
        </p>
        <pre className="env-example">
          {`VITE_SUPABASE_URL=your_project_url\nVITE_SUPABASE_ANON_KEY=your_anon_key`}
        </pre>
        <p className="setup-hint">Then restart the app.</p>
      </div>
    );
  }

  return (
    <div className="room-join">
      <h2>Join a Room</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          autoFocus
        />
        <input
          type="text"
          placeholder="Room code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />
        <button type="submit" disabled={!roomCode.trim() || !displayName.trim()}>
          Join
        </button>
      </form>
    </div>
  );
}
