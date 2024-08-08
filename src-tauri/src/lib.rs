use tauri::{Manager, WindowEvent};

mod core;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|_app, _args, _cwd| {}))
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .setup(|app| {
            core::setup(app);
            Ok(())
        })
        .on_window_event(move |window, event| {
            let app_handle = window.app_handle();
            match event {
                WindowEvent::Destroyed => core::cleanup(app_handle),
                _ => {}
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
