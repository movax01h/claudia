# Types Directory

This directory contains TypeScript type definitions that provide type safety and structure for specific application features.

## Files

**hooks.ts** - TypeScript type definitions for the project hooks system that allows customization of Claude Code behavior on a per-project basis. Defines interfaces and types for hook configurations, hook execution parameters, and hook management throughout the application.

## Purpose

The hooks system enables users to customize how Claude Code behaves for different projects by defining project-specific configurations, pre-processing rules, and behavioral modifications. The type definitions in this file ensure type safety when:

- Configuring hooks for individual projects
- Validating hook parameters and settings
- Managing hook execution and lifecycle
- Integrating hooks with the Claude Code CLI
- Storing and retrieving hook configurations

## Integration

These types are used by:
- **HooksEditor.tsx** component for the hook configuration interface
- **ProjectSettings.tsx** component for project-specific settings
- **hooksManager.ts** utility for hook processing and management
- **api.ts** for backend communication regarding hook configurations

## Type Safety Benefits

The type definitions provide compile-time validation for hook configurations, ensuring that:
- Hook parameters match expected formats
- Configuration objects have required properties
- Hook execution receives properly typed arguments
- Integration points maintain consistent interfaces

This typing system supports the application's goal of providing a robust, customizable interface for Claude Code while maintaining code quality and preventing runtime errors related to hook configuration and execution.
