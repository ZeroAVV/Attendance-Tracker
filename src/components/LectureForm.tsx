import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Button } from './ui/Button';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { getThemeClasses } from '../utils/themeUtils';

interface LectureFormProps {
    onClose: () => void;
}

export default function LectureForm({ onClose }: LectureFormProps) {
    const addLecture = useStore((state) => state.addLecture);
    const themeColor = useStore((state) => state.themeColor);
    const theme = getThemeClasses(themeColor);
    const [formData, setFormData] = useState({
        name: '',
        courseCode: '',
        professor: '',
        location: '',
        startTime: '',
        endTime: '',
        days: [] as string[],
        targetPercentage: 75,
    });

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addLecture({
            name: formData.name,
            courseCode: formData.courseCode,
            professor: formData.professor,
            schedules: [{
                days: formData.days,
                startTime: formData.startTime,
                endTime: formData.endTime,
                location: formData.location,
            }],
            targetPercentage: formData.targetPercentage,
        });
        onClose();
    };

    const toggleDay = (day: string) => {
        setFormData(prev => ({
            ...prev,
            days: prev.days.includes(day)
                ? prev.days.filter(d => d !== day)
                : [...prev.days, day]
        }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100 dark:border-gray-700 relative"
        >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-6">Add Lecture</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Lecture Name</label>
                    <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. Advanced Mathematics"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Course Code</label>
                        <input
                            type="text"
                            value={formData.courseCode}
                            onChange={e => setFormData({ ...formData, courseCode: e.target.value })}
                            className={clsx(
                                "w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 outline-none",
                                theme.ring
                            )}
                            placeholder="MAT101"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Target %</label>
                        <input
                            type="number"
                            value={formData.targetPercentage}
                            onChange={e => setFormData({ ...formData, targetPercentage: Number(e.target.value) })}
                            className={clsx(
                                "w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 outline-none",
                                theme.ring
                            )}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Schedule</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {daysOfWeek.map(day => (
                            <button
                                key={day}
                                type="button"
                                onClick={() => toggleDay(day)}
                                className={clsx(
                                    "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                                    formData.days.includes(day)
                                        ? `${theme.bgLight} ${theme.text} ${theme.bgDark}`
                                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                )}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="time"
                            value={formData.startTime}
                            onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                            className={clsx(
                                "w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 outline-none",
                                theme.ring
                            )}
                        />
                        <input
                            type="time"
                            value={formData.endTime}
                            onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                            className={clsx(
                                "w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 outline-none",
                                theme.ring
                            )}
                        />
                    </div>
                </div>

                <Button type="submit" className="w-full mt-6">
                    Create Lecture
                </Button>
            </form>
        </motion.div>
    );
}
