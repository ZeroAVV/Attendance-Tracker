import { create } from 'zustand';
import { dbPromise, type Lecture, type AttendanceRecord } from '../db/db';

interface State {
    lectures: Lecture[];
    attendance: AttendanceRecord[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchData: () => Promise<void>;
    addLecture: (lecture: Omit<Lecture, 'id'>) => Promise<void>;
    updateLecture: (id: string, updates: Partial<Lecture>) => Promise<void>;
    deleteLecture: (id: string) => Promise<void>;
    markAttendance: (record: Omit<AttendanceRecord, 'id' | 'timestamp'>) => Promise<void>;
    getAttendanceForLecture: (lectureId: string) => AttendanceRecord[];
}

export const useStore = create<State>((set, get) => ({
    lectures: [],
    attendance: [],
    isLoading: true,
    error: null,

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
        const id = crypto.randomUUID();
        const timestamp = Date.now();
        const newRecord: AttendanceRecord = { ...recordData, id, timestamp };
        const db = await dbPromise;
        await db.put('attendance', newRecord);
        set((state) => ({ attendance: [...state.attendance, newRecord] }));
    },

    getAttendanceForLecture: (lectureId) => {
        return get().attendance.filter((a) => a.lectureId === lectureId);
    },
}));
