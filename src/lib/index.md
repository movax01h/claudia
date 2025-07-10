# Lib Directory

This directory contains utility libraries, API clients, and helper functions that provide core functionality for the Claudia application.

## Core API and Backend Communication

**api.ts** - Main API client that handles all communication with the Rust Tauri backend. Provides functions for project management, session handling, agent execution, file operations, and system integration. Includes type definitions for Project, Session, ClaudeMdFile, and other data structures. Manages API error handling and response formatting.

## Theme and Visual Systems

**theme-context.tsx** - React context provider for theme management, handling dark/light mode switching, theme persistence, and providing theme state throughout the component tree.

**claudeSyntaxTheme.ts** - Syntax highlighting theme configuration specifically designed for Claude Code interactions, providing appropriate color schemes for code blocks and technical content in both light and dark modes.

## Data Management and Caching

**outputCache.tsx** - React context provider for caching Claude session outputs and responses. Improves performance by avoiding redundant API calls and provides offline access to previously loaded content. Manages cache invalidation and storage efficiency.

**hooksManager.ts** - Utility functions for managing project-specific hooks that customize Claude Code behavior. Handles hook configuration, validation, and execution for different project types and requirements.

## Utility Functions

**utils.ts** - Collection of general-purpose utility functions including string manipulation, data formatting, type guards, and helper functions used throughout the application. Includes common operations for data processing and UI support.

**date-utils.ts** - Specialized utilities for date and time handling, formatting timestamps, calculating relative times, and managing time-based data display throughout the application.

**linkDetector.tsx** - React component and utilities for detecting and rendering clickable links within text content. Handles URL recognition, link formatting, and provides safe link opening with external navigation.

## Architecture Role

The lib directory serves as the foundation layer for the application, providing:

**Data Layer** - API client for backend communication and data type definitions
**State Management** - Context providers for theme and output caching
**Utility Layer** - Common functions and helpers used across components
**Integration Layer** - Specialized utilities for Claude Code integration and project management

## Integration Patterns

Components throughout the application import from lib/ for:
- Making API calls through the centralized api.ts client
- Accessing theme state and toggling themes via theme-context
- Caching and retrieving output data through outputCache
- Formatting dates and handling time-based operations
- Processing text content and detecting links
- Managing project-specific configurations through hooksManager

The lib structure supports the application's separation of concerns by isolating business logic, data access, and utility functions from UI components, making the codebase more maintainable and testable.
