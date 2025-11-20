import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { useStore } from '../../store/useStore';
import { getThemeClasses } from '../../utils/themeUtils';

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
    const themeColor = useStore((state) => state.themeColor);
    const theme = getThemeClasses(themeColor);

    const variants = {
        primary: `${theme.primary} text-white ${theme.primaryHover} shadow-lg shadow-blue-500/20`,
        secondary: "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30",
        ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            className={clsx(
                "rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
}
