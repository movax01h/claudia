/**
 * Utility class to manage AbortController instances efficiently
 * Prevents memory leaks by properly cleaning up unused controllers
 */
class AbortControllerManager {
  private activeControllers = new Set<AbortController>();

  /**
   * Creates a new AbortController and tracks it for cleanup
   */
  create(): AbortController {
    const controller = new AbortController();
    this.activeControllers.add(controller);

    // Add cleanup when the controller is aborted
    controller.signal.addEventListener('abort', () => {
      this.activeControllers.delete(controller);
    }, { once: true });

    return controller;
  }

  /**
   * Aborts and removes a specific controller
   */
  abort(controller: AbortController): void {
    if (this.activeControllers.has(controller)) {
      controller.abort();
      this.activeControllers.delete(controller);
    }
  }

  /**
   * Aborts all active controllers and clears the set
   */
  abortAll(): void {
    for (const controller of this.activeControllers) {
      controller.abort();
    }
    this.activeControllers.clear();
  }

  /**
   * Gets the number of active controllers
   */
  getActiveCount(): number {
    return this.activeControllers.size;
  }

  /**
   * Cleanup inactive controllers that may have been forgotten
   */
  cleanup(): void {
    const toRemove: AbortController[] = [];
    
    for (const controller of this.activeControllers) {
      if (controller.signal.aborted) {
        toRemove.push(controller);
      }
    }

    for (const controller of toRemove) {
      this.activeControllers.delete(controller);
    }
  }
}

// Export a singleton instance
export const abortManager = new AbortControllerManager();

/**
 * Hook-friendly function to create an AbortController
 */
export function createManagedAbortController(): AbortController {
  return abortManager.create();
}