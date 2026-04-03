import { useState, useEffect, useCallback, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { supabase } from "../../lib/supabase";
import { Message, Peer } from "../../lib/types";
import type { RealtimeChannel } from "@supabase/supabase-js";

const MAX_MESSAGES = 200;

interface UseRoomOptions {
  roomCode: string;
  displayName: string;
}

export function useRoom({ roomCode, displayName }: UseRoomOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase.channel(`psst:${roomCode}`, {
      config: {
        broadcast: { self: false },
        presence: { key: displayName },
      },
    });

    channel
      .on("broadcast", { event: "message" }, (data: { payload: Message }) => {
        const message = data.payload;
        setMessages((prev) => [...prev, message].slice(-MAX_MESSAGES));
        invoke("show_overlay", { message });
      })
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const peerList: Peer[] = Object.entries(state).map(
          ([name, presences]) => ({
            name,
            joinedAt:
              (presences as Array<{ joined_at?: number }>)[0]?.joined_at ??
              Date.now(),
          }),
        );
        setPeers(peerList);
      })
      .subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
          invoke("create_overlay");
          await channel.track({ joined_at: Date.now() });
        }
      });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
      setIsConnected(false);
      invoke("destroy_overlay");
    };
  }, [roomCode, displayName]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!channelRef.current) return;

      const message: Message = {
        id: crypto.randomUUID(),
        sender: displayName,
        text,
        timestamp: Date.now(),
      };

      channelRef.current.send({
        type: "broadcast",
        event: "message",
        payload: message,
      });

      // Add to local history (sender won't receive their own broadcast)
      setMessages((prev) => [...prev, message].slice(-MAX_MESSAGES));
    },
    [displayName],
  );

  const leaveRoom = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }
    setIsConnected(false);
    setMessages([]);
    setPeers([]);
    invoke("destroy_overlay");
  }, []);

  return { messages, peers, isConnected, sendMessage, leaveRoom };
}
