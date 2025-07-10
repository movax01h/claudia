# Claudia Tauri Backend - Complete Documentation

This directory contains the complete Tauri backend implementation for Claudia, a powerful GUI application and toolkit for Claude Code. The backend is built with Rust and provides comprehensive desktop application functionality including native system integration, secure IPC communication, and cross-platform compatibility.

## Project Overview

Claudia transforms how users interact with Claude Code by providing a beautiful desktop interface that bridges the gap between command-line tools and visual experiences. The Tauri backend handles all native operations, system integration, and security while maintaining high performance and reliability.

## Architecture Overview

The Tauri backend follows a modular architecture with clear separation of concerns across multiple layers:

### Core Application Layer
**main.rs** - Primary application entry point that initializes the complete Tauri environment including database connections, state management, plugin registration, and command handler setup. Configures global application state including CheckpointState for session versioning, ProcessRegistryState for process management, ClaudeProcessState for Claude Code integration, and AgentDb for persistent storage.

**lib.rs** - Library interface that declares all modules and provides the main run function for Tauri application initialization. Handles plugin configuration and application builder setup.

**build.rs** - Build script that integrates with Tauri's build system for code generation and compilation optimization.

### System Integration Layer
**claude_binary.rs** - Sophisticated Claude Code binary detection and management system supporting multiple installation methods including system packages, NVM environments, Homebrew installations, bundled sidecars, and custom user paths. Implements version detection, compatibility checking, and environment setup for proper Claude Code execution across different deployment scenarios.

### Business Logic Modules

#### Session Management (checkpoint/)
Implements a Git-like versioning system for Claude Code sessions enabling users to save, restore, and branch conversation states with complete file system snapshots.

**checkpoint/manager.rs** - Core checkpoint operations including creation, restoration, forking, and timeline management with comprehensive file tracking and automatic checkpoint evaluation.

**checkpoint/state.rs** - Global checkpoint state management providing thread-safe access to checkpoint managers across all active sessions with proper lifecycle management.

**checkpoint/storage.rs** - Persistent storage implementation using content-addressable file systems with Zstd compression for efficient space utilization and garbage collection for cleanup.

**checkpoint/mod.rs** - Type definitions and data structures for the complete checkpoint system including timeline management, file snapshots, and metadata tracking.

#### Command Interface (commands/)
Tauri command handlers that bridge frontend React components with backend Rust functionality through secure IPC communication.

**commands/agents.rs** - Comprehensive agent lifecycle management including CRUD operations, execution handling with process spawning, real-time metrics calculation, GitHub integration for community sharing, and sophisticated binary detection with multi-platform support.

**commands/claude.rs** - Direct Claude Code integration providing project discovery from ~/.claude directories, session management with JSONL parsing, execution capabilities with streaming output, and settings management.

**commands/mcp.rs** - Model Context Protocol server management with support for stdio and SSE transports, configuration import from Claude Desktop, connection testing, and scope-based organization.

**commands/usage.rs** - Comprehensive analytics and reporting system tracking token usage, cost calculation using Claude 4 pricing models, multi-dimensional analytics by model/date/project, and historical data analysis.

**commands/storage.rs** - Database management and inspection tools providing administrative access with full CRUD operations, query execution, and schema management capabilities.

**commands/slash_commands.rs** - Custom command discovery and management enabling users to create reusable command templates with YAML frontmatter, namespace support, and automation capabilities.

**commands/mod.rs** - Module exports making all command functions available for Tauri registration.

#### Process Management (process/)
Centralized process lifecycle management for long-running operations with comprehensive tracking, monitoring, and control capabilities.

**process/registry.rs** - Process registry implementation providing thread-safe tracking of all running processes, output capture, graceful termination, and automatic cleanup with cross-platform support.

**process/mod.rs** - Module exports and type definitions for process management components.

## Configuration System

### Cargo Configuration (Cargo.toml)
Defines the Rust project structure with library crate type supporting cdylib and staticlib for Tauri integration. Includes comprehensive dependency management with feature flags for optimal builds.

**Core Dependencies:**
- **tauri**: Framework with protocol-asset, tray-icon, and image-png features
- **tokio**: Async runtime with full feature set for concurrent operations  
- **rusqlite**: SQLite database with bundled driver for cross-platform compatibility
- **serde/serde_json**: Serialization framework for IPC communication
- **chrono**: Date/time handling with timezone support
- **anyhow**: Error handling with context propagation
- **reqwest**: HTTP client for GitHub integration and external API calls

**Specialized Dependencies:**
- **zstd**: Compression for checkpoint storage optimization
- **sha2**: Cryptographic hashing for content-addressable storage
- **uuid**: Unique identifier generation for sessions and checkpoints
- **walkdir**: Recursive directory traversal for file discovery
- **regex**: Pattern matching for output parsing and validation
- **base64**: Binary data encoding for database storage

**Platform-Specific Dependencies:**
- **cocoa/objc**: macOS native integration for system-level operations

### Tauri Configuration (tauri.conf.json)
Comprehensive application configuration defining security policies, permissions, build processes, and deployment settings.

**Application Settings:**
- Window configuration with responsive design (1200x800 default, 800x600 minimum)
- Content Security Policy for secure web content loading
- Asset protocol enabling local file access with proper scoping

**Security Configuration:**
- Restricted CSP allowing only necessary origins and protocols
- File system access scoped to user home directory with explicit permissions
- Shell execution limited to Claude Code binaries with argument validation

