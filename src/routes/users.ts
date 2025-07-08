import express, { Request, Response } from 'express';
import pool from '../db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.put('/:id/benefits', async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { medical, sports } = req.body;

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {

    const userExists = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const benefitsExists = await pool.query('SELECT * FROM benefits WHERE user_id = $1', [userId]);

    if (benefitsExists.rows.length > 0) {
      await pool.query(
        'UPDATE benefits SET medical = $1, sports = $2 WHERE user_id = $3',
        [medical, sports, userId]
      );
    } else {
      await pool.query(
        'INSERT INTO benefits (user_id, medical, sports) VALUES ($1, $2, $3)',
        [userId, medical, sports]
      );
    }

    res.status(200).json({ message: 'Benefits updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;