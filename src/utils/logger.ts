// Note: Using direct file system operations for logging

// Frontend logging system initialized

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  stack?: string;
  url?: string;
  userAgent?: string;
}

class Logger {
  private logFileName: string;
  private isInitialized: boolean = false;
  private isInitializing: boolean = false;
  private pendingLogs: LogEntry[] = [];
  private static instance: Logger | null = null;

  constructor() {
    // Prevent multiple instances
    if (Logger.instance) {
      console.log('Logger instance already exists, returning existing instance');
      return Logger.instance;
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    this.logFileName = `claudia_frontend_${timestamp}.log`;
    
    console.log('Frontend Logger created:', this.logFileName);
    
    Logger.instance = this;
    
    // Initialize Tauri logging
    this.initializeTauriLogging();
  }
  
  private async initializeTauriLogging() {
    // Prevent multiple initialization attempts
    if (this.isInitializing || this.isInitialized) {
      console.log('Logger initialization already in progress or completed');
      return;
    }
    
    this.isInitializing = true;
    
    try {
      // Try to import Tauri API directly - it should work in Tauri apps even if window.__TAURI__ is undefined
      const { invoke } = await import('@tauri-apps/api/core');
        
        // Test write with initialization message
        const initMessage = this.formatLogEntry({
          timestamp: new Date().toISOString(),
          level: 'INFO',
          message: 'Frontend logger initialized',
          context: 'Logger',
          url: typeof window !== 'undefined' ? window.location?.href : undefined,
          userAgent: typeof navigator !== 'undefined' ? navigator?.userAgent : undefined,
        });
        
        await invoke('write_log_entry', {
          filename: this.logFileName,
          content: initMessage
        });
        
        this.isInitialized = true;
        this.isInitializing = false;
        console.log(`Frontend logging initialized: logs/${this.logFileName}`);
        
        // Flush any pending logs
        if (this.pendingLogs.length > 0) {
          console.log(`Flushing ${this.pendingLogs.length} pending logs to disk...`);
          for (const entry of this.pendingLogs) {
            await this.writeToFile(entry);
          }
          this.pendingLogs = [];
          console.log('All pending logs flushed successfully');
        }
    } catch (error) {
      console.error('Failed to initialize Tauri logging - DETAILED ERROR:', {
        error: error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace',
        tauriAvailable: typeof window !== 'undefined' && !!(window as any).__TAURI__
      });
      this.isInitialized = false;
      this.isInitializing = false;
    }
  }

  private formatLogEntry(entry: LogEntry): string {
    const { timestamp, level, message, context, stack, url, userAgent } = entry;
    let logLine = `${timestamp} [${context || 'App'}][${level}] ${message}`;
    
    if (stack) {
      logLine += `\nStack: ${stack}`;
    }
    
    if (url) {
      logLine += `\nURL: ${url}`;
    }
    
    if (userAgent) {
      logLine += `\nUser-Agent: ${userAgent}`;
    }
    
    return logLine + '\n';
  }

  private async writeToFile(entry: LogEntry) {
    // If not initialized yet, store in pending
    if (!this.isInitialized && this.pendingLogs.length < 100) {
      this.pendingLogs.push(entry);
      
      // Try to initialize again
      if (!this.isInitialized) {
        this.initializeTauriLogging();
      }
    }
    
    try {
      const logContent = this.formatLogEntry(entry);
      
      // Store in localStorage as backup (limit size)
      try {
        const storageKey = `claudia_logs_${this.logFileName}`;
        const existingLogs = localStorage.getItem(storageKey) || '';
        
        // Limit localStorage usage to 1MB
        if (existingLogs.length < 1024 * 1024) {
          localStorage.setItem(storageKey, existingLogs + logContent);
        }
      } catch (storageError) {
        // localStorage might be full or disabled
      }
      
      // Write to file via Tauri if initialized
      if (this.isInitialized) {
        try {
          const { invoke } = await import('@tauri-apps/api/core');
          
          // Call the Tauri command to write log to file
          await invoke('write_log_entry', { 
            filename: this.logFileName,
            content: logContent 
          });
          
        } catch (tauriError) {
          // Mark as not initialized to retry
          this.isInitialized = false;
          
          console.warn('Failed to write log to file:', tauriError);
        }
      } else {
        console.log('Skipping file write - logger not initialized yet');
      }
    } catch (error) {
      // Silent fail - don't create log loops
      if (import.meta.env.MODE === 'development') {
        console.warn('Logger writeToFile error:', error);
      }
    }
  }



  async log(level: LogLevel, message: string, context?: string, stack?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      stack,
      url: typeof window !== 'undefined' ? window.location?.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator?.userAgent : undefined,
    };

    // Always log to console for development
    const consoleMethod = level === 'ERROR' ? console.error : 
                         level === 'WARN' ? console.warn :
                         level === 'DEBUG' ? console.debug : console.log;
    
    consoleMethod(`[${context || 'App'}] ${message}`, stack ? '' + stack : '');

    // Write to file/storage
    await this.writeToFile(entry);
  }

