import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { BarChart2, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Stats() {
    const lectures = useStore((state) => state.lectures);
    const attendance = useStore((state) => state.attendance);

    const calculateStats = (lectureId: string) => {
        const lectureAttendance = attendance.filter(a => a.lectureId === lectureId);
        const total = lectureAttendance.length;
        const present = lectureAttendance.filter(a => a.status === 'present').length;
        const percentage = total === 0 ? 0 : Math.round((present / total) * 100);
        return { total, present, percentage };
    };

    const overallStats = () => {
        const totalLectures = attendance.length;
        const totalPresent = attendance.filter(a => a.status === 'present').length;
        const percentage = totalLectures === 0 ? 0 : Math.round((totalPresent / totalLectures) * 100);
        return { percentage, totalPresent, totalLectures };
    };

    const { percentage: overallPercentage } = overallStats();

    if (lectures.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500 mt-10">
                <BarChart2 size={48} className="mx-auto mb-4 opacity-20" />
                <p>Add lectures to see statistics.</p>
            </div>
        );
    }

    return (
        <div className="p-4 pb-24 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Statistics</h1>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
                    <div className="flex items-center gap-2 mb-2 opacity-80">
                        <TrendingUp size={18} />
                        <span className="text-sm font-medium">Overall</span>
                    </div>
                    <div className="text-4xl font-bold">{overallPercentage}%</div>
                    <div className="text-sm opacity-80 mt-1">Attendance Rate</div>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none">
                    <div className="flex items-center gap-2 mb-2 opacity-80">
                        <Award size={18} />
                        <span className="text-sm font-medium">Streak</span>
                    </div>
                    <div className="text-4xl font-bold">0</div>
                    <div className="text-sm opacity-80 mt-1">Days</div>
                </Card>
            </div>

            <h2 className="text-xl font-bold mb-4">By Lecture</h2>
            <div className="space-y-4">
                {lectures.map((lecture) => {
                    const { percentage, present, total } = calculateStats(lecture.id);
                    const target = lecture.targetPercentage || 75;
                    const isLow = percentage < target;

                    return (
                        <Card key={lecture.id}>
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <h3 className="font-bold">{lecture.name}</h3>
                                    <p className="text-sm text-gray-500">{present}/{total} sessions</p>
                                </div>
                                <div className={`text-xl font-bold ${isLow ? 'text-red-500' : 'text-green-500'}`}>
                                    {percentage}%
                                </div>
                            </div>

                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={`h-2.5 rounded-full ${isLow ? 'bg-red-500' : 'bg-green-500'}`}
                                />
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-400">Target: {target}%</span>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
