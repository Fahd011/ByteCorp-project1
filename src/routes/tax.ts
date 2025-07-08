import express from 'express';
import pool from '../db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tax ORDER BY min_salary ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tax slabs:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;