# Attendance Tracker App - Implementation Plan

# Goal Description
Complete the "Custom Themes" feature by ensuring the selected theme color is applied consistently across the entire application. Then, begin the "Smart Timetable Import" feature by integrating `tesseract.js` for OCR.

## User Review Required
- **Theme Strategy**: 
    - "Present"/"Absent" actions will RETAIN their Green/Red semantic colors for clarity.
    - Primary actions (Add Lecture, Navigation active state) and accents (Focus rings, Selected states) will use the User Selected Theme.
    - `Button.tsx` shadow and focus rings will be updated to match the theme or be neutral.

## Proposed Changes

### Theme Consistency
#### [MODIFY] [src/components/ui/Button.tsx](file:///d:/Ayan/Make/Attendance-Tracker-1/src/components/ui/Button.tsx)
- Remove hardcoded `shadow-blue-500/20` and `focus:ring-blue-500/20`.
- Use `theme.ring` or a neutral shadow/ring.

#### [MODIFY] [src/components/LectureForm.tsx](file:///d:/Ayan/Make/Attendance-Tracker-1/src/components/LectureForm.tsx)
- Replace hardcoded `focus:ring-blue-500` with `theme.ring`.
- Replace hardcoded `bg-blue-100 text-blue-700` for selected days with `theme.bgLight` and `theme.text`.

#### [MODIFY] [src/pages/Lectures.tsx](file:///d:/Ayan/Make/Attendance-Tracker-1/src/pages/Lectures.tsx)
- Update "Add Lecture" FAB to use `theme.primary`.

#### [MODIFY] [src/pages/Dashboard.tsx](file:///d:/Ayan/Make/Attendance-Tracker-1/src/pages/Dashboard.tsx)
- Update "Today" header or empty state to use `theme.text` or `theme.bgLight` for better branding.
- Ensure "Present"/"Absent" buttons remain Green/Red but check if any other elements need theming.

### Smart Timetable Import (OCR)
#### [NEW] [src/utils/ocrUtils.ts](file:///d:/Ayan/Make/Attendance-Tracker-1/src/utils/ocrUtils.ts)
- Implement `processImage(file: File): Promise<string>` using `tesseract.js`.
- Implement `parseTimetable(text: string): Lecture[]` (heuristic parsing).

#### [NEW] [src/components/OCRUploader.tsx](file:///d:/Ayan/Make/Attendance-Tracker-1/src/components/OCRUploader.tsx)
- UI for uploading/capturing image.
- Display loading state while processing.
- Show parsed results for confirmation.

#### [MODIFY] [src/pages/Lectures.tsx](file:///d:/Ayan/Make/Attendance-Tracker-1/src/pages/Lectures.tsx)
- Add "Import Timetable" button (next to "Add Lecture").
- Integrate `OCRUploader` modal.

## Verification Plan
### Automated Tests
- `npm run build` to ensure no type errors.

### Manual Verification
1.  **Theme Check**:
    -   Go to Settings, change theme to "Purple".
    -   Verify "Add Lecture" button in Lectures page is Purple.
    -   Verify Focus rings in Lecture Form are Purple.
    -   Verify Selected days in Lecture Form are Purple.
    -   Verify Navigation active state is Purple.
2.  **OCR Check**:
    -   Click "Import Timetable".
    -   Upload a sample timetable image.
    -   Verify text is extracted and parsed (check console logs or UI).