  async debug(message: string, context?: string) {
    await this.log('DEBUG', message, context);
  }

  async info(message: string, context?: string) {
    await this.log('INFO', message, context);
  }

  async warn(message: string, context?: string) {
    await this.log('WARN', message, context);
  }

  async error(message: string, context?: string, error?: Error) {
    const stack = error?.stack || new Error().stack;
    await this.log('ERROR', message, context, stack);
  }
  
  // Static method to get singleton instance
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
}

// Create singleton logger instance
export const logger = Logger.getInstance();

// Enhanced error handling setup
export function setupErrorHandling() {
  try {
    // Global error handler
    window.addEventListener('error', (event) => {
      logger.error(
        `Uncaught error: ${event.message}`,
        'GlobalErrorHandler',
        new Error(`${event.message} at ${event.filename}:${event.lineno}:${event.colno}`)
      ).catch(() => {}); // Silent fail
      
      // Prevent default error handling in production
      if (import.meta.env.MODE === 'production') {
        event.preventDefault();
      }
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason;
      const errorMessage = reason instanceof Error 
        ? reason.message 
        : typeof reason === 'object' 
          ? JSON.stringify(reason) 
          : String(reason);
      
      logger.error(
        `Unhandled promise rejection: ${errorMessage}`,
        'UnhandledRejection',
        reason instanceof Error ? reason : new Error(errorMessage)
      ).catch(() => {}); // Silent fail
      
      // Prevent default in production
      if (import.meta.env.MODE === 'production') {
        event.preventDefault();
      }
    });

    // Log initialization success
    logger.info('Error handling setup completed', 'Logger').catch(() => {});
    
  } catch (error) {
    console.error('Failed to setup error handling:', error);
  }
}

// Performance logging utility
export async function logPerformance(name: string, startTime: number, context?: string) {
  const duration = performance.now() - startTime;
  await logger.info(`Performance: ${name} took ${duration.toFixed(2)}ms`, context || 'Performance');
}

// Network request logging utility
export async function logNetworkRequest(
  method: string, 
  url: string, 
  status: number, 
  duration: number,
  error?: Error
) {
  const message = `${method} ${url} - ${status} (${duration.toFixed(2)}ms)`;
  
  if (error) {
    await logger.error(`Network error: ${message}`, 'Network', error);
  } else if (status >= 400) {
    await logger.warn(`Network warning: ${message}`, 'Network');
  } else {
    await logger.debug(`Network request: ${message}`, 'Network');
  }
}

// Export logs from localStorage (useful for debugging)
export function exportLogsFromStorage(): string {
  const logs: string[] = [];
  
  try {
    // Get all localStorage keys that match our log pattern
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('claudia_logs_')) {
        const content = localStorage.getItem(key);
        if (content) {
          logs.push(`=== ${key} ===\n${content}`);
        }
      }
    }
  } catch (error) {
    console.error('Failed to export logs from storage:', error);
  }
  
  return logs.join('\n\n');
}

