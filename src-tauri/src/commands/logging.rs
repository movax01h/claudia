use std::fs::{File, OpenOptions};
use std::io::{Write, BufWriter};
use tauri::State;
use std::sync::Mutex;
use std::collections::HashMap;


// Global state to manage log file handles
#[derive(Default)]
pub struct LogState {
    files: Mutex<HashMap<String, BufWriter<File>>>,
}

#[tauri::command]
pub async fn write_log_entry(
    filename: String,
    content: String,
    state: State<'_, LogState>,
) -> Result<(), String> {
    // Get project root and logs directory
    let project_root = crate::logging::get_project_root();
    let logs_dir = project_root.join("logs");


    
    // Ensure logs directory exists
    std::fs::create_dir_all(&logs_dir)
        .map_err(|e| format!("Failed to create logs directory: {}", e))?;
    
    let log_path = logs_dir.join(&filename);
    
    let mut files = state.files.lock().map_err(|e| format!("Lock error: {}", e))?;
    
    // Get or create file handle
    if !files.contains_key(&filename) {
        let file = OpenOptions::new()
            .create(true)
            .append(true)
            .open(&log_path)
            .map_err(|e| format!("Failed to open log file: {}", e))?;
        
        files.insert(filename.clone(), BufWriter::new(file));
    }
    
    // Write content
    if let Some(writer) = files.get_mut(&filename) {
        writer.write_all(content.as_bytes())
            .map_err(|e| format!("Failed to write to log file: {}", e))?;
        writer.flush()
            .map_err(|e| format!("Failed to flush log file: {}", e))?;
    }
    
    Ok(())
}