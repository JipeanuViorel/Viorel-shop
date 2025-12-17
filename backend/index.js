/**
 * ViorelShop Backend API
 * Dezvoltat de: Jipeanu Viorel
 * Aplicație E-Commerce Full-Stack Modernă
 */

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'viorel_dev_secret_2024';

app.use(cors());
app.use(express.json());

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const existing = await prisma.user.findUnique({ where: { email }});
    if (existing) return res.status(400).json({ error: 'User exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hash }});
    res.json({ id: user.id, email: user.email });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email }});
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, email: user.email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Middleware
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Products CRUD (public read)
app.get('/api/products', async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

// Create product (protected)
app.post('/api/products', auth, async (req, res) => {
  const { name, price, description } = req.body;
  const p = await prisma.product.create({ data: { name, price: Number(price), description }});
  res.json(p);
});

// Seed route (for demo) - creates sample products
app.post('/api/seed', async (req, res) => {
  await prisma.product.createMany({
    data: [
      { name: 'Mouse USB', price: 19.9, description: 'Mouse optic simplu' },
      { name: 'Tastatura mecanica', price: 89.5, description: 'Switch-uri tactile' },
      { name: 'Monitor 24"', price: 149.99, description: 'Full HD 24 inch' }
    ],
    skipDuplicates: true
  });
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log('🚀 ViorelShop Backend API running on port', PORT);
  console.log('📧 Dezvoltat de: Jipeanu Viorel');
  console.log('🛍️ E-Commerce Full-Stack Application');
});