// Clear old logs from localStorage to prevent it from filling up
export function clearOldLogsFromStorage(daysToKeep: number = 7) {
  try {
    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('claudia_logs_claudia_frontend_')) {
        // Extract timestamp from key (format: YYYY-MM-DDTHH-MM-SS)
        const timestampPart = key.substring('claudia_logs_claudia_frontend_'.length, 'claudia_logs_claudia_frontend_'.length + 19);
        try {
          // Convert timestamp format from YYYY-MM-DDTHH-MM-SS to parseable date
          const dateStr = timestampPart.substring(0, 10) + ' ' + 
                         timestampPart.substring(11).replace(/-/g, ':');
          const logDate = new Date(dateStr);
          
          if (!isNaN(logDate.getTime()) && logDate.getTime() < cutoffTime) {
            keysToRemove.push(key);
          }
        } catch (e) {
          // Skip malformed keys
        }
      }
    }
    
    // Remove old logs
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    if (keysToRemove.length > 0) {
      console.log(`Cleared ${keysToRemove.length} old log entries from localStorage`);
    }
  } catch (error) {
    console.error('Failed to clear old logs:', error);
  }
}

// Test function for debugging - can be called from browser console
export function testLogging() {
  console.log('=== Testing Frontend Logging ===');
  console.log('Logger instance:', logger);
  console.log('Tauri available:', typeof window !== 'undefined' && !!(window as any).__TAURI__);
  
  // Test basic logging
  logger.info('Test log entry from manual test', 'Debug').then(() => {
    console.log('Test log completed successfully');
  }).catch((error) => {
    console.error('Test log failed:', error);
  });
  
  // Show pending logs
  console.log('Pending logs count:', (logger as any).pendingLogs?.length || 0);
  console.log('Logger initialized:', (logger as any).isInitialized);
  console.log('Log filename:', (logger as any).logFileName);
  
  return 'Logging test initiated - check console and logs directory';
}

// Direct Tauri test function
export async function testTauriDirect() {
  console.log('=== Testing Direct Tauri Call ===');
  
  try {
    console.log('Attempting to import Tauri API directly...');
    const { invoke } = await import('@tauri-apps/api/core');
    console.log('API imported successfully');
    
    const testContent = `${new Date().toISOString()} [Test][INFO] Direct Tauri test from browser console\n`;
    const filename = 'claudia_frontend_direct_test.log';
    
    console.log('Calling write_log_entry...');
    console.log('Filename:', filename);
    console.log('Content:', testContent);
    
    const result = await invoke('write_log_entry', {
      filename: filename,
      content: testContent
    });
    
    console.log('write_log_entry result:', result);
    console.log('SUCCESS! Check /Users/aaohontsev/Projects/github/claudia/logs/' + filename);
    
    return 'Direct Tauri call successful!';
    
  } catch (error) {
    console.error('Direct Tauri call failed:', {
      error: error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    return 'Direct Tauri call failed: ' + (error instanceof Error ? error.message : String(error));
  }
}

// Check localStorage logs - can be called from browser console  
export function checkLocalStorageLogs() {
  console.log('=== Checking localStorage for logs ===');
  
  const logKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('claudia_logs_')) {
      logKeys.push(key);
      const content = localStorage.getItem(key);
      console.log(`${key}: ${content?.length || 0} characters`);
    }
  }
  
  if (logKeys.length === 0) {
    console.log('No logs found in localStorage');
  } else {
    console.log(`Found ${logKeys.length} log entries in localStorage`);
    
    // Show latest entries from first log
    if (logKeys.length > 0) {
      const latestKey = logKeys[0];
      const content = localStorage.getItem(latestKey);
      if (content) {
        const lines = content.split('\n').filter(line => line.trim());
        console.log(`Latest entries from ${latestKey}:`);
        console.log(lines.slice(-5).join('\n')); // Show last 5 lines
      }
    }
  }
  
  return logKeys;
}

// Make function available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).checkLocalStorageLogs = checkLocalStorageLogs;
}

console.log('Frontend logging system ready');

// Make logger available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).logger = logger;
  (window as any).testTauriDirect = testTauriDirect;
}

// Make test function available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).testLogging = testLogging;
}
