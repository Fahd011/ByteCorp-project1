import pool from '../db/db';
import { TaxSlab } from '../types';

export const getAllTaxSlabs = async () => {
  const result = await pool.query('SELECT * FROM tax ORDER BY min_salary ASC');
  return result.rows;
};


export const updateTaxSlab = async (
    id: number,
    min_salary: number,
    max_salary: number | null,
    tax_percent: number
    
  ) => {
    const existing = await pool.query('SELECT * FROM tax WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      const error = new Error('Tax slab not found');
      (error as any).status = 404;
      throw error;
    }
  
    await pool.query(
      'UPDATE tax SET min_salary = $1, max_salary = $2, tax_percent = $3 WHERE id = $4',
      [min_salary, max_salary, tax_percent, id]
    );
  };