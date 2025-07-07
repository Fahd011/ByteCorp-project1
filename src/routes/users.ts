import express from 'express';
import pool from '../db';

const router = express.Router();
// Get all users
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM users');
  res.json(result.rows);
});

export default router

