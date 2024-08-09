use nix::sys::signal::{kill, Signal};
use nix::unistd::Pid;
use std::sync::Mutex;
use tauri::{App, AppHandle, Manager};
use tauri_plugin_shell::process::CommandChild;

pub mod ollama;

#[derive(Default)]
struct GlobalState {
    services: Vec<CommandChild>,
}

pub fn setup(app: &App) -> Result<(), Box<dyn std::error::Error>> {
    app.manage(Mutex::new(GlobalState::default()));
    ollama::run_ollama_serve(app);
    Ok(())
}

pub fn cleanup(app: &AppHandle) {
    let state = app.state::<Mutex<GlobalState>>();
    let state = state.lock().unwrap();
    for service in &state.services {
        let pid = service.pid() as i32;
        kill(Pid::from_raw(pid), Signal::SIGTERM).unwrap();
    }
}
