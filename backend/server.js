const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = 'viorel_secret_2024';

const seedProducts = [
  { name: 'Monitor LED 24"', price: 450, description: 'Monitor LED Full HD 1920x1080, 24 inch', category: 'produse', type: 'monitor' },
  { name: 'Monitor Gaming 27"', price: 750, description: 'Monitor Gaming 144Hz, 27 inch, 1ms', category: 'produse', type: 'monitor' },
  { name: 'Tastatura Mecanica RGB', price: 280, description: 'Tastatura mecanica cu iluminare RGB', category: 'produse', type: 'tastatura' },
  { name: 'Tastatura Wireless', price: 150, description: 'Tastatura wireless, baterie reincarcabila', category: 'produse', type: 'tastatura' },

  { name: 'Mouse Wireless', price: 85, description: 'Mouse wireless ergonomic, baterie 12 luni', category: 'produse', type: 'mouse' },
  { name: 'Depanare PC Desktop', price: 80, description: 'Diagnosticare si reparare PC desktop', category: 'servicii', type: 'depanare-pc' },
  { name: 'Depanare PC Laptop', price: 100, description: 'Diagnosticare si reparare laptop', category: 'servicii', type: 'depanare-pc' },
  { name: 'Instalare Windows', price: 60, description: 'Instalare sistem de operare Windows', category: 'servicii', type: 'depanare-pc' },
  { name: 'Reparare Monitor LCD/LED', price: 150, description: 'Diagnosticare si reparare monitoare LCD/LED', category: 'servicii', type: 'depanare-monitor' },
  { name: 'Calibrare Monitor', price: 120, description: 'Calibrare profesionala monitor pentru design', category: 'servicii', type: 'depanare-monitor' }
];

async function seed() {
  const count = await prisma.product.count();
  if (count === 0) {
    console.log('Seeding products...');
    for (const p of seedProducts) {
      await prisma.product.create({ data: p });
    }
    console.log('Seeding complete.');
  }
}

app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'User exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hash }
    });

    res.json({ id: user.id, email: user.email });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, email: user.email });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/products', async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

app.post('/api/products', authenticateToken, async (req, res) => {
  const { name, price, description, category, type } = req.body;
  try {
    const product = await prisma.product.create({
      data: { name, price: parseFloat(price), description, category, type }
    });
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: 'Error creating product' });
  }
});

app.get('/api/reviews', async (req, res) => {
  const reviews = await prisma.review.findMany({
    include: { product: true }
  });
  res.json(reviews);
});

app.post('/api/reviews', async (req, res) => {
  const { productId, userName, rating, comment } = req.body;
  if (!productId || !userName || !rating || !comment) {
    return res.status(400).json({ error: 'All fields required' });
  }

  try {
    const newReview = await prisma.review.create({
      data: {
        productId: parseInt(productId),
        userName,
        rating: parseInt(rating),
        comment,
        date: new Date()
      }
    });
    res.json(newReview);
  } catch (e) {
    res.status(500).json({ error: 'Error creating review' });
  }
});

app.post('/api/orders', async (req, res) => {
  const {
    firstName, lastName, phone, email, address, city,
    county, deliveryMethod, paymentMethod, easyboxLocation,
    total, items
  } = req.body;

  try {
    const order = await prisma.order.create({
      data: {
        firstName, lastName, phone, email, address, city,
        county, deliveryMethod, paymentMethod, easyboxLocation,
        total: parseFloat(total),
        items: JSON.stringify(items)
      }
    });
    res.json({ success: true, orderId: order.id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error creating order' });
  }
});

app.post('/api/seed', async (req, res) => {
  try {
    await seed();
    res.json({ message: 'Seeding complete' });
  } catch (e) {
    res.status(500).json({ error: 'Seeding failed' });
  }
});

app.get('/api/analytics', async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalProducts = await prisma.product.count();
    const totalReviews = await prisma.review.count();

    const aggregations = await prisma.review.aggregate({
      _avg: {
        rating: true,
      },
    });

    const avgRating = aggregations._avg.rating ? aggregations._avg.rating.toFixed(1) : 0;

    res.json({
      totalUsers,
      totalProducts,
      totalReviews,
      avgRating,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: 'Analytics error' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'ViorelShop API Ready!'
  });
});

const server = app.listen(PORT, async () => {
  await seed();
  console.log(`ViorelShop API running on port ${PORT}`);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`Eroare: Portul ${PORT} este deja folosit. Inchide celalalt progam.`);
  } else {
    console.error(e);
  }
});
