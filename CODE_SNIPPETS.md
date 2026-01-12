# Calendar Attendance Visibility Bug - Code Snippets

## Bug Location and Fix

### File 1: src/utils/dateUtils.ts

**BEFORE:**
```typescript
import { format } from 'date-fns';
import { type Lecture } from '../db/db';

export function isLectureScheduledForDate(lecture: Lecture, date: Date): boolean {
    const dayName = format(date, 'EEE'); // Mon, Tue, etc.

    // Safety check: handle lectures without schedules array (pre-migration)
    if (!lecture.schedules || !Array.isArray(lecture.schedules) || lecture.schedules.length === 0) {
        return false;
    }

    // Check if any schedule matches this date
    return lecture.schedules.some(schedule =>
        schedule.days.includes(dayName)
    );
}

export const getTodayLectures = (lectures: Lecture[]): Lecture[] => {
    const today = new Date();
    return lectures.filter(lecture => isLectureScheduledForDate(lecture, today));
};
```

**AFTER:**
```typescript
import { format } from 'date-fns';
import { type Lecture } from '../db/db';

export function isLectureScheduledForDate(lecture: Lecture, date: Date): boolean {
    const dayName = format(date, 'EEE'); // Mon, Tue, etc.

    // Safety check: handle lectures without schedules array (pre-migration)
    if (!lecture.schedules || !Array.isArray(lecture.schedules) || lecture.schedules.length === 0) {
        return false;
    }

    // Check if any schedule matches this date
    return lecture.schedules.some(schedule =>
        schedule.days.includes(dayName)
    );
}

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

export const getTodayLectures = (lectures: Lecture[]): Lecture[] => {
    const today = new Date();
    return lectures.filter(lecture => isLectureScheduledForDate(lecture, today));
};
```

---

### File 2: src/pages/Calendar.tsx

**BEFORE (Line 19):**
```typescript
import { isLectureScheduledForDate } from '../utils/dateUtils';
```

**AFTER (Line 19):**
```typescript
import { isLectureScheduledForDate, getScheduleForDate } from '../utils/dateUtils';
```

**BEFORE (Lines 158-167):**
```typescript
                        {lecturesForSelectedDate.map(lecture => {
                            const status = getAttendanceStatus(lecture.id, selectedDateStr);

                            return (
                                <Card key={lecture.id} className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold">{lecture.name}</h3>
                                        <p className="text-sm text-gray-500">{lecture.schedules?.[0]?.startTime || 'N/A'} - {lecture.schedules?.[0]?.endTime || 'N/A'}</p>
```

**AFTER (Lines 159-168):**
```typescript
                        {lecturesForSelectedDate.map(lecture => {
                            const status = getAttendanceStatus(lecture.id, selectedDateStr);

                            const scheduleForDate = getScheduleForDate(lecture, selectedDate);

                            return (
                                <Card key={lecture.id} className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold">{lecture.name}</h3>
                                        <p className="text-sm text-gray-500">{scheduleForDate?.startTime || 'N/A'} - {scheduleForDate?.endTime || 'N/A'}</p>
```

---

### File 3: src/pages/Dashboard.tsx

**BEFORE (Line 2):**
```typescript
import { getTodayLectures } from '../utils/dateUtils';
```

**AFTER (Line 2):**
```typescript
import { getTodayLectures, getScheduleForDate } from '../utils/dateUtils';
```

**BEFORE (Lines 43-64):**
```typescript
                    {todayLectures.map(lecture => {
                        const status = getAttendanceStatus(lecture.id);

                        return (
                            <Card key={lecture.id} className={`border-l-4 ${status?.status === 'present' ? 'border-l-green-500' : status?.status === 'absent' ? 'border-l-red-500' : 'border-l-blue-500'}`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-xl font-bold">{lecture.name}</h3>
                                        <p className="text-sm text-gray-500 font-medium">{lecture.courseCode}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                                            <Clock size={14} />
                                            {lecture.schedules?.[0]?.startTime || 'N/A'}
                                        </div>
                                        {lecture.schedules?.[0]?.location && (
                                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1 justify-end">
                                                <MapPin size={12} />
                                                {lecture.schedules[0].location}
                                            </div>
                                        )}
                                    </div>
```

**AFTER (Lines 43-65):**
```typescript
                    {todayLectures.map(lecture => {
                        const status = getAttendanceStatus(lecture.id);
                        const scheduleForDate = getScheduleForDate(lecture, today);

                        return (
                            <Card key={lecture.id} className={`border-l-4 ${status?.status === 'present' ? 'border-l-green-500' : status?.status === 'absent' ? 'border-l-red-500' : 'border-l-blue-500'}`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-xl font-bold">{lecture.name}</h3>
                                        <p className="text-sm text-gray-500 font-medium">{lecture.courseCode}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                                            <Clock size={14} />
                                            {scheduleForDate?.startTime || 'N/A'}
                                        </div>
                                        {scheduleForDate?.location && (
                                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1 justify-end">
                                                <MapPin size={12} />
                                                {scheduleForDate?.location}
                                            </div>
                                        )}
                                    </div>
```

---

## Key Changes Summary

### What Was Wrong:
1. **Calendar.tsx (Line 166)**: Always showed `lecture.schedules[0].startTime` and `lecture.schedules[0].endTime`
2. **Dashboard.tsx (Lines 56, 59, 62)**: Always showed `lecture.schedules[0].startTime` and `lecture.schedules[0].location`

### What We Fixed:
1. Created `getScheduleForDate()` utility function that finds the correct schedule 
