# UI Components Directory

This directory contains reusable UI primitive components following the shadcn/ui design system patterns. These components provide a consistent foundation for the Claudia application's user interface.

## Components

**badge.tsx** - Badge component for displaying status indicators, labels, and categorical information with various styling variants.

**button.tsx** - Primary button component with multiple variants (default, destructive, outline, secondary, ghost, link) and size options for consistent interactive elements throughout the application.

**card.tsx** - Card container component providing consistent layout and styling for grouped content, forms, and information panels.

**dialog.tsx** - Modal dialog component with overlay, close functionality, and content area for displaying forms, confirmations, and detailed information.

**dropdown-menu.tsx** - Dropdown menu component with trigger, content, and item management for navigation and action menus.

**input.tsx** - Text input component with consistent styling, focus states, and validation support for forms and user data entry.

**label.tsx** - Form label component that provides consistent typography and accessibility features for form inputs.

**pagination.tsx** - Pagination controls for navigating through large datasets and lists with page numbers and navigation arrows.

**popover.tsx** - Popover component for displaying contextual information and controls that appear on demand without modal behavior.

**radio-group.tsx** - Radio button group component for single-selection options with consistent styling and keyboard navigation.

**scroll-area.tsx** - Custom scrollable area component with themed scrollbars that match the application's visual design.

**select.tsx** - Dropdown select component for choosing options from lists with search capabilities and consistent styling.

**split-pane.tsx** - Resizable split pane component for dividing interface areas with user-adjustable layouts.

**switch.tsx** - Toggle switch component for boolean settings and on/off controls with smooth animations.

**tabs.tsx** - Tab navigation component for organizing content into multiple sections with active state management.

**textarea.tsx** - Multi-line text input component for longer text content with consistent styling and resize handling.

**toast.tsx** - Notification toast component for displaying temporary messages, alerts, and status updates to users.

**tooltip.tsx** - Tooltip component for providing additional context and help text on hover or focus events.

## Design System Integration

These components implement the shadcn/ui design patterns with Tailwind CSS v4 integration. They follow consistent theming through CSS custom properties defined in the global styles, ensuring proper dark/light mode support and maintaining visual coherence across the application.

## Usage Patterns

All components are designed to be composable and accept standard HTML attributes alongside custom props. They integrate with the application's theme system and provide consistent accessibility features including keyboard navigation, screen reader support, and focus management.

The components support the application's design requirements for both functional interfaces (forms, data display, navigation) and enhanced user experience elements (animations, responsive design, interactive feedback).
