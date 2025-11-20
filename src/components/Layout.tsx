import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, BarChart2, Calendar, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { useStore } from '../store/useStore';
import { getThemeClasses } from '../utils/themeUtils';

export default function Layout() {
    const themeColor = useStore((state) => state.themeColor);
    const theme = getThemeClasses(themeColor);

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
            <main className="flex-1 overflow-y-auto pb-20">
                <Outlet />
            </main>

            <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 pb-safe z-50">
                <div className="flex justify-around items-center h-16">
                    <NavLink
                        to="/"
                        className={({ isActive }) => clsx(
                            "flex flex-col items-center justify-center w-full h-full transition-colors",
                            isActive ? theme.text : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        )}
                    >
                        <LayoutDashboard size={24} />
                        <span className="text-xs mt-1 font-medium">Today</span>
                    </NavLink>

                    <NavLink
                        to="/lectures"
                        className={({ isActive }) => clsx(
                            "flex flex-col items-center justify-center w-full h-full transition-colors",
                            isActive ? theme.text : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        )}
                    >
                        <BookOpen size={24} />
                        <span className="text-xs mt-1 font-medium">Lectures</span>
                    </NavLink>

                    <NavLink
                        to="/calendar"
                        className={({ isActive }) => clsx(
                            "flex flex-col items-center justify-center w-full h-full transition-colors",
                            isActive ? theme.text : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        )}
                    >
                        <Calendar size={24} />
                        <span className="text-xs mt-1 font-medium">Calendar</span>
                    </NavLink>

                    <NavLink
                        to="/stats"
                        className={({ isActive }) => clsx(
                            "flex flex-col items-center justify-center w-full h-full transition-colors",
                            isActive ? theme.text : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        )}
                    >
                        <BarChart2 size={24} />
                        <span className="text-xs mt-1 font-medium">Stats</span>
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className={({ isActive }) => clsx(
                            "flex flex-col items-center justify-center w-full h-full transition-colors",
                            isActive ? theme.text : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        )}
                    >
                        <Settings size={24} />
                        <span className="text-xs mt-1 font-medium">Settings</span>
                    </NavLink>
                </div>
            </nav>
        </div>
    );
}
