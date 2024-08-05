use tauri::App;

pub mod ollama;

pub fn setup(app: &App) {
  ollama::run_ollama_serve(app);
}
