import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Pool } from '@neondatabase/serverless'; // Neon-specific driver <button class="citation-flag" data-index="8">
import pool from '../db';

interface User {
  id: number;
  email: string;
  password: string;
  profile_image?: string;
  profile_name?: string;
}

const router = express.Router();

// Signup <button class="citation-flag" data-index="3"><button class="citation-flag" data-index="6"><button class="citation-flag" data-index="8">
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Hash password using bcrypt <button class="citation-flag" data-index="1"><button class="citation-flag" data-index="3">
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Store user in Neon PostgreSQL <button class="citation-flag" data-index="2"><button class="citation-flag" data-index="9"><button class="citation-flag" data-index="10">
    const newUser = await pool.query<User>(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );
    
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Login <button class="citation-flag" data-index="4"><button class="citation-flag" data-index="5"><button class="citation-flag" data-index="10">
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Verify user exists in Neon <button class="citation-flag" data-index="2"><button class="citation-flag" data-index="8">
    const userResult = await pool.query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (!userResult.rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = userResult.rows[0];
    
    // Compare passwords with bcrypt <button class="citation-flag" data-index="3"><button class="citation-flag" data-index="7">
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    // Generate JWT <button class="citation-flag" data-index="5"><button class="citation-flag" data-index="6">
    const token = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' } // Optional: Add expiration <button class="citation-flag" data-index="4">
    );
    
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;