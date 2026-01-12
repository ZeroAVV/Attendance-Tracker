# Calendar Attendance Visibility Bug - Fix Summary

## Bug Description

**User Issue:**
- User creates EC lecture via Manual Entry with multiple schedules:
  - Mon 11:00-12:00 (schedule[0])
  - Tue+Wed 09:00-10:00 (schedule[1])
  - Thu 14:00-15:00 (schedule[2])

- In calendar for Tuesday/Wednesday/Thursday, the attendance card shows "11:00-12:00" (Monday's time) instead of the correct time for that day (e.g., "09:00-10:00" for Tuesday)
- This causes confusion as the user sees the wrong time slot for the lecture on different days

## Root Cause

The Calendar and Dashboard components were hardcoded to always display `lecture.schedules[0]` (the first schedule), regardless of which day the user was viewing. While the components correctly filtered lectures to show only those scheduled for the selected date, they displayed the wrong schedule information.

### Affected Files and Lines

1. **src/pages/Calendar.tsx**
   - Line 19: Import statement (needed to add `getScheduleForDate`)
   - Line 161: Missing call to `getScheduleForDate`
   - Line 166: Hardcoded `lecture.schedules?.[0]?.startTime` instead of using the correct schedule for the date

2. **src/pages/Dashboard.tsx**
   - Line 2: Import statement (needed to add `getScheduleForDate`)
   - Line 44: Missing call to `getScheduleForDate`
   - Line 56: Hardcoded `lecture.schedules?.[0]?.startTime`
   - Line 59: Hardcoded `lecture.schedules?.[0]?.location`
   - Line 62: Hardcoded `lecture.schedules[0].location`

3. **src/utils/dateUtils.ts**
   - Line 18-37: Added new `getScheduleForDate` utility function

## The Fix

### 1. New Utility Function (`src/utils/dateUtils.ts`)

Added a new function that finds the correct schedule for a given date:

```typescript
/**
 * Get the specific schedule for a lecture on a given date
 * Returns the schedule that matches the day, or the first schedule if none match
 */
export function getScheduleForDate(lecture: Lecture, date: Date) {
    const dayName = format(date, 'EEE'); // Mon, Tue, etc.

    // Safety check: handle lectures without schedules array (pre-migration)
    if (!lecture.schedules || !Array.isArray(lecture.schedules) || lecture.schedules.length === 0) {
        return null;
    }

    // Find the schedule that matches this day
    const matchingSchedule = lecture.schedules.find(schedule =>
        schedule.days.includes(dayName)
    );

    // Return the matching schedule, or the first one as fallback
    return matchingSchedule || lecture.schedules[0];
}
```

### 2. Updated Calendar.tsx

**Changes:**
- Line 19: Added `getScheduleForDate` to imports
- Line 161: Added `const scheduleForDate = getScheduleForDate(lecture, selectedDate);`
- Line 166: Changed from `{lecture.schedules?.[0]?.startTime} - {lecture.schedules?.[0]?.endTime}` to `{scheduleForDate?.startTime} - {scheduleForDate?.endTime}`

### 3. Updated Dashboard.tsx

**Changes:**
- Line 2: Added `getScheduleForDate` to imports
- Line 44: Added `const scheduleForDate = getScheduleForDate(lecture, today);`
- Line 56: Changed from `{lecture.schedules?.[0]?.startTime}` to `{scheduleForDate?.startTime}`
- Line 59: Changed from `{lecture.schedules?.[0]?.location &&` to `{scheduleForDate?.location &&`
- Line 62: Changed from `{lecture.schedules[0].location}` to `{scheduleForDate?.location}`

## How the Fix Works

1. When rendering a lecture card for a specific date, the code now calls `getScheduleForDate(lecture, date)`
2. This function:
   - Gets the day name (e.g., "Mon", "Tue") from the date
   - Searches through all schedules to find one that includes that day
   - Returns the matching schedule, or falls back to the first schedule if no match is found
3. The UI then displays the correct time and location from the matched schedule

## Example After Fix

For the EC lecture with schedules:
- Mon 11:00-12:00
- Tue+Wed 09:00-10:00
- Thu 14:00-15:00

**Viewing Monday:** Shows "EC • 11:00-12:00" ✓
**Viewing Tuesday:** Shows "EC • 09:00-10:00" ✓
**Viewing Wednesday:** Shows "EC • 09:00-10:00" ✓
**Viewing Thursday:** Shows "EC • 14:00-15:00" ✓

## Expected Behavior Achieved

✓ When viewing a specific date in the calendar, ALL lectures scheduled for that day are visible
✓ Each lecture displays the correct time slot for that specific day
✓ Attendance is displayed with the correct schedule information
✓ The fix handles edge cases (missing schedules, no matching schedule)
