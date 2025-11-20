import { create } from 'zustand';
import { dbPromise, type Lecture, type AttendanceRecord } from '../db/db';

interface State {
    lectures: Lecture[];
    attendance: AttendanceRecord[];
    themeColor: 'blue' | 'purple' | 'green' | 'red' | 'orange';
    isLoading: boolean;
    error: string | null;

    // Actions
    setThemeColor: (color: 'blue' | 'purple' | 'green' | 'red' | 'orange') => void;
    fetchData: () => Promise<void>;
    addLecture: (lecture: Omit<Lecture, 'id'>) => Promise<void>;
    updateLecture: (id: string, updates: Partial<Lecture>) => Promise<void>;
    deleteLecture: (id: string) => Promise<void>;
    markAttendance: (record: Omit<AttendanceRecord, 'id' | 'timestamp'>) => Promise<void>;
    getAttendanceForLecture: (lectureId: string) => AttendanceRecord[];
    clearAllData: () => Promise<void>;
    clearAllLectures: () => Promise<void>;
    clearAllAttendance: () => Promise<void>;
}

export const useStore = create<State>((set, get) => ({
    lectures: [],
    attendance: [],
    themeColor: 'blue',
    isLoading: true,
    error: null,

    setThemeColor: (color) => set({ themeColor: color }),

    fetchData: async () => {
        try {
            set({ isLoading: true });
            const db = await dbPromise;
            const lectures = await db.getAll('lectures');
            const attendance = await db.getAll('attendance');
            set({ lectures, attendance, isLoading: false });
        } catch (error) {
            console.error(error);
            set({ error: 'Failed to fetch data', isLoading: false });
        }
    },

    addLecture: async (lectureData) => {
        const id = crypto.randomUUID();
        const newLecture: Lecture = { ...lectureData, id };
        const db = await dbPromise;
        await db.put('lectures', newLecture);
        set((state) => ({ lectures: [...state.lectures, newLecture] }));
    },

    updateLecture: async (id, updates) => {
        const db = await dbPromise;
        const lecture = await db.get('lectures', id);
        if (lecture) {
            const updatedLecture = { ...lecture, ...updates };
            await db.put('lectures', updatedLecture);
            set((state) => ({
                lectures: state.lectures.map((l) => (l.id === id ? updatedLecture : l)),
            }));
        }
    },

    deleteLecture: async (id) => {
        const db = await dbPromise;
        await db.delete('lectures', id);

        // Cascading delete for attendance
        const tx = db.transaction('attendance', 'readwrite');
        const index = tx.store.index('by-lecture');
        let cursor = await index.openCursor(IDBKeyRange.only(id));
        while (cursor) {
            await cursor.delete();
            cursor = await cursor.continue();
        }
        await tx.done;

        set((state) => ({
            lectures: state.lectures.filter((l) => l.id !== id),
            attendance: state.attendance.filter((a) => a.lectureId !== id),
        }));
    },

    markAttendance: async (recordData) => {
        const db = await dbPromise;

        // Check if attendance record already exists for this lecture and date
        const tx = db.transaction('attendance', 'readwrite');
        const index = tx.store.index('by-lecture-date');
        const existingRecord = await index.get([recordData.lectureId, recordData.date]);

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
            const newRecord: AttendanceRecord = { ...recordData, id, timestamp };
            await db.put('attendance', newRecord);
            set((state) => ({ attendance: [...state.attendance, newRecord] }));
        }
    },

    getAttendanceForLecture: (lectureId) => {
        return get().attendance.filter((a) => a.lectureId === lectureId);
    },

    clearAllData: async () => {
        const db = await dbPromise;
        await db.clear('lectures');
        await db.clear('attendance');
        set({ lectures: [], attendance: [] });
    },

    clearAllLectures: async () => {
        const db = await dbPromise;
        await db.clear('lectures');
        set({ lectures: [] });
    },

    clearAllAttendance: async () => {
        const db = await dbPromise;
        await db.clear('attendance');
        set({ attendance: [] });
    },
}));
