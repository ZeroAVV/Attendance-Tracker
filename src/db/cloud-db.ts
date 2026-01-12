import { createSupabaseClient, type SupabaseClient } from '../utils/supabase';

export interface Lecture {
    id: string;
    userId: string;
    name: string;
    courseCode?: string;
    professor?: string;
    schedules: Array<{
        days: string[];
        startTime: string;
        endTime: string;
        location?: string;
    }>;
    totalLectures?: number;
    startDate?: string;
    endDate?: string;
    targetPercentage?: number;
    color?: string;
}

export interface AttendanceRecord {
    id: string;
    userId: string;
    lectureId: string;
    date: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    notes?: string;
    timestamp: number;
}

interface LectureRow {
    id: string;
    user_id: string;
    name: string;
    course_code?: string | null;
    professor?: string | null;
    schedules: Lecture['schedules'];
    total_lectures?: number | null;
    start_date?: string | null;
    end_date?: string | null;
    target_percentage?: number | null;
    color?: string | null;
}

interface AttendanceRow {
    id: string;
    user_id: string;
    lecture_id: string;
    date: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    notes?: string | null;
    timestamp: number;
}

const lectureRowToLecture = (row: LectureRow): Lecture => ({
    id: row.id,
    userId: row.user_id,
    name: row.name,
    courseCode: row.course_code ?? undefined,
    professor: row.professor ?? undefined,
    schedules: row.schedules,
    totalLectures: row.total_lectures ?? undefined,
    startDate: row.start_date ?? undefined,
    endDate: row.end_date ?? undefined,
    targetPercentage: row.target_percentage ?? undefined,
    color: row.color ?? undefined,
});

const lectureToRow = (lecture: Lecture): LectureRow => ({
    id: lecture.id,
    user_id: lecture.userId,
    name: lecture.name,
    course_code: lecture.courseCode ?? null,
    professor: lecture.professor ?? null,
    schedules: lecture.schedules,
    total_lectures: lecture.totalLectures ?? null,
    start_date: lecture.startDate ?? null,
    end_date: lecture.endDate ?? null,
    target_percentage: lecture.targetPercentage ?? null,
    color: lecture.color ?? null,
});

const attendanceRowToRecord = (row: AttendanceRow): AttendanceRecord => ({
    id: row.id,
    userId: row.user_id,
    lectureId: row.lecture_id,
    date: row.date,
    status: row.status,
    notes: row.notes ?? undefined,
    timestamp: row.timestamp,
});

const attendanceToRow = (record: AttendanceRecord): AttendanceRow => ({
    id: record.id,
    user_id: record.userId,
    lecture_id: record.lectureId,
    date: record.date,
    status: record.status,
    notes: record.notes ?? null,
    timestamp: record.timestamp,
});

export const initDB = async (getToken: () => Promise<string | null>): Promise<SupabaseClient> => {
    return createSupabaseClient(getToken);
};

export async function getAllLectures(supabase: SupabaseClient, userId: string): Promise<Lecture[]> {
    const { data, error } = await supabase
        .from('lectures')
        .select('*')
        .eq('user_id', userId);

    if (error) throw error;
    return (data || []).map(lectureRowToLecture);
}

export async function putLecture(supabase: SupabaseClient, lecture: Lecture): Promise<void> {
    const row = lectureToRow(lecture);
    const { error } = await supabase
        .from('lectures')
        .upsert(row, { onConflict: 'id' });

    if (error) throw error;
}

export async function deleteLecture(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase
        .from('lectures')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

export async function getAllAttendance(supabase: SupabaseClient, userId: string): Promise<AttendanceRecord[]> {
    const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('user_id', userId);

    if (error) throw error;
    return (data || []).map(attendanceRowToRecord);
}

export async function getAttendanceForLecture(
    supabase: SupabaseClient,
    lectureId: string,
    userId: string
): Promise<AttendanceRecord[]> {
    const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('lecture_id', lectureId)
        .eq('user_id', userId);

    if (error) throw error;
    return (data || []).map(attendanceRowToRecord);
}

export async function putAttendance(supabase: SupabaseClient, record: AttendanceRecord): Promise<void> {
    const row = attendanceToRow(record);
    const { error } = await supabase
        .from('attendance_records')
        .upsert(row, { onConflict: 'user_id,lecture_id,date' });

    if (error) throw error;
}

export async function deleteAttendanceForLecture(
    supabase: SupabaseClient,
    lectureId: string,
    userId: string
): Promise<void> {
    const { error } = await supabase
        .from('attendance_records')
        .delete()
        .eq('lecture_id', lectureId)
        .eq('user_id', userId);

    if (error) throw error;
}

export async function deleteAttendance(
    supabase: SupabaseClient,
    id: string,
    userId: string
): Promise<void> {
    const { error } = await supabase
        .from('attendance_records')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

    if (error) throw error;
}

export async function clearAllLectures(supabase: SupabaseClient, userId: string): Promise<void> {
    const { error } = await supabase
        .from('lectures')
        .delete()
        .eq('user_id', userId);

    if (error) throw error;
}

export async function clearAllAttendance(supabase: SupabaseClient, userId: string): Promise<void> {
    const { error } = await supabase
        .from('attendance_records')
        .delete()
        .eq('user_id', userId);

    if (error) throw error;
}

export async function clearAllData(supabase: SupabaseClient, userId: string): Promise<void> {
    await clearAllAttendance(supabase, userId);
    await clearAllLectures(supabase, userId);
}
