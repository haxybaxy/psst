import { useState } from "react";
import { RoomJoin } from "./components/RoomJoin";
import { RoomView } from "./RoomView";
import "./MainApp.css";

export function MainApp() {
  const [roomInfo, setRoomInfo] = useState<{
    roomCode: string;
    displayName: string;
  } | null>(null);

  if (!roomInfo) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>psst</h1>
          <p className="tagline">Secret messages for live demos</p>
        </header>
        <RoomJoin
          onJoin={(roomCode, displayName) =>
            setRoomInfo({ roomCode, displayName })
          }
        />
      </div>
    );
  }

  return (
    <div className="app">
      <RoomView
        roomCode={roomInfo.roomCode}
        displayName={roomInfo.displayName}
        onLeave={() => setRoomInfo(null)}
      />
    </div>
  );
}
