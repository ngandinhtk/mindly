import { Request, Response } from 'express';
import db from '../db';

export async function health(req: Request, res: Response) {
    res.json({ status: 'ok', time: new Date().toISOString() });
}       

export async function listEntries(req: Request, res: Response) {
    try {
        const entries = await db.getEntries();
        res.json(entries);
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Failed to read entries' });
    }
}

export async function createEntry(req: Request, res: Response) {
    try {
        const { date, emotion, note } = req.body;
        if (!date || !emotion) {
            return res.status(400).json({ error: 'date and emotion are required' });
        }
        const newEntry = await db.addEntry({ date, emotion, note });
        res.status(201).json(newEntry);
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Failed to create entry' });
    }
}

export default {
    health,
    listEntries,
    createEntry,
};

        