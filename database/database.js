import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('trackglace.db');

export const initDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ventes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quantite INTEGER NOT NULL,
        prix INTEGER NOT NULL,
        gains INTEGER NOT NULL,
        date TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS stock_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quantite INTEGER NOT NULL,
        type TEXT NOT NULL,
        date TEXT NOT NULL
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export const getDatabase = () => db;