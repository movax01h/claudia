# src-tauri/src Module Documentation

This is the root source directory for the Claudia Tauri backend written in Rust. The codebase implements a comprehensive desktop application that serves as a GUI wrapper and toolkit for Claude Code CLI, providing agent management, session tracking, checkpoint versioning, and usage analytics.

## Main Entry Points

lib.rs - Library entry point that declares all modules and exports the main run function for the Tauri application. Sets up the application builder with necessary plugins and configurations.

main.rs - Application entry point that initializes the complete Tauri application. Handles database initialization, state management setup, and command handler registration. Configures plugins for dialog, shell operations, and sets up global application state including CheckpointState, ProcessRegistryState, ClaudeProcessState, and AgentDb. The main function registers all Tauri command handlers across different functional areas like project management, agent execution, checkpoint operations, MCP server handling, usage tracking, and storage operations.

claude_binary.rs - Centralized Claude Code binary detection and management system. Implements sophisticated binary discovery across multiple installation methods including system installs, NVM environments, Homebrew packages, bundled sidecars, and custom paths. Handles version detection, installation validation, and provides environment setup for Claude Code execution. Supports both development and production deployment scenarios with fallback mechanisms for binary location resolution.

## Module Organization

### checkpoint/
Session checkpoint and timeline management system implementing Git-like versioning for Claude Code sessions. Provides automatic and manual checkpoint creation with file snapshotting, branching capabilities, and restoration functionality. Enables users to save session states, fork conversations, and restore to previous points in development workflows.

Key components:
- manager.rs - Core checkpoint operations and session state tracking
- state.rs - Global checkpoint state management across sessions
- storage.rs - Persistent storage with content-addressable file system
- mod.rs - Type definitions and data structures for checkpoints

### commands/
Tauri command handlers organized by functional area. Each module exposes async functions that can be called from the frontend via Tauri's IPC mechanism. Handles all user interactions including project discovery, agent execution, usage analytics, and system configuration.

Key modules:
- agents.rs - Agent CRUD operations, execution management, and GitHub integration
- claude.rs - Claude Code session management and project operations  
- mcp.rs - Model Context Protocol server configuration and management
- usage.rs - Token usage tracking, cost calculation, and analytics
- storage.rs - Database inspection and management tools
- slash_commands.rs - Custom slash command discovery and execution

### process/
Process lifecycle management for long-running operations. Provides registry-based tracking of agent executions and Claude Code sessions with proper cleanup, output streaming, and graceful termination capabilities.

Components:
- registry.rs - Process tracking and lifecycle management
- mod.rs - Module exports and type definitions

## Application Architecture

The backend follows a modular architecture with clear separation of concerns:

1. **State Management** - Global application state using Tauri's managed state system with thread-safe access patterns via Arc<Mutex<T>> for shared resources.

2. **Database Layer** - SQLite database for persistent storage of agents, execution history, and application settings. Includes migration support and schema evolution capabilities.

3. **Process Management** - Robust process handling for Claude Code execution with support for both system binaries and bundled sidecars. Handles output streaming, error capture, and graceful shutdown.

4. **Session Tracking** - Comprehensive session management with automatic discovery of Claude Code projects and sessions from the ~/.claude directory structure.

5. **Binary Detection** - Advanced Claude Code binary discovery supporting multiple installation methods and deployment scenarios.

## Key Features Implemented

**Agent Management** - Complete CRUD operations for custom AI agents with configurable system prompts, model selection, tool permissions, and execution environments. Supports agent import/export and GitHub integration for community sharing.

**Project Discovery** - Automatic scanning and parsing of Claude Code projects from ~/.claude/projects with session enumeration and metadata extraction.

**Checkpoint System** - Git-like versioning for Claude Code sessions with branching, restoration, and diff capabilities. Implements content-addressable storage for efficient file deduplication.

**Usage Analytics** - Comprehensive token usage tracking with cost calculation, model-specific metrics, and time-based reporting. Supports both Claude 4 Opus and Sonnet pricing models.

**MCP Integration** - Full Model Context Protocol server management with configuration import from Claude Desktop, connection testing, and scope-based organization.

**Process Monitoring** - Real-time process tracking with output streaming, status monitoring, and graceful termination for both agent executions and Claude Code sessions.

**Storage Tools** - Database inspection and management interface for debugging and administrative operations.

**Slash Commands** - Custom command discovery and management system supporting both project and user-scoped commands with YAML frontmatter.

## Security Considerations

The application implements several security measures:
- Input validation for all command parameters
- Path traversal protection for file operations  
- SQL injection prevention through parameterized queries
- Process isolation for agent executions
- Permission-based tool access control
- Secure environment variable handling

## Development Patterns

Code follows Rust best practices with:
- Comprehensive error handling using anyhow and custom error types
- Async/await patterns for non-blocking operations
- Thread-safe state management with proper locking strategies
- Structured logging with configurable levels
- Type safety through strong typing and serialization contracts
- Modular organization with clear interface boundaries