**Build Configuration:**
- Development server integration with Bun for hot reloading
- Production build pipeline with frontend distribution packaging
- External binary bundling for Claude Code sidecar deployment

**Plugin Configuration:**
- File system operations with comprehensive permission set
- Shell execution with secure command validation
- Dialog integration for native file chooser interfaces

### Capabilities System (capabilities/default.json)
Granular permission system defining exactly what operations the application can perform with principle of least privilege.

**Core Permissions:**
- File system operations including read, write, create, delete, and rename with home directory scoping
- Shell execution specifically limited to Claude Code binaries with argument validation
- Dialog access for file selection and save operations
- HTTP requests for GitHub integration and external API communication

**Security Controls:**
- Sidecar execution permitted only for bundled Claude Code binary
- System shell access limited to verified Claude installations
- Network access controlled through HTTP plugin with specified origins
- File system access explicitly scoped to prevent unauthorized operations

## Asset Management

### Icons and Branding (icons/)
Comprehensive icon set supporting all target platforms with multiple resolutions and formats.

**Icon Formats:**
- PNG formats: 32x32, 128x128, 128x128@2x for different display densities
- Platform-specific: .icns for macOS, .ico for Windows  
- Store logos: Multiple Microsoft Store logo sizes for Windows Store deployment

### Generated Assets (gen/schemas/)
Auto-generated schema files for development tooling and validation.

**Schema Files:**
- **desktop-schema.json**: Complete capability validation schema
- **macOS-schema.json**: Platform-specific permission definitions
- **capabilities.json**: Runtime capability resolution
- **acl-manifests.json**: Access control list definitions

## Development Infrastructure

### Testing Framework (tests/)
Comprehensive test suite validating all application functionality with real Claude Code integration.

**Test Documentation:**
- **TESTS_COMPLETE.md**: Documentation of complete test suite with real Claude execution replacing mock systems for authentic validation
- **TESTS_TASK.md**: Historical documentation of test development process including fixes for compilation errors, mutex poisoning, and platform-specific issues

**Test Coverage:**
- Agent management with various permission configurations
- Claude Code integration with different project contexts  
- Process lifecycle management and cleanup
- Database operations and schema validation
- Network operations and external dependencies
- Cross-platform compatibility testing

### Build System
**build.rs** - Minimal build script delegating to Tauri's build system for code generation, asset bundling, and platform-specific compilation optimizations.

**Target Directory** - Cargo build artifacts including compiled binaries, intermediate objects, and dependency caches. Excluded from version control for performance and storage optimization.

### Version Control (.gitignore)
Excludes generated artifacts including Cargo target directory and Tauri schema files while preserving source code and configuration files.

## Runtime Architecture

### State Management
Global application state using Tauri's managed state system with thread-safe access patterns through Arc<Mutex<T>> for shared resources.

**State Components:**
- **CheckpointState**: Session versioning and timeline management across all active sessions
- **ProcessRegistryState**: Process tracking and lifecycle management for long-running operations
- **ClaudeProcessState**: Claude Code integration and execution management  
- **AgentDb**: SQLite database connection with agent storage and execution history

### IPC Communication
Secure inter-process communication between frontend and backend using Tauri's command system with automatic serialization/deserialization and error propagation.

**Command Categories:**
- Project and session management commands
- Agent lifecycle and execution commands
- Checkpoint and timeline manipulation commands
- Usage analytics and reporting commands
- System configuration and settings commands
- Database management and inspection commands

### Security Model
Multi-layered security approach including capability-based permissions, input validation, path traversal protection, SQL injection prevention, and process isolation.

**Security Measures:**
- Capability system limiting application permissions to minimum required set
- Command validation preventing unauthorized operations
- File system access scoped to user directories with explicit permission requirements
- Process execution limited to verified Claude Code binaries
- Network access controlled through plugin system with origin validation

## Deployment Considerations

### Cross-Platform Support
Native compilation for Windows, macOS, and Linux with platform-specific optimizations and dependency handling.

**Platform Features:**
- macOS: Native Cocoa integration for system-level operations
- Windows: Microsoft Store compatibility with proper icon and metadata
- Linux: Standard desktop integration with appropriate permissions

### Bundle Configuration
External binary bundling enabling distribution of Claude Code alongside the application for self-contained deployment scenarios.

**Bundled Components:**
- Claude Code binary as sidecar for execution
- Application icons in multiple formats and resolutions
- Platform-specific runtime dependencies

### Performance Optimization
Efficient resource usage through async/await patterns, lazy loading, caching strategies, and background processing for long-running operations.

**Optimization Strategies:**
- Content-addressable storage for checkpoint deduplication
- Compressed storage using Zstd for space efficiency
- Process registry for efficient operation tracking
- Database connection pooling and transaction optimization

## Integration Points

### Frontend Integration
Seamless integration with React frontend through Tauri's IPC bridge enabling real-time updates, event emission, and bidirectional communication.

### External System Integration
Robust integration with Claude Code CLI, file system operations, shell execution, and network services while maintaining security boundaries.

### Community Features
GitHub integration enabling agent sharing, community discovery, and collaborative development of custom agents and commands.

## Maintenance and Extensibility

The codebase is designed for maintainability with clear module boundaries, comprehensive error handling, extensive logging, and modular architecture enabling easy extension of functionality. The testing framework ensures reliability across updates and the documentation provides clear guidance for future development.
