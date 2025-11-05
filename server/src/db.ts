import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', '..', 'db.json');

type Entry = {
  id: string;
  date: string; // yyyy-mm-dd
  emotion: string;
  note?: string;
  createdAt: string;
};

async function readDB(): Promise<any> {
  const raw = await fs.readFile(DB_PATH, 'utf8');
  return JSON.parse(raw || '{}');
}

async function writeDB(data: any): Promise<void> {
  const text = JSON.stringify(data, null, 2);
  await fs.writeFile(DB_PATH, text, 'utf8');
}

export async function getEntries(): Promise<Entry[]> {
  const db = await readDB();
  return db.entries || [];
}

export async function addEntry(entry: Omit<Entry, 'id' | 'createdAt'>): Promise<Entry> {
  const db = await readDB();
  const id = String(Date.now());
  const createdAt = new Date().toISOString();
  const newEntry: Entry = { id, createdAt, ...entry } as Entry;
  db.entries = db.entries || [];
  // replace existing entry for the same date (only one entry per date)
  const existingIndex = db.entries.findIndex((e: any) => e.date === newEntry.date);
  if (existingIndex >= 0) {
    db.entries[existingIndex] = newEntry;
  } else {
    db.entries.push(newEntry);
  }
  await writeDB(db);
  return newEntry;
}

export async function clearEntries(): Promise<void> {
  const db = await readDB();
  db.entries = [];
  await writeDB(db);
}

export default {
  getEntries,
  addEntry,
  clearEntries,
};
