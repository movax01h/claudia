# checkpoint Module Documentation

The checkpoint module implements a comprehensive Git-like versioning system for Claude Code sessions, enabling users to save, restore, and branch conversation states with full file system snapshots. This system provides powerful session management capabilities for development workflows.

## Module Overview

This module provides automatic and manual checkpoint creation with complete file state preservation, timeline management with branching support, and efficient storage using content-addressable systems. The implementation supports session forking, restoration to any previous state, and sophisticated cleanup mechanisms.

## Core Components

### mod.rs - Type Definitions and Data Structures

Defines the fundamental data structures for the checkpoint system including Checkpoint, CheckpointMetadata, FileSnapshot, TimelineNode, SessionTimeline, CheckpointStrategy, FileTracker, FileState, CheckpointResult, CheckpointDiff, and FileDiff types.

Key structures:
- Checkpoint represents a single checkpoint with metadata including unique ID, session and project identifiers, message index, timestamp, description, parent relationships, and comprehensive metadata
- CheckpointMetadata contains token usage statistics, model information, user prompts, file change counts, and snapshot size estimates
- FileSnapshot captures complete file state including content, hash verification, deletion status, permissions, and size information
- TimelineNode implements tree structure for branching with checkpoint data, child relationships, and file snapshot references
- SessionTimeline manages the complete timeline for a session including root node, current position, auto-checkpoint settings, strategy configuration, and checkpoint counting
- CheckpointStrategy enum defines automatic checkpoint triggers including Manual, PerPrompt, PerToolUse, and Smart strategies
- FileTracker maintains file state monitoring with modification tracking, hash comparison, and existence verification
- CheckpointResult provides operation feedback with processed file counts and warning messages
- CheckpointDiff enables comparison between checkpoints with file modifications, additions, deletions, and token deltas

### manager.rs - Core Checkpoint Operations

Implements the CheckpointManager struct that handles all checkpoint operations for a session including creation, restoration, forking, and timeline management. Manages file tracking, message accumulation, and automatic checkpoint triggering.

Primary functionality:
- Session initialization with project and session identification, storage setup, timeline loading, and file tracking initialization
- Message tracking with JSONL accumulation, tool operation detection, file modification monitoring, and automatic checkpoint evaluation
- Checkpoint creation with metadata extraction, file snapshotting, storage operations, and timeline updates
- Restoration operations with file system reconstruction, directory cleanup, message restoration, and state synchronization
- Fork management enabling branching from any checkpoint with independent development paths
- Auto-checkpoint evaluation based on configurable strategies and content analysis
- Settings management for checkpoint behavior configuration
- Timeline traversal and checkpoint enumeration
- File modification tracking with hash-based change detection
- Cleanup operations for finished processes and temporary data

### state.rs - Global State Management

Provides the CheckpointState struct for managing checkpoint managers across active sessions. Implements thread-safe access patterns and lifecycle management for checkpoint operations throughout the application.

State management features:
- Manager lifecycle with creation, retrieval, and cleanup operations
- Thread-safe access using Arc and RwLock patterns
- Claude directory configuration and path management
- Session counting and active session enumeration
- Resource cleanup and memory management
- Cross-session state isolation and consistency

### storage.rs - Persistent Storage Implementation

Implements the CheckpointStorage struct providing persistent storage for checkpoints, file snapshots, and timeline data. Uses content-addressable storage for efficient file deduplication and implements compression for space optimization.

Storage capabilities:
- Content-addressable file storage with hash-based deduplication
- Zstd compression for messages and file content
- Timeline serialization with JSON persistence
- Checkpoint metadata storage with structured organization
- File reference management linking checkpoints to content
- Garbage collection for unreferenced content
- Storage initialization and directory structure creation
- Cleanup operations with retention policies
- Migration support for storage format evolution

## System Architecture

The checkpoint system follows a layered architecture with clear separation between state management, operations, and persistence:

1. **State Layer** - Global checkpoint state management across all active sessions with thread-safe access and lifecycle management

2. **Operations Layer** - Core checkpoint functionality including creation, restoration, forking, and timeline management with comprehensive error handling

3. **Storage Layer** - Persistent storage with content-addressable file system, compression, and garbage collection capabilities

4. **Tracking Layer** - File system monitoring with hash-based change detection and modification tracking

## Key Features

**Automatic Checkpointing** - Configurable automatic checkpoint creation based on user prompts, tool usage, or smart detection of destructive operations with customizable strategies.

**File System Snapshots** - Complete file state preservation including content, permissions, deletion status, and hash verification for integrity checking.

**Content-Addressable Storage** - Efficient storage using file content hashing for deduplication across checkpoints and sessions.

**Timeline Management** - Tree-structured timeline supporting linear progression and branching with parent-child relationships and navigation capabilities.

**Session Forking** - Ability to create new development branches from any checkpoint enabling parallel exploration of different approaches.

**Diff Generation** - Comprehensive difference calculation between checkpoints showing file modifications, additions, deletions, and token usage changes.

**Compression** - Zstd compression for both message content and file snapshots reducing storage requirements significantly.

**Garbage Collection** - Automatic cleanup of unreferenced content and checkpoint retention policies preventing unbounded storage growth.

**Metadata Tracking** - Rich metadata including token usage, model information, timing data, and user context for comprehensive session analysis.

**Restoration Guarantees** - Complete session restoration with file system reconstruction, message replay, and state synchronization ensuring exact checkpoint recovery.

## Usage Patterns

The checkpoint system integrates seamlessly with Claude Code sessions through automatic detection and manual triggers. Users can create checkpoints at significant development milestones, experiment with different approaches through forking, and restore to previous states when needed.

Typical workflows include:
- Automatic checkpoint creation before destructive operations
- Manual checkpoint creation at development milestones  
- Forking to explore alternative implementations
- Restoration when experimental changes need reverting
- Timeline navigation to understand development progression
- Diff analysis to review changes between checkpoints

## Performance Considerations

The system is optimized for performance through content deduplication, compression, efficient file tracking, and lazy loading of checkpoint data. Storage growth is managed through garbage collection and retention policies ensuring scalable operation across large development projects.
