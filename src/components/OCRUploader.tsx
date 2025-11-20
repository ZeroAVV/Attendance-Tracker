import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { processImage, parseTimetable } from '../utils/ocrUtils';
import { useStore } from '../store/useStore';
import type { Lecture } from '../db/db';
import { clsx } from 'clsx';

interface OCRUploaderProps {
    onClose: () => void;
}

export default function OCRUploader({ onClose }: OCRUploaderProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [parsedLectures, setParsedLectures] = useState<Omit<Lecture, 'id'>[]>([]);
    const [step, setStep] = useState<'upload' | 'review'>('upload');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const addLecture = useStore((state) => state.addLecture);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleProcess = async () => {
        if (!file) return;

        setIsProcessing(true);
        try {
            const text = await processImage(file);
            const lectures = parseTimetable(text);
            setParsedLectures(lectures);
            setStep('review');
        } catch (error) {
            console.error("OCR Error:", error);
            alert("Failed to process image. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirm = async () => {
        for (const lecture of parsedLectures) {
            await addLecture(lecture);
        }
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-xl border border-gray-100 dark:border-gray-700 relative max-h-[90vh] overflow-y-auto"
        >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-6">Import Timetable</h2>

            {step === 'upload' ? (
                <div className="space-y-6">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={clsx(
                            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
                            preview ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                        )}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        {preview ? (
                            <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-sm" />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-500">
                                <Upload size={48} className="opacity-50" />
                                <p>Tap to upload timetable image</p>
                            </div>
                        )}
                    </div>

                    <Button
                        className="w-full"
                        disabled={!file || isProcessing}
                        onClick={handleProcess}
                    >
                        {isProcessing ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin" size={20} />
                                Processing...
                            </div>
                        ) : (
                            "Process Image"
                        )}
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                        <AlertCircle size={16} />
                        <p>Found {parsedLectures.length} lectures. Please review.</p>
                    </div>

                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {parsedLectures.length === 0 ? (
                            <p className="text-center text-gray-400 py-4">No lectures found. Try a clearer image.</p>
                        ) : (
                            parsedLectures.map((lecture, idx) => (
                                <Card key={idx} className="!p-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold">{lecture.name}</h4>
                                            <p className="text-xs text-gray-500">
                                                {lecture.schedule.days.join(', ')} • {lecture.schedule.startTime} - {lecture.schedule.endTime}
                                            </p>
                                        </div>
                                        <Check size={16} className="text-green-500" />
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="secondary" onClick={() => setStep('upload')}>
                            Back
                        </Button>
                        <Button onClick={handleConfirm} disabled={parsedLectures.length === 0}>
                            Import All
                        </Button>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
