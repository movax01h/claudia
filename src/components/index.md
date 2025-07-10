# Components Directory

This directory contains all React components for the Claudia application, organized by functionality. Components follow React functional programming patterns with TypeScript, hooks, and modern React practices.

## Core Application Components

**App.tsx Integration Points** - Many components are directly used by the main App component for different views and functionality.

**CCAgents.tsx** - Main interface for managing Claude Code agents, allowing users to create, configure, and execute custom AI agents with specialized behaviors and system prompts.

**ClaudeCodeSession.tsx** - Interactive Claude Code session interface that provides real-time communication with Claude CLI, streaming responses, and session management.

**ProjectList.tsx** - Displays and manages Claude Code projects from ~/.claude/projects directory with search, filtering, and project selection capabilities.

**SessionList.tsx** - Shows historical Claude Code sessions for selected projects with session metadata, resumption capabilities, and session management.

**Settings.tsx** - Application configuration interface for user preferences, theme settings, API configurations, and system options.

**Topbar.tsx** - Main navigation bar providing access to different application sections, settings, usage dashboard, and other tools.

## Agent Management Components

**CreateAgent.tsx** - Form interface for creating new Claude Code agents with custom system prompts, model selection, and configuration options.

**AgentExecution.tsx** - Handles the execution of Claude Code agents, managing agent processes, monitoring execution status, and displaying results.

**AgentExecutionDemo.tsx** - Demonstration component showing agent execution capabilities and example use cases.

**AgentRunView.tsx** - Detailed view of individual agent execution runs with logs, outputs, and execution metadata.

**AgentRunsList.tsx** - List interface showing all agent execution runs with filtering, sorting, and management capabilities.

**AgentRunOutputViewer.tsx** - Specialized viewer for displaying agent execution outputs with syntax highlighting and formatting.

**GitHubAgentBrowser.tsx** - Interface for browsing and importing agents from GitHub repositories or community sources.

**IconPicker.tsx** - UI component for selecting icons for custom agents, providing visual customization options.

## File and Project Management

**ClaudeFileEditor.tsx** - Editor for CLAUDE.md files with markdown syntax highlighting, live preview, and file management.

**MarkdownEditor.tsx** - General-purpose markdown editor with preview capabilities and editing tools.

**FilePicker.tsx** - File selection interface for choosing files to include in agent or session contexts.

**ProjectSettings.tsx** - Configuration interface for individual project settings, hooks, and customizations.

**HooksEditor.tsx** - Editor for configuring project-specific hooks that customize Claude Code behavior for specific projects.

## MCP (Model Context Protocol) Components

**MCPManager.tsx** - Main interface for managing Model Context Protocol servers and configurations.

**MCPAddServer.tsx** - Form for adding new MCP servers with configuration options and connection testing.

**MCPServerList.tsx** - List view of configured MCP servers with status, management, and configuration options.

**MCPImportExport.tsx** - Import and export functionality for MCP server configurations, including Claude Desktop integration.

## Session and Timeline Management

**RunningClaudeSessions.tsx** - Displays currently active Claude Code sessions with status monitoring and quick access.

**SessionOutputViewer.tsx** - Viewer for Claude session outputs with formatting, syntax highlighting, and navigation.

**TimelineNavigator.tsx** - Navigation interface for session checkpoints and timeline branching functionality.

**CheckpointSettings.tsx** - Configuration for session checkpointing behavior and timeline management.

## Utility and UI Enhancement Components

**ErrorBoundary.tsx** - React error boundary for graceful error handling and recovery throughout the application.

**ThemeSelector.tsx** - Interface for selecting application themes and visual preferences.

**ThemePreview.tsx** - Preview component showing theme changes before applying them.

**TokenCounter.tsx** - Displays token usage information for Claude API interactions and cost tracking.

**UsageDashboard.tsx** - Analytics dashboard showing Claude API usage, costs, and usage patterns over time.

**ClaudeVersionSelector.tsx** - Interface for selecting Claude model versions and API configurations.

**FloatingPromptInput.tsx** - Floating input interface for quick prompt entry and interaction.

**SlashCommandPicker.tsx** - Interface for selecting and using slash commands in chat interfaces.

**SlashCommandsManager.tsx** - Management interface for configuring available slash commands and their behaviors.

## Specialized Components

**NFOCredits.tsx** - Credits display component with retro styling, animations, and multimedia presentation.

**ClaudeBinaryDialog.tsx** - Dialog for configuring Claude CLI binary path and installation verification.

**ClaudeMemoriesDropdown.tsx** - Interface for accessing and managing Claude conversation memories and context.

**WebviewPreview.tsx** - Embedded web preview component for displaying web content within the application.

**ImagePreview.tsx** - Image display and preview component with zoom and navigation capabilities.

**StreamMessage.tsx** - Component for displaying streaming messages from Claude with real-time updates.

**ExecutionControlBar.tsx** - Control interface for managing agent execution with start, stop, and monitoring controls.

**PreviewPromptDialog.tsx** - Dialog for previewing prompts before sending them to Claude.

**ToolWidgets.tsx** - Collection of utility widgets and tools for enhancing user workflow.

**StorageTab.tsx** - Interface for managing application data storage and cache settings.

## Subdirectories

**ui/** - Reusable UI primitive components following shadcn/ui patterns for consistent design system implementation.

## Architecture Notes

Components follow functional programming patterns with hooks for state management. Many components accept onBack callbacks for navigation and communicate with the Rust backend through the API client. Error handling, loading states, and user feedback are consistently implemented across components.

The component architecture supports the application's modular design, allowing for independent development and testing of features while maintaining consistent user experience and visual design through the shared UI component library.
