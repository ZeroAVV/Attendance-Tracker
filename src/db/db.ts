import { openDB, type DBSchema } from 'idb';

export interface Lecture {
    id: string;
    userId: string;
    name: string;
    courseCode?: string;
    professor?: string;
    schedules: Array<{
        days: string[]; // e.g., ["Mon", "Wed"]
        startTime: string; // "10:00"
        endTime: string; // "11:30"
        location?: string;
    }>;
    totalLectures?: number;
    startDate?: string;
    endDate?: string;
    targetPercentage?: number; // e.g., 75
    color?: string; // For UI
}

export interface AttendanceRecord {
    id: string;
    userId: string;
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
        indexes: { 'by-name': string; 'by-userId': string; 'by-userId-name': [string, string] };
    };
    attendance: {
        key: string;
        value: AttendanceRecord;
        indexes: { 'by-lecture': string; 'by-date': string; 'by-lecture-date': [string, string]; 'by-userId': string; 'by-userId-lecture': [string, string]; 'by-userId-date': [string, string]; 'by-userId-lecture-date': [string, string, string] };
    };
}

const DB_NAME = 'attendance-tracker-db';
const DB_VERSION = 3;

export const initDB = async () => {
    return openDB<AttendanceTrackerDB>(DB_NAME, DB_VERSION, {
        async upgrade(db, oldVersion) {
            // Create object stores if they don't exist
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

            // Migrate from version 1 to 2: schedule → schedules
            if (oldVersion < 2 && db.objectStoreNames.contains('lectures')) {
                const tx = db.transaction('lectures', 'readwrite');
                const store = tx.objectStore('lectures');
                const allLectures = await store.getAll();

                for (const lecture of allLectures) {
                    // @ts-expect-error - accessing old schema property
                    if (lecture.schedule && !lecture.schedules) {
                        // @ts-expect-error - migrating to new schema
                        lecture.schedules = [lecture.schedule];
                        // @ts-expect-error - removing old property
                        delete lecture.schedule;
                        await store.put(lecture);
                    }
                }

                await tx.done;
            }

            // Migrate from version 2 to 3: Add user isolation and wipe data
            if (oldVersion < 3) {
                // Add new indexes to lectures store
                if (db.objectStoreNames.contains('lectures')) {
                    const lectureStore = db.transaction('lectures', 'versionchange').objectStore('lectures');
                    if (!lectureStore.indexNames.contains('by-userId')) {
                        lectureStore.createIndex('by-userId', 'userId');
                    }
                    if (!lectureStore.indexNames.contains('by-userId-name')) {
                        lectureStore.createIndex('by-userId-name', ['userId', 'name']);
                    }
                }

                // Add new indexes to attendance store
                if (db.objectStoreNames.contains('attendance')) {
                    const attendanceStore = db.transaction('attendance', 'versionchange').objectStore('attendance');
                    if (!attendanceStore.indexNames.contains('by-userId')) {
                        attendanceStore.createIndex('by-userId', 'userId');
                    }
                    if (!attendanceStore.indexNames.contains('by-userId-lecture')) {
                        attendanceStore.createIndex('by-userId-lecture', ['userId', 'lectureId']);
                    }
                    if (!attendanceStore.indexNames.contains('by-userId-date')) {
                        attendanceStore.createIndex('by-userId-date', ['userId', 'date']);
                    }
                    if (!attendanceStore.indexNames.contains('by-userId-lecture-date')) {
                        attendanceStore.createIndex('by-userId-lecture-date', ['userId', 'lectureId', 'date']);
                    }
                }

                // Clear all existing data for clean slate with user isolation
                const tx = db.transaction(['lectures', 'attendance'], 'readwrite');
                await tx.objectStore('lectures').clear();
                await tx.objectStore('attendance').clear();
                await tx.done;
            }
        },
    });
};

export const dbPromise = initDB();
