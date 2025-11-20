import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ChevronLeft, ChevronRight, Check, X, Calendar as CalendarIcon } from 'lucide-react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday,
    startOfWeek,
    endOfWeek
} from 'date-fns';
import { isLectureScheduledForDate } from '../utils/dateUtils';
import { clsx } from 'clsx';
import { AnimatePresence } from 'framer-motion';
import { getThemeClasses } from '../utils/themeUtils';

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const lectures = useStore((state) => state.lectures);
    const attendance = useStore((state) => state.attendance);
    const markAttendance = useStore((state) => state.markAttendance);
    const themeColor = useStore((state) => state.themeColor);
    const theme = getThemeClasses(themeColor);

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

    // Get lectures scheduled for the selected date
    const lecturesForSelectedDate = lectures.filter(lecture =>
        isLectureScheduledForDate(lecture, selectedDate)
    );

    const getAttendanceStatus = (lectureId: string, dateStr: string) => {
        return attendance.find(a => a.lectureId === lectureId && a.date === dateStr);
    };

    const handleMark = async (lectureId: string, status: 'present' | 'absent') => {
        await markAttendance({
            lectureId,
            date: selectedDateStr,
            status,
        });
    };

    // Calculate daily status for dots
    const getDayStatus = (day: Date) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayLectures = lectures.filter(l => isLectureScheduledForDate(l, day));

        if (dayLectures.length === 0) return null;

        const dayAttendance = attendance.filter(a => a.date === dateStr);
        const presentCount = dayAttendance.filter(a => a.status === 'present').length;
        const absentCount = dayAttendance.filter(a => a.status === 'absent').length;

        if (presentCount === dayLectures.length) return 'all-present';
        if (absentCount > 0) return 'has-absent';
        if (presentCount > 0) return 'partial';
        return 'pending';
    };

    return (
        <div className="p-4 pb-24 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Calendar</h1>
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    <button onClick={prevMonth} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="font-medium min-w-[100px] text-center">
                        {format(currentDate, 'MMMM yyyy')}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <Card className="mb-6 !p-2">
                <div className="grid grid-cols-7 mb-2 text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-xs font-medium text-gray-400 py-2">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day) => {
                        const status = getDayStatus(day);
                        const isSelected = isSameDay(day, selectedDate);
                        const isCurrentMonth = isSameMonth(day, currentDate);

                        return (
                            <button
                                key={day.toString()}
                                onClick={() => setSelectedDate(day)}
                                className={clsx(
                                    "aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all",
                                    !isCurrentMonth && "opacity-30",
                                    isSelected ? `${theme.primary} text-white shadow-md scale-105 z-10` : "hover:bg-gray-50 dark:hover:bg-gray-800",
                                    isToday(day) && !isSelected && `${theme.text} font-bold ${theme.bgLight} ${theme.bgDark}`
                                )}
                            >
                                <span className="text-sm">{format(day, 'd')}</span>

                                {/* Status Dots */}
                                <div className="flex gap-0.5 mt-1 h-1.5">
                                    {status === 'all-present' && (
                                        <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-green-500'}`} />
                                    )}
                                    {status === 'has-absent' && (
                                        <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-red-500'}`} />
                                    )}
                                    {status === 'partial' && (
                                        <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-yellow-500'}`} />
                                    )}
                                    {status === 'pending' && (
                                        <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/50' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </Card>

            <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <CalendarIcon size={20} className="text-gray-400" />
                    {format(selectedDate, 'EEEE, MMMM d')}
                </h2>

                {lecturesForSelectedDate.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                        No lectures scheduled for this date.
                    </div>
                ) : (
                    <AnimatePresence mode='wait'>
                        {lecturesForSelectedDate.map(lecture => {
                            const status = getAttendanceStatus(lecture.id, selectedDateStr);

                            return (
                                <Card key={lecture.id} className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold">{lecture.name}</h3>
                                        <p className="text-sm text-gray-500">{lecture.schedule.startTime} - {lecture.schedule.endTime}</p>
                                    </div>

                                    {status ? (
                                        <div className="flex items-center gap-3">
                                            <div className={`px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 ${status.status === 'present'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {status.status === 'present' ? 'Present' : 'Absent'}
                                            </div>
                                            <button
                                                onClick={() => handleMark(lecture.id, status.status === 'present' ? 'absent' : 'present')}
                                                className={`text-xs ${theme.text} hover:underline`}
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="!bg-red-50 !text-red-600 hover:!bg-red-100"
                                                onClick={() => handleMark(lecture.id, 'absent')}
                                            >
                                                <X size={16} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="!bg-green-600 hover:!bg-green-700"
                                                onClick={() => handleMark(lecture.id, 'present')}
                                            >
                                                <Check size={16} />
                                            </Button>
                                        </div>
                                    )}
                                </Card>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
