import { useState } from 'react';
import LectureList from '../components/LectureList';
import LectureForm from '../components/LectureForm';
import { Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export default function Lectures() {
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Lectures</h1>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={24} />
                </button>
            </div>

            <LectureList />

            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <LectureForm onClose={() => setIsFormOpen(false)} />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
