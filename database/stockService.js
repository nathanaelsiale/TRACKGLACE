import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('trackglace.db');

export const addStockHistory = async (quantite, type, date) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO stock_history (quantite, type, date) VALUES (?, ?, ?)',
      quantite,
      type,
      date
    );
    console.log('Stock history added successfully');
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding stock history:', error);
    throw error;
  }
};

export const getStockHistory = async () => {
  try {
    const allRows = await db.getAllAsync('SELECT * FROM stock_history ORDER BY date DESC');
    return allRows.map(row => ({
      id: row.id.toString(),
      quantite: row.quantite,
      type: row.type,
      date: row.date
    }));
  } catch (error) {
    console.error('Error getting stock history:', error);
    return [];
  }
};

export const getTotalStockAdded = async () => {
  try {
    const result = await db.getFirstAsync(
      "SELECT SUM(quantite) as total FROM stock_history WHERE type = 'ADD'"
    );
    return result && result.total ? result.total : 0;
  } catch (error) {
    console.error('Error getting total stock added:', error);
    return 0;
  }
};

export const getTotalStockRemoved = async () => {
  try {
    const result = await db.getFirstAsync(
      "SELECT SUM(quantite) as total FROM stock_history WHERE type = 'REMOVE'"
    );
    return result && result.total ? result.total : 0;
  } catch (error) {
    console.error('Error getting total stock removed:', error);
    return 0;
  }
};

export const clearStockHistory = async () => {
  try {
    await db.runAsync('DELETE FROM stock_history');
    console.log('Stock history cleared successfully');
  } catch (error) {
    console.error('Error clearing stock history:', error);
    throw error;
  }
};