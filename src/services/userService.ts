import pool from '../db/db';

export const getAllUsers = async () => {
  const result = await pool.query('SELECT * FROM users');
  return result.rows;
};

export const getUserById = async (userId: number) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
  return result.rows[0];
};

export const calculateNetSalary = async (userId: number) => {
  const userResult = await pool.query(
    'SELECT id, name, email, salary FROM users WHERE id = $1',
    [userId]
  );

  if (userResult.rows.length === 0) {
    throw new Error('User not found');
  }

  const user = userResult.rows[0];
  const salary: number = parseFloat(user.salary);

  const taxResult = await pool.query(
    'SELECT tax_percent FROM tax WHERE $1 BETWEEN min_salary AND max_salary LIMIT 1',
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
    netAnnual: netMonthly * 12,
  };
};

export const updateUserSalary = async (userId: number, salary: number) => {
  if (typeof salary !== 'number' || salary < 0) {
    throw new Error('Invalid salary value');
  }

  const result = await pool.query(
    `
    UPDATE users SET salary = $1
    WHERE id = $2
    RETURNING id, name, email, salary
    `,
    [salary, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return result.rows[0];
};

export const updateUserBenefits = async (userId: number, benefits: Record<string, number>) => {
  if (!benefits || typeof benefits !== 'object') {
    throw new Error('Invalid benefits format');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const user = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (user.rows.length === 0) {
      throw new Error('User not found');
    }

    for (const [benefitName, amount] of Object.entries(benefits)) {
      const typeRes = await client.query(
        'SELECT id FROM benefit_types WHERE name = $1',
        [benefitName]
      );

      if (typeRes.rows.length === 0) {
        throw new Error(`Invalid benefit type: ${benefitName}`);
      }

      const benefitTypeId = typeRes.rows[0].id;

      const existing = await client.query(
        'SELECT * FROM user_benefits WHERE user_id = $1 AND benefit_type_id = $2',
        [userId, benefitTypeId]
      );

      if (existing.rows.length > 0) {
        await client.query(
          'UPDATE user_benefits SET amount = $1 WHERE user_id = $2 AND benefit_type_id = $3',
          [amount, userId, benefitTypeId]
        );
      } else {
        await client.query(
          'INSERT INTO user_benefits (user_id, benefit_type_id, amount) VALUES ($1, $2, $3)',
          [userId, benefitTypeId, amount]
        );
      }
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};
