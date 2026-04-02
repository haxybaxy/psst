# psst

Secret messaging for co-founders during live demos. Messages appear as overlay notifications on your screen that are **invisible to screen sharing** — so you can communicate with your team while presenting without the audience seeing a thing.

## How it works

- One co-founder sends a message through the app
- The message appears as a floating toast notification on the other co-founders' screens
- The overlay uses OS-level content protection (`NSWindow.sharingType = .none` on macOS) so screen capture, screen share, and recording apps cannot see it
- Messages are ephemeral — sent via Supabase Realtime Broadcast, never stored in any database

## Features

- **Screen-share invisible overlay** — notifications are hidden from Zoom, Meet, OBS, and any screen recording
- **Click-through** — overlay never steals focus or interferes with your demo
- **Room-based** — join with a simple room code, see who's connected
- **Global hotkey** — press `Cmd+Shift+P` from any app to open the composer
- **System tray** — lives in your menu bar, main window hides on close
- **Ephemeral** — nothing is persisted, messages exist only in transit

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri CLI prerequisites](https://v2.tauri.app/start/prerequisites/) for macOS
- A free [Supabase](https://supabase.com/) project (for real-time messaging)

## Setup

1. **Clone and install dependencies:**

   ```bash
   git clone <repo-url>
   cd psst
   npm install
   ```

2. **Configure Supabase:**

   Create a free project at [supabase.com](https://supabase.com/), then create a `.env` file in the project root:

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

   No database tables or RLS policies needed — the app only uses Realtime Broadcast.

3. **Run in development:**

   ```bash
   npm run tauri dev
   ```

## Usage

1. Launch the app on each co-founder's machine
2. Enter your name and a shared room code (e.g. `demo-2026`)
3. Once everyone's joined, type a message and hit Send
4. Messages appear as toasts in the top-right corner — visible to you, invisible to screen share
5. Press `Cmd+Shift+P` from anywhere to quickly pull up the composer

## Building

```bash
npm run tauri build
```

The built app will be in `src-tauri/target/release/bundle/`.

## Tech stack

- **Tauri 2** — native desktop app with content-protected windows
- **React 19** — frontend UI
- **TypeScript** — type safety
- **Vite** — fast dev server and bundling
- **Supabase Realtime** — ephemeral broadcast messaging

## Project structure

```
src/                          # Frontend (React + TypeScript)
  main.tsx                    # Entry point — routes main vs overlay window
  lib/                        # Shared utilities
    supabase.ts               # Supabase client
    types.ts                  # Message, Peer interfaces
    events.ts                 # Tauri event constants
  main-app/                   # Main window UI
    MainApp.tsx               # Root component
    RoomView.tsx              # Active room view
    components/
      RoomJoin.tsx            # Room code + name input
      MessageComposer.tsx     # Text input + send
      MessageHistory.tsx      # Message list
      StatusBar.tsx           # Connection status + peer count
    hooks/
      useRoom.ts              # Supabase channel lifecycle
  overlay-app/                # Overlay window UI
    OverlayApp.tsx            # Root component
    components/
      MessageStack.tsx        # Toast stack manager
      MessageToast.tsx        # Single toast notification
    hooks/
      useOverlayMessages.ts   # Listens for Tauri events

src-tauri/                    # Backend (Rust)
  src/
    lib.rs                    # App setup, plugins, window events
    commands.rs               # show_overlay, hide_overlay commands
    overlay.rs                # Overlay window creation
    tray.rs                   # System tray
```

## Platform support

Currently macOS only. Windows support is possible (Tauri's `content_protected` maps to `SetWindowDisplayAffinity(WDA_EXCLUDEFROMCAPTURE)` on Windows 10 2004+) but hasn't been tested.

## License

MIT
