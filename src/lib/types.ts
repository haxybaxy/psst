export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}

export interface Peer {
  name: string;
  joinedAt: number;
}
