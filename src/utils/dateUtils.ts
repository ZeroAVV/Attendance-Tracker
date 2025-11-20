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
