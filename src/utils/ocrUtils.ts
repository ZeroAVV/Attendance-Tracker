import Tesseract from 'tesseract.js';
import type { Lecture } from '../db/db';

export async function processImage(file: File): Promise<string> {
    const worker = await Tesseract.createWorker('eng');
    const ret = await worker.recognize(file);
    await worker.terminate();
    return ret.data.text;
}

export function parseTimetable(text: string): Omit<Lecture, 'id'>[] {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const lectures: Omit<Lecture, 'id'>[] = [];

    // Basic Heuristic Parsing
    // Look for patterns like: "10:00 - 11:00 Math" or "Mon 10:00 Math"
    // This is a simplified parser and would need to be robust in a real app

    const timeRegex = /(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/;
    const dayRegex = /(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/i;

    lines.forEach(line => {
        const timeMatch = line.match(timeRegex);
        const dayMatch = line.match(dayRegex);

        if (timeMatch) {
            const startTime = timeMatch[1];
            const endTime = timeMatch[2];

            // Assume the rest of the line is the subject name
            let name = line.replace(timeRegex, '').trim();

            // If day is present, extract it
            let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']; // Default to weekdays if not found
            if (dayMatch) {
                const day = dayMatch[0];
                // Normalize day string
                const normalizedDay = day.charAt(0).toUpperCase() + day.slice(1, 3).toLowerCase();
                days = [normalizedDay];
                name = name.replace(dayRegex, '').trim();
            }

            // Clean up name
            name = name.replace(/[^a-zA-Z0-9\s]/g, '').trim();

            if (name.length > 2) {
                lectures.push({
                    name: name,
                    courseCode: '', // Hard to guess
                    professor: '',
                    schedule: {
                        days,
                        startTime,
                        endTime,
                        location: ''
                    },
                    targetPercentage: 75
                });
            }
        }
    });

    return lectures;
}
