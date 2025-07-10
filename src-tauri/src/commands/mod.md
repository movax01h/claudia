# commands Module Documentation

The commands module contains all Tauri command handlers that bridge the frontend React application with the Rust backend functionality. Each command is an async function exposed via Tauri's IPC mechanism, enabling secure cross-platform communication between the web interface and native system operations.

## Module Organization

This module is organized by functional domain with each file handling a specific area of application functionality. All commands follow consistent patterns for error handling, input validation, and response formatting.

### mod.rs - Module Exports

Simple module declaration file that exports all command modules making their functions available for registration in the main Tauri application builder.

### agents.rs - Agent Management and Execution

Comprehensive agent lifecycle management including CRUD operations, execution handling, and community integration features. This is the largest command module handling the core agent functionality that distinguishes Claudia from basic Claude Code usage.

Core agent operations:
- Agent CRUD with database persistence supporting name, icon, system prompt, default task, model selection, tool permissions, and hooks configuration
- Agent execution with process spawning supporting both system binaries and bundled sidecars with output streaming and session tracking
- Real-time metrics calculation from JSONL output including token usage, cost analysis, duration tracking, and message counting
- Process lifecycle management with PID tracking, status monitoring, graceful termination, and cleanup operations
- Live output streaming with event emission to frontend and cross-session output access
- Session management with automatic session ID extraction, history loading, and project path resolution
- GitHub integration for agent sharing including repository browsing, content fetching, import/export functionality, and community agent discovery
- Claude binary detection with multi-source discovery, version checking, installation validation, and sidecar support
- Import/export functionality with JSON serialization, version compatibility, duplicate handling, and file-based operations

Advanced features:
- Agent run metrics with real-time JSONL parsing, cost calculation using Claude 4 pricing models, and performance tracking
- Process registry integration for cross-session tracking and management
- Hooks configuration with automatic settings.json creation in project .claude directories
- Multiple execution strategies supporting both sidecar and system binary execution paths
- Comprehensive error handling with detailed logging and user-friendly error messages

### claude.rs - Claude Code Integration

Direct integration with Claude Code CLI providing project discovery, session management, and execution capabilities. Handles the core Claude Code functionality that Claudia wraps with its enhanced interface.

Project and session management:
- Project discovery from ~/.claude/projects with automatic path decoding, session enumeration, and metadata extraction
- Session history loading with JSONL parsing, message extraction, and timeline reconstruction
- Claude settings management with JSON persistence and validation
- CLAUDE.md file discovery and editing with recursive scanning and content management
- System prompt management with global CLAUDE.md handling

Claude Code execution:
- Interactive session spawning with streaming output and real-time event emission
- Multiple execution modes including new sessions, continuation, and resume operations
- Process management with both sidecar and system binary support
- Output streaming with frontend event emission and session state tracking
- Version detection and compatibility checking
- Environment setup for proper Claude Code execution

File and directory operations:
- Directory listing with detailed file information and type detection
- File search capabilities with pattern matching and recursive scanning
- Recently modified file tracking for development workflow optimization
- Hooks configuration management with validation and persistence

### mcp.rs - Model Context Protocol Integration

Complete MCP server management providing configuration, testing, and integration capabilities for extending Claude Code functionality with custom tools and data sources.

MCP server operations:
- Server registration with support for stdio and SSE transports, environment configuration, and scope management
- Configuration management with JSON persistence, Claude Desktop import, and project-specific settings
- Connection testing and status monitoring with health checks and error reporting
- Server lifecycle management including start, stop, and restart operations
- Import functionality from Claude Desktop configuration with automatic conversion and validation

Server configuration features:
- Multiple transport types supporting stdio process execution and SSE endpoint connections
- Environment variable configuration for server customization and authentication
- Scope-based organization with local, project, and user-level configurations
- Batch import from Claude Desktop with error handling and progress reporting
- JSON-based configuration with validation and schema enforcement

### usage.rs - Analytics and Reporting

Comprehensive usage tracking and analytics providing detailed insights into Claude API consumption, costs, and usage patterns across projects and time periods.

Usage tracking capabilities:
- Token usage aggregation from JSONL files with deduplication and validation
- Cost calculation using Claude 4 pricing models with support for Opus and Sonnet variants
- Multi-dimensional analytics by model, date, project, and session with flexible filtering
- Historical data analysis with date range queries and trend identification
- Session-level metrics with detailed breakdown and comparison capabilities

Analytics features:
- Real-time cost tracking with accurate pricing based on token types and model usage
- Usage statistics with total tokens, costs, session counts, and model distribution
- Daily usage trends with model-specific breakdowns and cost analysis
- Project-level analytics with session counting and activity tracking
- Deduplication logic preventing double-counting of usage entries across multiple JSONL files

Data processing:
- JSONL parsing with robust error handling and data validation
- File system scanning with efficient directory traversal and file processing
- Cache-aware processing with timestamp-based optimization
- Export functionality for external analysis and reporting

### storage.rs - Database Management

Database inspection and management tools providing administrative access to the SQLite database with full CRUD operations, query execution, and schema management.

Database operations:
- Table listing with metadata including row counts and schema information
- Data browsing with pagination, search, and filtering capabilities
- CRUD operations with validation, type conversion, and error handling
- Raw SQL execution with result formatting and error reporting
- Database reset functionality with complete schema recreation

Table management:
- Schema inspection with column details, types, and constraints
- Row-level operations with primary key handling and data validation
- Bulk operations with transaction support and rollback capabilities
- Data export and import with format conversion and validation
- Index management and query optimization support

### slash_commands.rs - Custom Command System

Custom slash command discovery and management enabling users to create reusable command templates with parameters, tool specifications, and automation capabilities.

Command discovery:
- Recursive scanning of .claude/commands directories in both project and user scopes
- Markdown file parsing with YAML frontmatter support for metadata extraction
- Command organization with namespace support and hierarchical structures
- Built-in command integration with extensible architecture

Command management:
- CRUD operations for custom commands with file-based persistence
- Template processing with argument substitution and dynamic content generation
- Metadata handling including descriptions, allowed tools, and execution parameters
- Validation and error checking for command syntax and requirements

## Architecture Patterns

All command modules follow consistent architectural patterns ensuring reliability, maintainability, and security:

**Error Handling** - Comprehensive error handling using Result types with user-friendly error messages and detailed logging for debugging.

**Input Validation** - Strict validation of all input parameters with type checking, range validation, and sanitization to prevent security issues.

**Database Access** - Thread-safe database access using managed state with proper connection pooling and transaction handling.

**Process Management** - Robust process spawning and lifecycle management with proper cleanup, error handling, and resource management.

**File Operations** - Secure file system operations with path validation, permission checking, and error recovery mechanisms.

**Event Emission** - Real-time event emission to frontend for live updates and progress tracking with proper event scoping and filtering.

## Security Considerations

The command system implements multiple security layers including input validation, path traversal protection, SQL injection prevention, process isolation, and secure environment handling. All file operations are validated and contained within appropriate directories.

## Performance Optimization

Commands are optimized for performance through efficient database queries, lazy loading, caching strategies, and background processing for long-running operations. Resource usage is monitored and managed to prevent system impact.
