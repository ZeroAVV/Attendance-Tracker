# Attendance Tracker App - Implementation Plan

# Goal Description
Build a Progressive Web App (PWA) for tracking attendance, managing lectures, and viewing statistics. The app will be local-first, using IndexedDB for storage, and built with React, Vite, and Tailwind CSS.

## User Review Required
- **Tech Stack**: React, Vite, Tailwind CSS, Zustand, IDB (IndexedDB wrapper).
- **UI/UX**: Apple-style aesthetics (Glassmorphism, Inter font, smooth transitions). Using `framer-motion` for animations and `lucide-react` for icons.
- **Mobile Strategy**: Primary target is PWA. Android migration guide provided in `android_migration_guide.md`.
- **Storage**: Local-first (IndexedDB). Cloud sync is a future feature.
- **Authentication**: Local "Guest" mode initially as per "Basic Prototype" requirement.

## Proposed Changes

### Project Structure
#### [NEW] [package.json](file:///d:/Ayan/#Make/Attendance-Tracker/package.json)
- React, ReactDOM, Vite, TypeScript
- Tailwind CSS, PostCSS, Autoprefixer
- Zustand (State Management)
- React Router DOM (Routing)
- Lucide React (Icons)
- Date-fns (Date manipulation)
- IDB (IndexedDB)
- Framer Motion (Animations)
- Class-variance-authority & clsx & tailwind-merge (For robust component styling)

### Documentation
#### [NEW] [android_migration_guide.md](file:///C:/Users/Ayan/.gemini/antigravity/brain/276b6321-df45-4d61-b966-275127707121/android_migration_guide.md)
- Guide for converting the PWA to Android.

### Core Components
#### [NEW] [src/store/useStore.ts](file:///d:/Ayan/#Make/Attendance-Tracker/src/store/useStore.ts)
- Zustand store for managing lectures and attendance records.
- Persistence middleware to save to IndexedDB.

#### [NEW] [src/db/db.ts](file:///d:/Ayan/#Make/Attendance-Tracker/src/db/db.ts)
- IndexedDB initialization and helper functions.

### UI Components
#### [NEW] [src/components/ui/Card.tsx](file:///d:/Ayan/#Make/Attendance-Tracker/src/components/ui/Card.tsx)
- Reusable card component with iOS-style shadows and rounded corners.

#### [NEW] [src/components/ui/Button.tsx](file:///d:/Ayan/#Make/Attendance-Tracker/src/components/ui/Button.tsx)
- Reusable button component with variants.

#### [NEW] [src/components/Layout.tsx](file:///d:/Ayan/#Make/Attendance-Tracker/src/components/Layout.tsx)
- Main application shell with navigation (Bottom tab bar for mobile feel).

#### [NEW] [src/pages/Dashboard.tsx](file:///d:/Ayan/#Make/Attendance-Tracker/src/pages/Dashboard.tsx)
- "Today's Lectures" view.
- Quick attendance marking.

#### [NEW] [src/pages/Lectures.tsx](file:///d:/Ayan/#Make/Attendance-Tracker/src/pages/Lectures.tsx)
- List of all lectures.
- Add/Edit lecture functionality.

#### [NEW] [src/pages/Stats.tsx](file:///d:/Ayan/#Make/Attendance-Tracker/src/pages/Stats.tsx)
- Attendance statistics and graphs.

#### [NEW] [src/pages/Calendar.tsx](file:///d:/Ayan/#Make/Attendance-Tracker/src/pages/Calendar.tsx)
- Monthly calendar view.
- Visual indicators for attendance status (dots/colors).
- Tap to view/edit attendance for that date.

#### [NEW] [src/pages/Settings.tsx](file:///d:/Ayan/#Make/Attendance-Tracker/src/pages/Settings.tsx)
- Theme selector (Primary Color).
- Data management options.

#### [NEW] [src/utils/ocrUtils.ts](file:///d:/Ayan/#Make/Attendance-Tracker/src/utils/ocrUtils.ts)
- `tesseract.js` integration.
- Heuristic parsing logic to extract lecture details from raw text.

## Verification Plan
### Automated Tests
- `npm run build` to verify build success.
- `npm run lint` to check for code quality issues.

### Manual Verification
- **Add Lecture**: Verify a user can add a lecture with all fields.
- **Mark Attendance**: Verify attendance can be marked for a specific date.
- **Stats**: Verify statistics update correctly after marking attendance.
- **Persistence**: Reload page and verify data persists.
