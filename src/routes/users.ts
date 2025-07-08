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


router.put('/:id/benefits', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);
  const { benefits } = req.body; // { medical: 3000, sports: 1500, ... }

  if (!benefits || typeof benefits !== 'object') {
    return res.status(400).json({ error: 'Invalid benefits format' });
  }

  try {

    await pool.query('BEGIN');

    const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (user.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: 'User not found' });
    }

    for (const [benefitName, amount] of Object.entries(benefits)) {
      const typeRes = await pool.query(
        'SELECT id FROM benefit_types WHERE name = $1',
        [benefitName]
      );

      if (typeRes.rows.length === 0) {
        await pool.query('ROLLBACK');
        return res.status(400).json({ error: `Invalid benefit type: ${benefitName}` });
      }

      const benefitTypeId = typeRes.rows[0].id;

      const existing = await pool.query(
        'SELECT * FROM user_benefits WHERE user_id = $1 AND benefit_type_id = $2',
        [userId, benefitTypeId]
      );

      if (existing.rows.length > 0) {
        await pool.query(
          'UPDATE user_benefits SET amount = $1 WHERE user_id = $2 AND benefit_type_id = $3',
          [amount, userId, benefitTypeId]
        );
      } else {
        await pool.query(
          'INSERT INTO user_benefits (user_id, benefit_type_id, amount) VALUES ($1, $2, $3)',
          [userId, benefitTypeId, amount]
        );
      }
    }

    await pool.query('COMMIT');
    res.status(200).json({ message: 'User benefits updated successfully' });

  } catch (error) {
    console.error('Error updating benefits:', error);
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'Server error' });
  }
});



export default router;