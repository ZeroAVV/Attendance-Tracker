import { useStore } from '../store/useStore';
import { Card } from './ui/Card';
import { Trash2, MapPin, Clock } from 'lucide-react';

export default function LectureList() {
    const lectures = useStore((state) => state.lectures);
    const deleteLecture = useStore((state) => state.deleteLecture);

    if (lectures.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                <p>No lectures added yet.</p>
                <p className="text-sm">Tap the + button to add one.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-20">
            {lectures.map((lecture) => (
                <Card key={lecture.id} className="relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-lg font-bold">{lecture.name}</h3>
                            <p className="text-sm text-gray-500 font-medium">{lecture.courseCode}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => deleteLecture(lecture.id)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mt-3">
                        <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>
                                {lecture.schedule.days.join(', ')} • {lecture.schedule.startTime} - {lecture.schedule.endTime}
                            </span>
                        </div>
                    </div>

                    {lecture.schedule.location && (
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                            <MapPin size={14} />
                            <span>{lecture.schedule.location}</span>
                        </div>
                    )}
                </Card>
            ))}
        </div>
    );
}
