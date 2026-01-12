import Tesseract from 'tesseract.js';
import type { Lecture } from '../db/db';

export async function processImage(file: File): Promise<string> {
    const worker = await Tesseract.createWorker('eng');
    const ret = await worker.recognize(file);
    await worker.terminate();
    return ret.data.text;
}

export function parseTimetable(text: string): Omit<Lecture, 'id' | 'userId'>[] {
    console.log("=== OCR RAW TEXT ===");
    console.log(text);
    console.log("===================");

    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const lectures: Omit<Lecture, 'id' | 'userId'>[] = [];

    const dayMap: Record<string, string> = {
        'monday': 'Mon',
        'tuesday': 'Tue',
        'wednesday': 'Wed',
        'thursday': 'Thu',
        'friday': 'Fri',
        'saturday': 'Sat',
        'sunday': 'Sun'
    };

    const timeSlotRegex = /(\d{1,2})\s+TO\s+(\d{1,2})/gi;
    const subjectRegex = /\b([A-Z]{2,4}(?:-[A-Z0-9]+)*)\b/g;
    const roomRegex = /\b(\d{3})\b/g;

    let timeSlots: { start: string; end: string }[] = [];

    // Extract time slots from header
    for (const line of lines) {
        const matches = [...line.matchAll(timeSlotRegex)];
        if (matches.length >= 3) {
            timeSlots = matches.map(m => ({
                start: `${parseInt(m[1]).toString().padStart(2, '0')}:00`,
                end: `${parseInt(m[2]).toString().padStart(2, '0')}:00`
            }));
            console.log("Found time slots:", timeSlots);
        }
    }

    // Parse each day's schedule
    for (let i = 0; i < lines.length; i++) {
        const lowerLine = lines[i].toLowerCase();

        for (const [dayFull, dayShort] of Object.entries(dayMap)) {
            if (lowerLine.includes(dayFull)) {
                const dayText = lines.slice(i, Math.min(i + 5, lines.length)).join(' ');
                const subjects = [...new Set(
                    Array.from(dayText.matchAll(subjectRegex))
                        .map(m => m[1])
                        .filter(s =>
                            s.length >= 2 &&
                            s !== 'TO' &&
                            !s.match(/^(BREAK|DIV|VJR|VRD|NDG|JK|DB|STB|PW|SDT|EM|SM|FLOOR|ROOM)$/i)
                        )
                )];

                const rooms = [...dayText.matchAll(roomRegex)].map(m => m[1]);

                subjects.forEach((subject, idx) => {
                    const slot = timeSlots[idx] || { start: '09:00', end: '10:00' };
                    lectures.push({
                        name: subject,
                        courseCode: subject,
                        professor: '',
                        schedules: [{
                            days: [dayShort],
                            startTime: slot.start,
                            endTime: slot.end,
                            location: rooms[idx] || rooms[0] || ''
                        }],
                        targetPercentage: 75
                    });
                });

                break;
            }
        }
    }

    // Fallback: Extract all subject-like codes
    if (lectures.length === 0) {
        const allText = lines.join(' ');
        const blacklist = /^(BREAK|DIV|ROOM|FLOOR|TIME|TABLE|SEMESTER|UNIVERSE)$/i;

        const allSubjects = [...new Set(
            Array.from(allText.matchAll(subjectRegex))
                .map(m => m[1])
                .filter(s => {
                    if (s.length < 2 || s.length > 20) return false;
                    if (blacklist.test(s) || s === 'TO') return false;
                    if (!/[A-Z]/.test(s)) return false;
                    const hasHyphen = s.includes('-');
                    const hasNumber = /\d/.test(s);
                    if (s.length > 4 && !hasHyphen && !hasNumber) return false;
                    return true;
                })
        )];

        const allRooms = [...allText.matchAll(roomRegex)].map(m => m[1]).filter(r => r !== '000');

        allSubjects.forEach((subject, idx) => {
            lectures.push({
                name: subject,
                courseCode: subject,
                professor: '',
                schedules: [{
                    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                    startTime: '09:00',
                    endTime: '10:00',
                    location: allRooms[idx % allRooms.length] || ''
                }],
                targetPercentage: 75
            });
        });
    }

    console.log("=== PARSED LECTURES ===");
    console.log(lectures);
    console.log("=======================");

    return lectures;
}
