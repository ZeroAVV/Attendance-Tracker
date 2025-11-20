import { format } from 'date-fns';
import { type Lecture } from '../db/db';

export const isLectureScheduledForDate = (lecture: Lecture, date: Date): boolean => {
    const dayName = format(date, 'EEE'); // "Mon", "Tue", etc.
    return lecture.schedule.days.includes(dayName);
};

export const getTodayLectures = (lectures: Lecture[]): Lecture[] => {
    const today = new Date();
    return lectures.filter(lecture => isLectureScheduledForDate(lecture, today));
};
