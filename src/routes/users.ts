// import express from 'express';
// import pool from '../db';

// const router = express.Router();
// // Get all users
// router.get('/', async (req, res) => {
//   const result = await pool.query('SELECT * FROM users');
//   res.json(result.rows);
// });

// export default router

import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

