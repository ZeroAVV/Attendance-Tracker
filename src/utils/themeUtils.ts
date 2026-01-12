

export type ThemeColor = 'blue' | 'purple' | 'green' | 'red' | 'orange';

export const themeConfig = {
    blue: {
        primary: 'bg-blue-600',
        primaryHover: 'hover:bg-blue-700',
        text: 'text-blue-600',
        textDark: 'dark:text-blue-400',
        ring: 'ring-blue-500',
        border: 'border-blue-200',
        bgLight: 'bg-blue-50',
        bgDark: 'dark:bg-blue-900/20',
    },
    purple: {
        primary: 'bg-purple-600',
        primaryHover: 'hover:bg-purple-700',
        text: 'text-purple-600',
        textDark: 'dark:text-purple-400',
        ring: 'ring-purple-500',
        border: 'border-purple-200',
        bgLight: 'bg-purple-50',
        bgDark: 'dark:bg-purple-900/20',
    },
    green: {
        primary: 'bg-green-600',
        primaryHover: 'hover:bg-green-700',
        text: 'text-green-600',
        textDark: 'dark:text-green-400',
        ring: 'ring-green-500',
        border: 'border-green-200',
        bgLight: 'bg-green-50',
        bgDark: 'dark:bg-green-900/20',
    },
    red: {
        primary: 'bg-red-600',
        primaryHover: 'hover:bg-red-700',
        text: 'text-red-600',
        textDark: 'dark:text-red-400',
        ring: 'ring-red-500',
        border: 'border-red-200',
        bgLight: 'bg-red-50',
        bgDark: 'dark:bg-red-900/20',
    },
    orange: {
        primary: 'bg-orange-600',
        primaryHover: 'hover:bg-orange-700',
        text: 'text-orange-600',
        textDark: 'dark:text-orange-400',
        ring: 'ring-orange-500',
        border: 'border-orange-200',
        bgLight: 'bg-orange-50',
        bgDark: 'dark:bg-orange-900/20',
    },
};

export function getThemeClasses(color: ThemeColor) {
    return themeConfig[color];
}
