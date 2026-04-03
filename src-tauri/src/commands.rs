use serde::{Deserialize, Serialize};
use tauri::{Emitter, Manager};

use crate::overlay;

#[cfg(target_os = "macos")]
fn show_overlay_without_focus(overlay: &tauri::WebviewWindow) -> Result<(), String> {
    use objc2_app_kit::NSWindow;

    let ns_ptr = overlay.ns_window().map_err(|e| e.to_string())?;
    let ns_window: &NSWindow = unsafe { &*(ns_ptr as *const NSWindow) };
    ns_window.orderFrontRegardless();
    Ok(())
}

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
        #[cfg(target_os = "macos")]
        show_overlay_without_focus(&overlay)?;

        #[cfg(not(target_os = "macos"))]
        overlay.show().map_err(|e| e.to_string())?;
    }

    // Re-apply on every call — macOS can drop this after hide/show cycles
    overlay
        .set_ignore_cursor_events(true)
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn hide_overlay(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(overlay) = app.get_webview_window("overlay") {
        overlay.hide().map_err(|e| e.to_string())?;
    }
    Ok(())
}
