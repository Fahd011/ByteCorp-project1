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

// Fetch one user by user id
router.get('/:id', async(req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  
  try {
    const result = await pool.query('SELECT * from users WHERE id = $1', [userId])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found'});
    }
    
    return res.status(200).json(result.rows[0]);
  } catch (error){
    console.log("Error fetching user: ", error)
    return res.status(500).json({ message: 'Server Error' });
  }
})

// Helper function for user salary
const calculateNetSalary = async(userId: number) => {
  const userResult = await pool.query(
      'SELECT id, name, email, salary FROM users WHERE id = $1',
      [userId]
    );
    if (userResult.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = userResult.rows[0];
    const salary: number = parseFloat(user.salary);

    // Get tax percent from tax table
    const taxResult = await pool.query(
      `
      SELECT tax_percent
      FROM tax
      WHERE $1 BETWEEN min_salary AND max_salary
      LIMIT 1
      `,
      [salary]
    );
    
    if (taxResult.rows.length === 0) {
      throw new Error('Tax slab not found');
    }

    const taxPercent: number = parseFloat(taxResult.rows[0].tax_percent);
    const taxAmount = (salary * taxPercent) / 100;
    const netMonthly = salary - taxAmount;

    return {
      user,
      grossMonthly: salary,
      taxPercent,
      taxAmount,
      netMonthly,
      netAnnual: netMonthly * 12
    };
}
// Fetch one user monthly salary after tax deduction
router.get('/:id/monthly-salary', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const result = await calculateNetSalary(userId);
    res.json({
      user: result.user,
      gross_monthly_salary: result.grossMonthly,
      tax_percent: result.taxPercent,
      tax_amount: result.taxAmount,
      net_monthly_salary: result.netMonthly
    });
  } catch (err) {
    console.error('Error calculating net salary:', err);
    return res.status(500).json({ message: err.message });
  }
});

// Fetch one user monthly salary after tax deduction
router.get('/:id/annual-salary', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const result = await calculateNetSalary(userId);
    res.json({
      user: result.user,
      gross_annual_salary: result.grossMonthly * 12,
      tax_percent: result.taxPercent,
      tax_amount: result.taxAmount * 12,
      net_annual_salary: result.netAnnual
    });
  } catch (err) {
    console.error('Error calculating net salary:', err);
    return res.status(500).json({ message: err.message });
  }
});

// Update user salary
router.put('/:id/salary', async(req: Request, res: Response) => {
  const userId = parseInt(req.params.id)
  const { salary } = req.body;

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  if (typeof salary !== 'number' || salary < 0) {
    return res.status(400).json({ message: 'Invalid salary value' });
  }
  
  try {
    const result = await pool.query(`
      UPDATE users SET salary = $1 
      WHERE id = $2 
      RETURNING id, name, email, salary`,
      [salary, userId])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found'});
    }
    
    return res.status(200).json({message: "Salary updated Successfully", user: result.rows[0]});
  } catch (error){
    console.log("Error fetching user: ", error)
    return res.status(500).json({ message: 'Server Error' });
  }
})

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