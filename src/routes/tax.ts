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

router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { min_salary, max_salary, percentage } = req.body;
  
    // Validation
    if (
      isNaN(id) ||
      typeof min_salary !== 'number' ||
      (max_salary !== null && typeof max_salary !== 'number') ||
      typeof percentage !== 'number'
    ) {
      return res.status(400).json({ error: 'Invalid input format' });
    }
  
    try {
      const existing = await pool.query('SELECT * FROM tax WHERE id = $1', [id]);
  
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Tax slab not found' });
      }
  
      await pool.query(
        'UPDATE tax SET min_salary = $1, max_salary = $2, tax_percent = $3 WHERE id = $4',
        [min_salary, max_salary, percentage, id]
      );
  
      res.status(200).json({ message: 'Tax slab updated successfully' });
    } catch (error) {
      console.error('Error updating tax slab:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

export default router;