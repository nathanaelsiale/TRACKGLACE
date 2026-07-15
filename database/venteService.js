import * as SQLite from 'expo-sqlite';
import { getDatabase } from './database';

const db = SQLite.openDatabaseSync('trackglace.db');

export const addVente = async (quantite, prix, gains, date) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO ventes (quantite, prix, gains, date) VALUES (?, ?, ?, ?)',
      quantite,
      prix,
      gains,
      date
    );
    console.log('Vente added successfully');
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding vente:', error);
    throw error;
  }
};

export const getVente = async () => {
  try {
    const allRows = await db.getAllAsync('SELECT * FROM ventes ORDER BY date DESC');
    const ventes = allRows.map(row => ({
      id: row.id.toString(),
      quantite: row.quantite.toString(),
      prix: row.prix.toString(),
      gains: row.gains.toString(),
      date: row.date
    }));
    return ventes;
  } catch (error) {
    console.error('Error getting ventes:', error);
    return [];
  }
};

export const getTotalVentes = async () => {
  try {
    const result = await db.getFirstAsync('SELECT COUNT(*) as total FROM ventes');
    return result ? result.total : 0;
  } catch (error) {
    console.error('Error getting total ventes:', error);
    return 0;
  }
};

export const getTotalGains = async () => {
  try {
    const result = await db.getFirstAsync('SELECT SUM(gains) as total FROM ventes');
    return result && result.total ? result.total : 0;
  } catch (error) {
    console.error('Error getting total gains:', error);
    return 0;
  }
};

export const deleteVente = async (id) => {
  try {
    await db.runAsync('DELETE FROM ventes WHERE id = ?', id);
    console.log('Vente deleted successfully');
  } catch (error) {
    console.error('Error deleting vente:', error);
    throw error;
  }
};

export const getVentesByDate = async (date) => {
  try {
    const allRows = await db.getAllAsync(
      'SELECT * FROM ventes WHERE date = ? ORDER BY id DESC',
      date
    );
    return allRows.map(row => ({
      id: row.id.toString(),
      quantite: row.quantite.toString(),
      prix: row.prix.toString(),
      gains: row.gains.toString(),
      date: row.date
    }));
  } catch (error) {
    console.error('Error getting ventes by date:', error);
    return [];
  }
};