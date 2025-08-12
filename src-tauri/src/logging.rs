use chrono::Local;
use std::path::PathBuf;
use std::fs;
use log::LevelFilter;

pub fn init_logging(project_root: PathBuf) -> Result<(), Box<dyn std::error::Error>> {
    // Create logs directory in project root
    let logs_dir = project_root.join("logs");
    
    println!("Creating logs directory: {:?}", logs_dir);
    
    // Ensure logs directory exists
    if let Err(e) = fs::create_dir_all(&logs_dir) {
        eprintln!("Failed to create logs directory {:?}: {}", logs_dir, e);
        return Err(Box::new(e));
    }
    
    println!("Logs directory created successfully");
    
    // Create timestamped log file
    let timestamp = Local::now().format("%Y%m%d_%H%M%S");
    let log_file = logs_dir.join(format!("claudia_rust_{}.log", timestamp));
    
    // Configure fern logger
    let dispatch_result = fern::Dispatch::new()
        .format(|out, message, record| {
            out.finish(format_args!(
                "{}[{}][{}] {}",
                Local::now().format("%Y-%m-%d %H:%M:%S%.3f"),
                record.target(),
                record.level(),
                message
            ))
        })
        .level(LevelFilter::Debug)
        // Output to both file and stdout
        .chain(std::io::stdout())
        .chain(fern::log_file(&log_file)?)
        .apply();
        
    if let Err(e) = dispatch_result {
        eprintln!("Failed to apply fern logger configuration: {}", e);
        return Err(Box::new(e));
    }

    log::info!("Logging initialized - log file: {:?}", log_file);
    
    // Set panic hook to log panics
    std::panic::set_hook(Box::new(move |panic_info| {
        let msg = if let Some(s) = panic_info.payload().downcast_ref::<&str>() {
            s
        } else if let Some(s) = panic_info.payload().downcast_ref::<String>() {
            s
        } else {
            "Unknown panic payload"
        };
        
        let location = if let Some(location) = panic_info.location() {
            format!(" at {}:{}:{}", location.file(), location.line(), location.column())
        } else {
            String::new()
        };
        
        log::error!("PANIC: {}{}", msg, location);
    }));
    
    Ok(())
}

// Helper function to get the project root for logging
pub fn get_project_root() -> PathBuf {
    // For app bundle launches, use a fixed path to the project directory
    let hardcoded_project_path = PathBuf::from("/Users/aaohontsev/Projects/github/claudia");
    
    // Check if we're running from the hardcoded project path (development mode)
    if hardcoded_project_path.join("Cargo.toml").exists() {
        return hardcoded_project_path;
    }
    
    // Try to find project root by looking for Cargo.toml (fallback for other scenarios)
    let mut current = std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."));
    
    loop {
        if current.join("Cargo.toml").exists() {
            return current;
        }
        
        if let Some(parent) = current.parent() {
            current = parent.to_path_buf();
        } else {
            // Final fallback - return the hardcoded path even if Cargo.toml doesn't exist
            // This ensures logs are always written to the expected location
            return hardcoded_project_path;
        }
    }
}