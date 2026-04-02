use serde::{Deserialize, Serialize};
use tauri::{Emitter, Manager};

#[derive(Clone, Serialize, Deserialize)]
pub struct MessagePayload {
    pub sender: String,
    pub text: String,
    pub timestamp: u64,
}

#[tauri::command]
pub fn show_overlay(app: tauri::AppHandle, message: MessagePayload) -> Result<(), String> {
    let overlay = app
        .get_webview_window("overlay")
        .ok_or("overlay window not found")?;

    app.emit_to("overlay", "show-message", &message)
        .map_err(|e| e.to_string())?;
    overlay.show().map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn hide_overlay(app: tauri::AppHandle) -> Result<(), String> {
    let overlay = app
        .get_webview_window("overlay")
        .ok_or("overlay window not found")?;

    overlay.hide().map_err(|e| e.to_string())?;

    Ok(())
}
