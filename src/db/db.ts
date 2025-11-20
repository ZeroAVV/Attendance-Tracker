import { openDB, type DBSchema } from 'idb';

export interface Lecture {
    id: string;
    name: string;
    courseCode?: string;
    professor?: string;
    schedule: {
        days: string[]; // e.g., ["Mon", "Wed"]
        startTime: string; // "10:00"
        endTime: string; // "11:30"
        location?: string;
    };
    totalLectures?: number;
    startDate?: string;
    endDate?: string;
    targetPercentage?: number; // e.g., 75
    color?: string; // For UI
}

export interface AttendanceRecord {
    id: string;
    lectureId: string;
    date: string; // ISO date string YYYY-MM-DD
    status: 'present' | 'absent' | 'late' | 'excused';
    notes?: string;
    timestamp: number;
}

interface AttendanceTrackerDB extends DBSchema {
    lectures: {
        key: string;
        value: Lecture;
        indexes: { 'by-name': string };
    };
    attendance: {
        key: string;
        value: AttendanceRecord;
        indexes: { 'by-lecture': string; 'by-date': string; 'by-lecture-date': [string, string] };
    };
}

const DB_NAME = 'attendance-tracker-db';
const DB_VERSION = 1;

export const initDB = async () => {
    return openDB<AttendanceTrackerDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('lectures')) {
                const lectureStore = db.createObjectStore('lectures', { keyPath: 'id' });
                lectureStore.createIndex('by-name', 'name');
            }
            if (!db.objectStoreNames.contains('attendance')) {
                const attendanceStore = db.createObjectStore('attendance', { keyPath: 'id' });
                attendanceStore.createIndex('by-lecture', 'lectureId');
                attendanceStore.createIndex('by-date', 'date');
                attendanceStore.createIndex('by-lecture-date', ['lectureId', 'date']);
            }
        },
    });
};

export const dbPromise = initDB();
