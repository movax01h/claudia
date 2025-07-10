# Styles Directory

This directory contains CSS files that define the visual theming and styling system for the Claudia application.

## Files

**themes.css** - Core theme definitions and CSS custom properties that establish the application's color system, spacing, and visual identity. Contains theme variables for light and dark modes, defining colors for backgrounds, foregrounds, borders, accents, and semantic colors (success, error, warning, etc.).

## Theme System Integration

The themes.css file works in conjunction with the main styles.css file (located in the src root) to provide a comprehensive theming system. While the main styles.css handles:
- Global styles and resets
- Component-specific styling
- Animation definitions
- Markdown and prose rendering
- Scrollbar theming

The themes.css file specifically focuses on:
- Color palette definitions
- Theme variable declarations
- Dark/light mode color schemes
- Semantic color assignments
- Brand color definitions

## Usage Context

These theme definitions are consumed throughout the application via CSS custom properties (CSS variables) and integrated with:
- Tailwind CSS v4 configuration
- React theme context provider
- Component styling through the UI component library
- Dynamic theme switching functionality

The theming system ensures visual consistency across all components while supporting user preference for light/dark modes and maintaining accessibility standards for color contrast and readability.

## Architecture Role

The styles directory provides the visual foundation for the application's design system, working with the theme-context.tsx provider in the lib directory to enable dynamic theme switching and ensure consistent visual appearance throughout the Claudia interface.
