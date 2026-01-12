import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, Calendar } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useStore } from '../store/useStore';
import type { Lecture } from '../db/db';
import { clsx } from 'clsx';
import { getThemeClasses } from '../utils/themeUtils';

interface ManualEntryProps {
    onClose: () => void;
}

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface DaySlot {
    name: string;
    courseCode: string;
    startTime: string;
    endTime: string;
    location: string;
}

export default function ManualTimetableEntry({ onClose }: ManualEntryProps) {
    const addLecture = useStore((state) => state.addLecture);
    const lectures = useStore((state) => state.lectures);
    const deleteLecture = useStore((state) => state.deleteLecture);
    const themeColor = useStore((state) => state.themeColor);
    const theme = getThemeClasses(themeColor);

    const [daySchedules, setDaySchedules] = useState<Record<string, DaySlot[]>>({
        Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: []
    });
    const [selectedDay, setSelectedDay] = useState<string>('Mon');

    const addDaySlot = (day: string) => {
        setDaySchedules({
            ...daySchedules,
            [day]: [...daySchedules[day], { name: '', courseCode: '', startTime: '09:00', endTime: '10:00', location: '' }]
        });
    };

    const removeDaySlot = (day: string, index: number) => {
        setDaySchedules({ ...daySchedules, [day]: daySchedules[day].filter((_, i) => i !== index) });
    };

    const updateDaySlot = (day: string, index: number, updates: Partial<DaySlot>) => {
        setDaySchedules({
            ...daySchedules,
            [day]: daySchedules[day].map((slot, i) => i === index ? { ...slot, ...updates } : slot)
        });
    };

    const handleSubmit = async () => {
        const subjectMap: Record<string, Array<{
            courseCode: string; days: string[]; startTime: string; endTime: string; location: string;
        }>> = {};

        // Group by subject name
        Object.entries(daySchedules).forEach(([day, slots]) => {
            slots.forEach(slot => {
                if (!slot.name.trim()) return;
                const subjectKey = slot.name.trim().toLowerCase();
                if (!subjectMap[subjectKey]) subjectMap[subjectKey] = [];

                const timeKey = slot.startTime + '-' + slot.endTime + '-' + slot.location;
                const existingSchedule = subjectMap[subjectKey].find(s =>
                    (s.startTime + '-' + s.endTime + '-' + s.location) === timeKey
                );

                if (existingSchedule) {
                    if (!existingSchedule.days.includes(day)) existingSchedule.days.push(day);
                    if (slot.courseCode) existingSchedule.courseCode = slot.courseCode;
                } else {
                    subjectMap[subjectKey].push({
                        courseCode: slot.courseCode,
                        days: [day],
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        location: slot.location
                    });
                }
            });
        });

        // Merge with existing lectures
        const lecturesToAdd: Omit<Lecture, 'id' | 'userId'>[] = [];
        for (const [subjectName, newSchedules] of Object.entries(subjectMap)) {
            const existingLecture = lectures.find(l => l.name.trim().toLowerCase() === subjectName);

            if (existingLecture) {
                // Delete old and create new with merged schedules
                await deleteLecture(existingLecture.id);
                const combinedSchedules = [...(existingLecture.schedules || [])];

                newSchedules.forEach(newSched => {
                    const timeKey = newSched.startTime + '-' + newSched.endTime + '-' + newSched.location;
                    const existing = combinedSchedules.find(s =>
                        (s.startTime + '-' + s.endTime + '-' + s.location) === timeKey
                    );

                    if (existing) {
                        newSched.days.forEach(day => {
                            if (!existing.days.includes(day)) existing.days.push(day);
                        });
                    } else {
                        combinedSchedules.push({
                            days: newSched.days,
                            startTime: newSched.startTime,
                            endTime: newSched.endTime,
                            location: newSched.location
                        });
                    }
                });

                lecturesToAdd.push({
                    name: existingLecture.name,
                    courseCode: newSchedules.find(s => s.courseCode)?.courseCode || existingLecture.courseCode,
                    professor: existingLecture.professor,
                    schedules: combinedSchedules,
                    targetPercentage: existingLecture.targetPercentage
                });
            } else {
                // New lecture
                lecturesToAdd.push({
                    name: subjectName,
                    courseCode: newSchedules.find(s => s.courseCode)?.courseCode || '',
                    professor: '',
                    schedules: newSchedules.map(s => ({
                        days: s.days,
                        startTime: s.startTime,
                        endTime: s.endTime,
                        location: s.location
                    })),
                    targetPercentage: 75
                });
            }
        }

        if (lecturesToAdd.length === 0) {
            alert('Please add at least one valid lecture.');
            return;
        }

        for (const lecture of lecturesToAdd) {
            await addLecture(lecture);
        }
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-6 w-full max-w-4xl shadow-2xl border border-gray-200 dark:border-gray-700 relative max-h-[90vh] overflow-hidden flex flex-col"
        >
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-10">
                <X size={24} />
            </button>

            <div className="mb-6">
                <div className={clsx("inline-block px-4 py-2 rounded-full text-sm font-bold mb-3", theme.bgLight, theme.text)}>
                    ✨ Manual Entry
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Build Your Week
                </h2>
                <p className="text-sm text-gray-500 mt-1">Add day by day - same subject gets merged!</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                <div className="space-y-4">
                    <div className="grid grid-cols-7 gap-2 mb-6">
                        {daysOfWeek.map(day => (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(day)}
                                className={clsx(
                                    "py-3 px-2 rounded-xl font-bold text-sm transition-all duration-200",
                                    selectedDay === day
                                        ? `${theme.primary} text-white shadow-lg transform scale-110`
                                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:shadow-md border border-gray-200 dark:border-gray-700"
                                )}
                            >
                                <div className="text-xs opacity-70">{day.slice(0, 1)}</div>
                                <div>{day.slice(0, 3)}</div>
                                {daySchedules[day].length > 0 && (
                                    <div className="text-[10px] mt-1 opacity-80">({daySchedules[day].length})</div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <span className={clsx("w-3 h-3 rounded-full", theme.primary)}></span>
                                {selectedDay} Schedule
                            </h3>
                            <Button size="sm" onClick={() => addDaySlot(selectedDay)} className="!rounded-xl">
                                <Plus size={16} className="mr-1" />
                                Add Lecture
                            </Button>
                        </div>

                        {daySchedules[selectedDay].length === 0 ? (
                            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                                <Calendar className="mx-auto mb-3 text-gray-400" size={48} />
                                <p className="text-gray-500 font-medium">No lectures scheduled</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {daySchedules[selectedDay].map((slot, index) => (
                                    <Card key={index} className={clsx("!p-4 border-l-4", theme.border, "hover:shadow-lg transition-shadow")}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className={clsx("w-2 h-2 rounded-full", theme.primary)}></div>
                                                <span className="text-xs font-bold text-gray-500">Lecture {index + 1}</span>
                                            </div>
                                            <button
                                                onClick={() => removeDaySlot(selectedDay, index)}
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                placeholder="Subject Name (e.g., PEE)"
                                                value={slot.name}
                                                onChange={e => updateDaySlot(selectedDay, index, { name: e.target.value })}
                                                className="col-span-2 p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Code"
                                                value={slot.courseCode}
                                                onChange={e => updateDaySlot(selectedDay, index, { courseCode: e.target.value })}
                                                className="p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Room"
                                                value={slot.location}
                                                onChange={e => updateDaySlot(selectedDay, index, { location: e.target.value })}
                                                className="p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors"
                                            />
                                            <div className="col-span-2 grid grid-cols-2 gap-3">
                                                <div className="relative">
                                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Start Time</label>
                                                    <input
                                                        type="time"
                                                        value={slot.startTime}
                                                        onChange={e => updateDaySlot(selectedDay, index, { startTime: e.target.value })}
                                                        className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors"
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <label className="block text-xs font-semibold text-gray-500 mb-1">End Time</label>
                                                    <input
                                                        type="time"
                                                        value={slot.endTime}
                                                        onChange={e => updateDaySlot(selectedDay, index, { endTime: e.target.value })}
                                                        className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                <Button onClick={handleSubmit} className="w-full !rounded-2xl !py-4 !text-lg font-bold shadow-lg">
                    ✨ Import Timetable
                </Button>
            </div>
        </motion.div>
    );
}