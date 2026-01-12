# Agents Guide - Attendance Tracker

## Build & Development Commands

```bash
# Development
npm run dev                 # Start Vite dev server with HMR

# Build
npm run build              # TypeScript check + Vite production build
npm run preview            # Preview production build locally

# Linting
npm run lint               # Run ESLint on all files
```

**Note:** No test framework is currently configured. To add testing, install Vitest or Jest and configure accordingly.

## Code Style Guidelines

### File Organization
- `src/components/` - Reusable feature components (default exports)
- `src/components/ui/` - UI primitives with variant support (named exports: Button, Card)
- `src/pages/` - Route-level page components (default exports)
- `src/store/` - Zustand global state management
- `src/utils/` - Pure utility functions (no side effects)
- `src/db/` - IndexedDB abstraction layer with type definitions

### Component Patterns
- Functional components only, use hooks for state/side effects
- Props interfaces defined above the component
- UI components: named exports extending HTMLMotionProps
- Feature components: default exports, inline interface props
- Motion components: standard Framer Motion patterns (initial/animate/exit)
- Default prop values in function signature: `variant = 'primary'`

### State Management (Zustand)
- Store located in `src/store/useStore.ts`
- Selector pattern: `useStore((state) => state.lectures)`
- Async actions: wrap in try/catch, set error and isLoading state
- Sync and async actions coexist in the same store interface
- Use `get()` to access state within async actions
- Immutable state updates: `set((state) => ({ ...state, ...updates }))`

### Styling (Tailwind CSS v4)
- Dark mode support via `dark:` classes required for all user-facing UI
- Use `clsx` for conditional class merging
- Button variants: primary (blue-600), secondary (gray), danger (red-50/red-600), ghost
- Button sizes: sm (px-3 py-1.5), md (px-4 py-2), lg (px-6 py-3)
- Roundness: buttons `rounded-xl`, cards `rounded-2xl`, inputs `rounded-lg`
- Focus states: `focus:ring-2 focus:ring-blue-500/20`
- Gradients: use `bg-gradient-to-br from-X to-Y` for stat cards

### TypeScript Configuration
- Strict mode enabled with no unused locals/parameters
- Define interfaces before components, use `type` for unions
- Create operations: `Omit<Type, 'id'>` to exclude auto-generated IDs
- Update operations: `Partial<Type>` for partial updates
- Inline type annotations where inference isn't obvious
- All async functions return Promise, explicitly typed

### Import Organization
```typescript
// 1. External libraries (sorted alphabetically)
import { useState, useEffect } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';

// 2. Internal modules (sorted alphabetically)
import { useStore } from '../store/useStore';
import { Button } from './ui/Button';
import { type Lecture } from '../db/db';
```

### Naming Conventions
- Components: PascalCase (LectureForm, Dashboard)
- Variables/Functions: camelCase (fetchData, markAttendance)
- Interfaces/Types: PascalCase (Lecture, AttendanceRecord)
- Constants: UPPER_SNAKE_CASE (DB_NAME, DB_VERSION)
- Files: PascalCase for components, lowercase for utilities
- State selectors: match property name (lectures → lectures, fetchData)

### Error Handling
- Wrap all async operations in try/catch
- Store errors in state with user-friendly messages
- Console.error for debugging only, not in production
- Loading states for all async operations
- Render error states gracefully with fallback UI

### IndexedDB Patterns
- Always use `idb` library, never raw IndexedDB API
- All database logic in `src/db/db.ts`
- Export TypeScript types: Lecture, AttendanceRecord
- Use `crypto.randomUUID()` for primary keys
- Cascading deletes: use transactions and indexes for related records
- Use `dbPromise` singleton, never recreate connections

### React Router
- BrowserRouter in `main.tsx`
- Route structure: nested inside Layout component
- Layout contains bottom tab navigation with NavLink
- Active states use `isActive` callback with conditional classes
- Use Outlet in Layout for nested routes

### Utility Functions
- Pure functions only, no side effects
- Date utilities use `date-fns` library
- Export named functions, never default
- Clear function names: `isLectureScheduledForDate`, `getTodayLectures`

### Accessibility & UI
- All interactive elements have focus states
- Use semantic HTML (button, nav, header, main)
- Icons from lucide-react, use appropriate sizes
- Text colors: gray-500 for secondary, gray-900 primary
- Status colors: green for present/success, red for absent/error

### Authentication (Clerk)
- Package: `@clerk/clerk-react` for Vite/React projects
- Environment variable: `VITE_CLERK_PUBLISHABLE_KEY` in `.env`
- App wrapped with `<ClerkProvider>` in `main.tsx`
- Use Clerk components: `<SignedIn>`, `<SignedOut>`, `<SignInButton>`, `<SignUpButton>`, `<UserButton>`
- Import hooks from `@clerk/clerk-react`: `useAuth`, `useUser`
- Never use real API keys in code - only placeholders like `YOUR_PUBLISHABLE_KEY`
