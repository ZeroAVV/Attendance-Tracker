import { create } from 'zustand';
import { dbPromise, type Lecture, type AttendanceRecord } from '../db/db';

interface State {
    lectures: Lecture[];
    attendance: AttendanceRecord[];
    userId: string | null;
    themeColor: 'blue' | 'purple' | 'green' | 'red' | 'orange';
    isLoading: boolean;
    error: string | null;

    // Actions
    setUserId: (userId: string | null) => void;
    setThemeColor: (color: 'blue' | 'purple' | 'green' | 'red' | 'orange') => void;
    fetchData: () => Promise<void>;
    addLecture: (lecture: Omit<Lecture, 'id' | 'userId'>) => Promise<void>;
    updateLecture: (id: string, updates: Partial<Lecture>) => Promise<void>;
    deleteLecture: (id: string) => Promise<void>;
    markAttendance: (record: Omit<AttendanceRecord, 'id' | 'userId' | 'timestamp'>) => Promise<void>;
    getAttendanceForLecture: (lectureId: string) => AttendanceRecord[];
    clearAllData: () => Promise<void>;
    clearAllLectures: () => Promise<void>;
    clearAllAttendance: () => Promise<void>;
}

export const useStore = create<State>((set, get) => ({
    lectures: [],
    attendance: [],
    userId: null,
    themeColor: 'blue',
    isLoading: true,
    error: null,

    setThemeColor: (color) => set({ themeColor: color }),
    setUserId: (userId) => set({ userId }),

    fetchData: async () => {
        const userId = get().userId;
        if (!userId) {
            set({ lectures: [], attendance: [], isLoading: false });
            return;
        }

        try {
            set({ isLoading: true });
            const db = await dbPromise;
            const lectures = await db.getAllFromIndex('lectures', 'by-userId', userId);
            const attendance = await db.getAllFromIndex('attendance', 'by-userId', userId);
            set({ lectures, attendance, isLoading: false });
        } catch (error) {
            console.error(error);
            set({ error: 'Failed to fetch data', isLoading: false });
        }
    },

    addLecture: async (lectureData) => {
        const userId = get().userId;
        if (!userId) return;

        const id = crypto.randomUUID();
        const newLecture: Lecture = { ...lectureData, id, userId };
        const db = await dbPromise;
        await db.put('lectures', newLecture);
        set((state) => ({ lectures: [...state.lectures, newLecture] }));
    },

    updateLecture: async (id, updates) => {
        const userId = get().userId;
        if (!userId) return;

        const db = await dbPromise;
        const lecture = await db.get('lectures', id);
        if (lecture && lecture.userId === userId) {
            const updatedLecture = { ...lecture, ...updates };
            await db.put('lectures', updatedLecture);
            set((state) => ({
                lectures: state.lectures.map((l) => (l.id === id ? updatedLecture : l)),
            }));
        }
    },

    deleteLecture: async (id) => {
        const userId = get().userId;
        if (!userId) return;

        const db = await dbPromise;
        const lecture = await db.get('lectures', id);
        if (lecture && lecture.userId === userId) {
            await db.delete('lectures', id);

            // Cascading delete for attendance
            const tx = db.transaction('attendance', 'readwrite');
            const index = tx.store.index('by-lecture');
            let cursor = await index.openCursor(IDBKeyRange.only(id));
            while (cursor) {
                const record = await cursor.value;
                if (record && record.userId === userId) {
                    await cursor.delete();
                }
                cursor = await cursor.continue();
            }
            await tx.done;

            set((state) => ({
                lectures: state.lectures.filter((l) => l.id !== id),
                attendance: state.attendance.filter((a) => a.lectureId !== id || a.userId !== userId),
            }));
        }
    },

    markAttendance: async (recordData) => {
        const userId = get().userId;
        if (!userId) return;

        const db = await dbPromise;

        // Check if attendance record already exists for this lecture and date
        const tx = db.transaction('attendance', 'readwrite');
        const index = tx.store.index('by-userId-lecture-date');
        const existingRecord = await index.get([userId, recordData.lectureId, recordData.date]);

        if (existingRecord) {
            // Update existing record
            const updatedRecord: AttendanceRecord = {
                ...existingRecord,
                status: recordData.status,
                timestamp: Date.now()
            };
            await db.put('attendance', updatedRecord);
            set((state) => ({
                attendance: state.attendance.map((a) =>
                    a.id === existingRecord.id ? updatedRecord : a
                )
            }));
        } else {
            // Create new record
            const id = crypto.randomUUID();
            const timestamp = Date.now();
            const newRecord: AttendanceRecord = { ...recordData, id, userId, timestamp };
            await db.put('attendance', newRecord);
            set((state) => ({ attendance: [...state.attendance, newRecord] }));
        }
    },

    getAttendanceForLecture: (lectureId) => {
        return get().attendance.filter((a) => a.lectureId === lectureId);
    },

    clearAllData: async () => {
        const userId = get().userId;
        if (!userId) return;

        const db = await dbPromise;
        const tx = db.transaction(['lectures', 'attendance'], 'readwrite');

        const lectureIndex = tx.objectStore('lectures').index('by-userId');
        const attendanceIndex = tx.objectStore('attendance').index('by-userId');

        let lectureCursor = await lectureIndex.openCursor(IDBKeyRange.only(userId));
        while (lectureCursor) {
            await lectureCursor.delete();
            lectureCursor = await lectureCursor.continue();
        }

        let attendanceCursor = await attendanceIndex.openCursor(IDBKeyRange.only(userId));
        while (attendanceCursor) {
            await attendanceCursor.delete();
            attendanceCursor = await attendanceCursor.continue();
        }

        await tx.done;
        set({ lectures: [], attendance: [] });
    },

    clearAllLectures: async () => {
        const userId = get().userId;
        if (!userId) return;

        const db = await dbPromise;
        const tx = db.transaction('lectures', 'readwrite');
        const index = tx.objectStore('lectures').index('by-userId');

        let cursor = await index.openCursor(IDBKeyRange.only(userId));
        while (cursor) {
            await cursor.delete();
            cursor = await cursor.continue();
        }

        await tx.done;
        set({ lectures: [] });
    },

    clearAllAttendance: async () => {
        const userId = get().userId;
        if (!userId) return;

        const db = await dbPromise;
        const tx = db.transaction('attendance', 'readwrite');
        const index = tx.objectStore('attendance').index('by-userId');

        let cursor = await index.openCursor(IDBKeyRange.only(userId));
        while (cursor) {
            await cursor.delete();
            cursor = await cursor.continue();
        }

        await tx.done;
        set({ attendance: [] });
    },
}));
