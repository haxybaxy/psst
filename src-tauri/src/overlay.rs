use tauri::{AppHandle, Manager, WebviewUrl, WebviewWindowBuilder};

const OVERLAY_WIDTH: f64 = 430.0;
const OVERLAY_HEIGHT: f64 = 400.0;

pub fn create_overlay_window(app: &AppHandle) -> tauri::Result<()> {
    // Already exists — nothing to do
    if app.get_webview_window("overlay").is_some() {
        return Ok(());
    }

    let monitor = app
        .primary_monitor()?
        .expect("no primary monitor found");
    let size = monitor.size();
    let scale = monitor.scale_factor();

    let screen_width = size.width as f64 / scale;
    let x = screen_width - OVERLAY_WIDTH;

    let overlay = WebviewWindowBuilder::new(
        app,
        "overlay",
        WebviewUrl::App("index.html?window=overlay".into()),
    )
    .title("psst-overlay")
    .decorations(false)
    .transparent(true)
    .always_on_top(true)
    .content_protected(true)
    .skip_taskbar(true)
    .focused(false)
    .visible(false)
    .inner_size(OVERLAY_WIDTH, OVERLAY_HEIGHT)
    .position(x, 0.0)
    .build()?;

    overlay.set_ignore_cursor_events(true)?;

    Ok(())
}

pub fn destroy_overlay_window(app: &AppHandle) {
    if let Some(overlay) = app.get_webview_window("overlay") {
        let _ = overlay.hide();
        let _ = overlay.destroy();
    }
}
