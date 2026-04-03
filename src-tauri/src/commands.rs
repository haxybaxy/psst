use serde::{Deserialize, Serialize};
use tauri::{Emitter, Manager};

use crate::overlay;

#[derive(Clone, Serialize, Deserialize)]
pub struct MessagePayload {
    pub sender: String,
    pub text: String,
    pub timestamp: u64,
}

#[tauri::command]
pub fn create_overlay(app: tauri::AppHandle) -> Result<(), String> {
    overlay::create_overlay_window(&app).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn destroy_overlay(app: tauri::AppHandle) -> Result<(), String> {
    overlay::destroy_overlay_window(&app);
    Ok(())
}

#[tauri::command]
pub fn show_overlay(app: tauri::AppHandle, message: MessagePayload) -> Result<(), String> {
    let overlay = match app.get_webview_window("overlay") {
        Some(w) => w,
        None => return Ok(()), // overlay not created yet — ignore
    };

    app.emit_to("overlay", "show-message", &message)
        .map_err(|e| e.to_string())?;

    if !overlay.is_visible().unwrap_or(false) {
        overlay.show().map_err(|e| e.to_string())?;
    }

    // Re-apply on every call — macOS can drop this after hide/show cycles
    overlay
        .set_ignore_cursor_events(true)
        .map_err(|e| e.to_string())?;

    // Prevent the overlay from stealing keyboard focus from the main window
    if let Some(main_window) = app.get_webview_window("main") {
        let _ = main_window.set_focus();
    }

    Ok(())
}

#[tauri::command]
pub fn hide_overlay(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(overlay) = app.get_webview_window("overlay") {
        overlay.hide().map_err(|e| e.to_string())?;
    }
    Ok(())
}
