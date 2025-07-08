import express, { Request, Response } from 'express';
import pool from '../db/db';

const router = express.Router();


router.put('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { name } = req.body;

  if (isNaN(id) || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Invalid id or name' });
  }

  try {
    const existing = await pool.query('SELECT * FROM benefit_types WHERE id = $1', [id]);

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Benefit type not found' });
    }

    const duplicate = await pool.query('SELECT * FROM benefit_types WHERE name = $1', [name]);
    if (duplicate.rows.length > 0 && duplicate.rows[0].id !== id) {
      return res.status(409).json({ error: 'Benefit type name already exists' });
    }

    await pool.query('UPDATE benefit_types SET name = $1 WHERE id = $2', [name, id]);

    return res.status(200).json({ message: 'Benefit type updated successfully' });
  } catch (error) {
    console.error('Error updating benefit type:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
