import { SignInButton, SignUpButton } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Check, Calendar, BarChart2, Palette, Upload } from 'lucide-react';

export default function Landing() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Attendance Tracker
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Track your attendance with ease. Simple, fast, and stays on your device.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="flex justify-center gap-4 mb-12">
                        <SignInButton mode="modal">
                            <Button variant="primary" size="lg">
                                Sign In
                            </Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <Button variant="secondary" size="lg">
                                Sign Up Free
                            </Button>
                        </SignUpButton>
                    </div>
                </motion.div>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="text-center hover:shadow-xl transition-shadow">
                                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                    <Check className="text-blue-600 dark:text-blue-400" size={24} />
                                </div>
                                <h3 className="text-lg font-bold mb-2">Today's Dashboard</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    See scheduled lectures and mark attendance with one tap
                                </p>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <Card className="text-center hover:shadow-xl transition-shadow">
                                <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                                    <Calendar className="text-purple-600 dark:text-purple-400" size={24} />
                                </div>
                                <h3 className="text-lg font-bold mb-2">Calendar View</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Monthly overview with attendance status dots
                                </p>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Card className="text-center hover:shadow-xl transition-shadow">
                                <div className="w-12 h-12 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                    <BarChart2 className="text-green-600 dark:text-green-400" size={24} />
                                </div>
                                <h3 className="text-lg font-bold mb-2">Statistics</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Track attendance rates per course with visual progress bars
                                </p>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Card className="text-center hover:shadow-xl transition-shadow">
                                <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                                    <Palette className="text-orange-600 dark:text-orange-400" size={24} />
                                </div>
                                <h3 className="text-lg font-bold mb-2">5 Beautiful Themes</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Customize with Blue, Purple, Green, Red, or Orange
                                </p>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Card className="text-center hover:shadow-xl transition-shadow">
                                <div className="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                    <Upload className="text-red-600 dark:text-red-400" size={24} />
                                </div>
                                <h3 className="text-lg font-bold mb-2">Smart Import</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Manual bulk entry or OCR image scanning
                                </p>
                            </Card>
                        </motion.div>
                    </div>
                </section>

                <section className="mb-12 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                        How It Works
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">1</span>
                            </div>
                            <h4 className="font-bold mb-2">Add Your Lectures</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Add lectures manually, use bulk entry for your weekly schedule, or upload a timetable image for automatic extraction
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
                                <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">2</span>
                            </div>
                            <h4 className="font-bold mb-2">Mark Daily Attendance</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Each day, see your scheduled lectures and mark present or absent with one tap
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                                <span className="text-3xl font-bold text-green-600 dark:text-green-400">3</span>
                            </div>
                            <h4 className="font-bold mb-2">Track Progress</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                View statistics showing your overall and per-course attendance rates with target percentages
                            </p>
                        </div>
                    </div>
                </section>

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl"
                >
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Stay on Top?</h2>
                    <p className="text-blue-100 mb-6 text-lg">
                        Never miss a lecture again with our simple attendance tracker
                    </p>
                    <div className="flex flex-col md:flex-row justify-center gap-4">
                        <SignInButton mode="modal">
                            <Button className="!bg-white !text-blue-600 hover:!bg-blue-50 !text-lg !py-4 !px-8">
                                Get Started Free
                            </Button>
                        </SignInButton>
                    </div>
                    <p className="text-blue-200 text-sm mt-4">
                        No credit card required • Your data stays on your device
                    </p>
                </motion.section>

                <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>Works offline with IndexedDB • Your data stays on your device</p>
                </footer>
            </div>
        </div>
    );
}
