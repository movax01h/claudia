# Claudia Frontend Source Directory

This directory contains the React TypeScript frontend source code for Claudia, a Tauri 2 desktop application that provides a GUI for Claude Code management.

## Architecture Overview

The frontend is built with React 18, TypeScript, Vite 6, Tailwind CSS v4, and shadcn/ui components. The application follows a component-based architecture with centralized state management and API communication with the Rust backend.

## Root Files

**App.tsx** - Main application component that manages the overall UI state and routing between different views (welcome, projects, agents, settings, etc.). Handles navigation logic, project/session management, and integrates all major features like CC Agents, project browsing, markdown editing, and Claude Code sessions. Contains view state management and error handling.

**main.tsx** - React application entry point that renders the App component wrapped in ErrorBoundary and applies global CSS imports for shimmer effects and base styles.

**styles.css** - Global CSS file that imports Tailwind CSS and theme configurations. Contains comprehensive styling for the application including theme variables, markdown editor dark mode styles, prose rendering, animations (rotating symbol, shimmer hover effects, trailing borders), scrollbar theming, and specialized animations for NFO credits and image movements.

**vite-env.d.ts** - TypeScript declaration file for Vite environment types.

## Directory Structure

**assets/** - Static assets including logos, audio files, and effect stylesheets
**components/** - React components organized by functionality with a separate ui/ subdirectory for reusable UI primitives
**lib/** - Utility libraries including API client, theme management, date utilities, and helper functions
**styles/** - Additional CSS files for theming
**types/** - TypeScript type definitions

## Key Features

The frontend supports multiple main views:
- Welcome screen with navigation cards for CC Agents and CC Projects
- CC Agents management for creating and executing custom AI agents
- Project browser for viewing Claude Code projects and sessions
- Interactive Claude Code session interface with streaming support
- Settings and configuration management
- Usage analytics dashboard
- MCP server management
- Markdown file editing with live preview

## State Management

The application uses React hooks for state management with context providers for theme and output caching. Key state includes current view, selected projects/sessions, loading states, error handling, and Claude session streaming status.

## Navigation Flow

The app uses a view-based navigation system with protection for active Claude sessions. Users can navigate between welcome screen, project management, agent creation/execution, settings, and various specialized tools while maintaining context and preventing data loss during active operations.

## Integration Points

The frontend communicates with the Rust backend through Tauri commands for file operations, process management, project discovery, session handling, and system integration. It also handles Claude Code CLI integration for interactive sessions.
