import { useState } from 'react';
import LectureList from '../components/LectureList';
import LectureForm from '../components/LectureForm';
import { Plus, Upload } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { getThemeClasses } from '../utils/themeUtils';
import { clsx } from 'clsx';
import OCRUploader from '../components/OCRUploader';

export default function Lectures() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isOCROpen, setIsOCROpen] = useState(false);
    const themeColor = useStore((state) => state.themeColor);
    const theme = getThemeClasses(themeColor);

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Lectures</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsOCROpen(true)}
                        className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 p-3 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        title="Import Timetable"
                    >
                        <Upload size={24} />
                    </button>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className={clsx(
                            "text-white p-3 rounded-full shadow-lg transition-colors",
                            theme.primary,
                            theme.primaryHover
                        )}
                    >
                        <Plus size={24} />
                    </button>
                </div>
            </div>

            <LectureList />

            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <LectureForm onClose={() => setIsFormOpen(false)} />
                    </div>
                )}
                {isOCROpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <OCRUploader onClose={() => setIsOCROpen(false)} />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
