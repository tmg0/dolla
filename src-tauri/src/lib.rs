mod ollama;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .setup(|app| {
          ollama::run_ollama_serve(app);
          Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
