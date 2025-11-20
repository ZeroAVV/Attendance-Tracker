import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Check, Palette, Trash2, Database } from 'lucide-react';
import { clsx } from 'clsx';

const colors = [
    { id: 'blue', name: 'Blue', class: 'bg-blue-500' },
    { id: 'purple', name: 'Purple', class: 'bg-purple-500' },
    { id: 'green', name: 'Green', class: 'bg-green-500' },
    { id: 'red', name: 'Red', class: 'bg-red-500' },
    { id: 'orange', name: 'Orange', class: 'bg-orange-500' },
] as const;

export default function Settings() {
    const themeColor = useStore((state) => state.themeColor);
    const setThemeColor = useStore((state) => state.setThemeColor);

    return (
        <div className="p-4 pb-24 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Palette size={20} />
                    App Theme
                </h2>
                <Card>
                    <div className="grid grid-cols-5 gap-3">
                        {colors.map((color) => (
                            <button
                                key={color.id}
                                onClick={() => setThemeColor(color.id)}
                                className={clsx(
                                    "aspect-square rounded-full flex items-center justify-center transition-transform hover:scale-110",
                                    color.class,
                                    themeColor === color.id && "ring-4 ring-offset-2 ring-gray-200 dark:ring-gray-700"
                                )}
                            >
                                {themeColor === color.id && <Check className="text-white" size={20} />}
                            </button>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-4 text-center">
                        Selected: <span className="font-medium capitalize">{themeColor}</span>
                    </p>
                </Card>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Database size={20} />
                    Data Management
                </h2>
                <Card>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-medium">Clear All Data</h3>
                                <p className="text-sm text-gray-500">Delete all lectures and attendance records.</p>
                            </div>
                            <Button variant="danger" size="sm" onClick={() => {
                                if (confirm('Are you sure? This cannot be undone.')) {
                                    // Logic to clear DB would go here
                                    alert('Feature coming soon');
                                }
                            }}>
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    </div>
                </Card>
            </section>
        </div>
    );
}
