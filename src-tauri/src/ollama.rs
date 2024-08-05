use std::thread;
use std::time::Duration;
use tauri_plugin_shell::ShellExt;
use tauri::App;

pub fn run_ollama_serve(app: &App) {
  let sidecar_command = app.shell().sidecar("ollama").unwrap().args(["serve"]);
  sidecar_command.spawn().expect("Failed to spawn sidecar");
  thread::sleep(Duration::from_millis(500));
}
