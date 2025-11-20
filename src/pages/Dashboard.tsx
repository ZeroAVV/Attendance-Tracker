import { useStore } from '../store/useStore';
import { getTodayLectures } from '../utils/dateUtils';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Check, X, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
    const lectures = useStore((state) => state.lectures);
    const attendance = useStore((state) => state.attendance);
    const markAttendance = useStore((state) => state.markAttendance);

    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const todayLectures = getTodayLectures(lectures);

    const getAttendanceStatus = (lectureId: string) => {
        return attendance.find(a => a.lectureId === lectureId && a.date === todayStr);
    };

    const handleMark = async (lectureId: string, status: 'present' | 'absent') => {
        await markAttendance({
            lectureId,
            date: todayStr,
            status,
        });
    };

    return (
        <div className="p-4 pb-24 max-w-2xl mx-auto">
            <header className="mb-6">
                <h1 className="text-3xl font-bold">Today</h1>
                <p className="text-gray-500 dark:text-gray-400">{format(today, 'EEEE, MMMM d')}</p>
            </header>

            {todayLectures.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500">No lectures scheduled for today.</p>
                    <p className="text-sm text-gray-400 mt-1">Enjoy your free time! 🎉</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {todayLectures.map(lecture => {
                        const status = getAttendanceStatus(lecture.id);

                        return (
                            <Card key={lecture.id} className={`border-l-4 ${status?.status === 'present' ? 'border-l-green-500' : status?.status === 'absent' ? 'border-l-red-500' : 'border-l-blue-500'}`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-xl font-bold">{lecture.name}</h3>
                                        <p className="text-sm text-gray-500 font-medium">{lecture.courseCode}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                                            <Clock size={14} />
                                            {lecture.schedule.startTime}
                                        </div>
                                        {lecture.schedule.location && (
                                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1 justify-end">
                                                <MapPin size={12} />
                                                {lecture.schedule.location}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {status ? (
                                    <div className={`p-3 rounded-xl flex items-center justify-center gap-2 font-bold ${status.status === 'present'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        {status.status === 'present' ? <Check size={20} /> : <X size={20} />}
                                        {status.status === 'present' ? 'Present' : 'Absent'}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <Button
                                            variant="secondary"
                                            className="!bg-red-50 !text-red-600 hover:!bg-red-100 dark:!bg-red-900/20 dark:!text-red-400"
                                            onClick={() => handleMark(lecture.id, 'absent')}
                                        >
                                            Absent
                                        </Button>
                                        <Button
                                            variant="primary"
                                            className="!bg-green-600 hover:!bg-green-700"
                                            onClick={() => handleMark(lecture.id, 'present')}
                                        >
                                            Present
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
