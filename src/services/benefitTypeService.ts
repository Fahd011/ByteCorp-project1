import pool from '../db/db';

export const updateBenefitType = async (id: number, name: string) => {
  const existing = await pool.query('SELECT * FROM benefit_types WHERE id = $1', [id]);

  if (existing.rows.length === 0) {
    throw new Error('NOT_FOUND');
  }

  const duplicate = await pool.query('SELECT * FROM benefit_types WHERE name = $1', [name]);
  if (duplicate.rows.length > 0 && duplicate.rows[0].id !== id) {
    throw new Error('DUPLICATE_NAME');
  }

  await pool.query('UPDATE benefit_types SET name = $1 WHERE id = $2', [name, id]);
};