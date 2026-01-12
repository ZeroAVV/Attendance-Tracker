# Attendance Tracker - Walkthrough

The Attendance Tracker is a Progressive Web App (PWA) designed to help students manage their lectures and track attendance statistics.

## Features Implemented

### 1. Lecture Management
- **Add Lectures**: Create new lectures with details like name, course code, schedule, and target percentage.
- **List View**: View all lectures in a clean, card-based layout.
- **Delete**: Remove lectures (and associated attendance data) with a single tap.

### 2. Attendance Tracking
- **Dashboard**: Shows lectures scheduled for **today**.
- **Calendar View**: Monthly view to see past attendance. Tap any date to view or edit attendance.
- **Quick Mark**: Mark attendance as "Present" or "Absent" directly from the dashboard.
- **Visual Feedback**: Cards change color (Green/Red) based on attendance status.

### 3. Statistics & Analytics
- **Overall Stats**: View your total attendance rate across all lectures.
- **Per-Lecture Stats**: Progress bars showing attendance % vs target %.
- **Visual Indicators**: Red/Green colors indicate if you are below or above your target.

### 4. UI/UX
- **Apple-like Design**: Clean, modern interface with glassmorphism and smooth animations.
- **Dark Mode**: Fully supported (system preference).
- **Responsive**: Optimized for mobile devices (PWA ready).

## How to Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start Development Server**:
    ```bash
    npm run dev
    ```
3.  **Open in Browser**:
    Navigate to `http://localhost:5173` (or the URL shown in terminal).

## Building for Production

To build the app for deployment:
```bash
npm run build
```
> **Note**: If your project folder contains special characters (like `#`), the build might fail. Please move the project to a standard path (e.g., `C:\Projects\AttendanceTracker`) before building.

## Android Migration

To convert this PWA into a native Android app, refer to the [Android Migration Guide](file:///C:/Users/Ayan/.gemini/antigravity/brain/276b6321-df45-4d61-b966-275127707121/android_migration_guide.md).
We have pre-installed Capacitor dependencies, so you can start from **Step 3** of Option 1.

## Next Steps
- Add **Notifications** using Capacitor Local Notifications.
- Implement **Cloud Sync** for multi-device support.
