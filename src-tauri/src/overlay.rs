use tauri::{WebviewUrl, WebviewWindowBuilder};

pub fn create_overlay(app: &tauri::App) -> tauri::Result<()> {
    let monitor = app.primary_monitor()?.expect("no primary monitor found");
    let size = monitor.size();
    let scale = monitor.scale_factor();

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
    .visible(false)
    .inner_size(size.width as f64 / scale, size.height as f64 / scale)
    .position(0.0, 0.0)
    .build()?;

    overlay.set_ignore_cursor_events(true)?;

    Ok(())
}
