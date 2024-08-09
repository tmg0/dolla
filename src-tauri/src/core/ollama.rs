use super::GlobalState;
use std::sync::Mutex;
use std::thread;
use std::time::Duration;
use tauri::{AppHandle, Manager};
use tauri_plugin_shell::ShellExt;

pub fn run_ollama_serve(app: &AppHandle) {
    let sidecar_command = app.shell().sidecar("ollama").unwrap().args(["serve"]);
    let (_, child) = sidecar_command.spawn().expect("Failed to spawn sidecar");
    thread::sleep(Duration::from_millis(500));
    let state = app.state::<Mutex<GlobalState>>();
    let mut state = state.lock().unwrap();
    state.services.push(child);
}
