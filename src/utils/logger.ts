// Note: Using direct file system operations for logging

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

  constructor() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    this.logFileName = `claudia_frontend_${timestamp}.log`;
    
    // Log initialization - but don't block on it
    setTimeout(() => {
      this.info('Frontend logger initialized', 'Logger').catch(() => {});
    }, 100);
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
    try {
      const logContent = this.formatLogEntry(entry);
      
      // Store in localStorage as backup
      const storageKey = `claudia_logs_${this.logFileName}`;
      const existingLogs = localStorage.getItem(storageKey) || '';
      localStorage.setItem(storageKey, existingLogs + logContent);
      
      // Also try to write to file via Tauri if available
      if (typeof window !== 'undefined' && (window as any).__TAURI__) {
        try {
          const { invoke } = await import('@tauri-apps/api/core');
          await invoke('write_log_entry', { 
            filename: this.logFileName,
            content: logContent 
          });
          console.debug('Successfully wrote to log file:', this.logFileName);
        } catch (tauriError) {
          console.debug('Tauri logging failed:', tauriError);
          // localStorage backup is sufficient
        }
      } else {
        console.debug('Tauri not available, using localStorage only');
      }
    } catch (error) {
      // Silent fail - don't block the app
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
}

// Create singleton logger instance
export const logger = new Logger();

// Enhanced error handling setup
export function setupErrorHandling() {
  try {
    // Only add error listeners, don't override console methods
    window.addEventListener('error', (event) => {
      logger.error(
        `Uncaught error: ${event.message}`,
        'GlobalErrorHandler',
        new Error(`${event.message} at ${event.filename}:${event.lineno}:${event.colno}`)
      ).catch(() => {}); // Silent fail
    });

    window.addEventListener('unhandledrejection', (event) => {
      logger.error(
        `Unhandled promise rejection: ${event.reason}`,
        'UnhandledRejection',
        event.reason instanceof Error ? event.reason : new Error(String(event.reason))
      ).catch(() => {}); // Silent fail
    });

    console.log('Error handling setup completed');
  } catch (error) {
    // Silent fail
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