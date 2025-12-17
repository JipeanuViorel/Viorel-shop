/**
 * ViorelShop Simple Backend API
 * Dezvoltat de: Jipeanu Viorel
 * Versiune simplificată pentru testare
 */

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = 'viorel_dev_secret_2024';

// In-memory storage (pentru testare)
let users = [];

// Departamentul PRODUSE
let products = [
  { id: 1, name: 'Monitor LED 24"', price: 450, description: 'Monitor LED Full HD 1920x1080, 24 inch', category: 'produse', type: 'monitor' },
  { id: 2, name: 'Monitor Gaming 27"', price: 750, description: 'Monitor Gaming 144Hz, 27 inch, 1ms', category: 'produse', type: 'monitor' },
  { id: 3, name: 'Tastatura Mecanica RGB', price: 280, description: 'Tastatura mecanica cu iluminare RGB, switch-uri tactile', category: 'produse', type: 'tastatura' },
  { id: 4, name: 'Tastatura Wireless', price: 150, description: 'Tastatura wireless, baterie reincarcabila', category: 'produse', type: 'tastatura' },
  { id: 5, name: 'Mouse Gaming RGB', price: 120, description: 'Mouse gaming cu senzor optic 3200 DPI, iluminare RGB', category: 'produse', type: 'mouse' },
  { id: 6, name: 'Mouse Wireless', price: 85, description: 'Mouse wireless ergonomic, baterie 12 luni', category: 'produse', type: 'mouse' }
];

// Departamentul SERVICII
let services = [
  { id: 7, name: 'Depanare PC Desktop', price: 80, description: 'Diagnosticare si reparare PC desktop, curatare, optimizare', category: 'servicii', type: 'depanare-pc' },
  { id: 8, name: 'Depanare PC Laptop', price: 100, description: 'Diagnosticare si reparare laptop, schimbare componente', category: 'servicii', type: 'depanare-pc' },
  { id: 9, name: 'Instalare Windows + Programe', price: 60, description: 'Instalare sistem de operare Windows + programe de baza', category: 'servicii', type: 'depanare-pc' },
  { id: 10, name: 'Reparare Monitor LCD/LED', price: 150, description: 'Diagnosticare si reparare monitoare LCD/LED, schimbare componente', category: 'servicii', type: 'depanare-monitor' },
  { id: 11, name: 'Calibrare Monitor Profesional', price: 120, description: 'Calibrare profesionala monitor pentru design grafic', category: 'servicii', type: 'depanare-monitor' }
];

// Combina produse si servicii
let allItems = [...products, ...services];

// Recenzii pentru produse si servicii - gol pentru testare
let reviews = [];

// CORS pentru deployment
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://viorelshop.vercel.app',
    'https://viorelshop-frontend.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    
    const existing = users.find(u => u.email === email);
    if (existing) return res.status(400).json({ error: 'User exists' });
    
    const hash = await bcrypt.hash(password, 10);
    const user = { id: users.length + 1, email, password: hash };
    users.push(user);
    
    console.log('✅ User registered:', email);
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
    const user = users.find(u => u.email === email);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    console.log('✅ User logged in:', email);
    res.json({ token, email: user.email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toate produsele si serviciile
app.get('/api/products', (req, res) => {
  res.json(allItems);
});

// Doar produse
app.get('/api/products/produse', (req, res) => {
  res.json(products);
});

// Doar servicii
app.get('/api/products/servicii', (req, res) => {
  res.json(services);
});

// Produse pe categorii
app.get('/api/products/monitor', (req, res) => {
  res.json(products.filter(p => p.type === 'monitor'));
});

app.get('/api/products/tastatura', (req, res) => {
  res.json(products.filter(p => p.type === 'tastatura'));
});

app.get('/api/products/mouse', (req, res) => {
  res.json(products.filter(p => p.type === 'mouse'));
});

// Recenzii pentru un produs specific
app.get('/api/reviews/:productId', (req, res) => {
  const productId = parseInt(req.params.productId);
  const productReviews = reviews.filter(r => r.productId === productId);
  res.json(productReviews);
});

// Toate recenziile
app.get('/api/reviews', (req, res) => {
  res.json(reviews);
});

// Adaugă recenzie nouă
app.post('/api/reviews', (req, res) => {
  try {
    const { productId, userName, rating, comment } = req.body;
    if (!productId || !userName || !rating || !comment) {
      return res.status(400).json({ error: 'Toate câmpurile sunt obligatorii' });
    }
    
    const newReview = {
      id: reviews.length + 1,
      productId: parseInt(productId),
      userName,
      rating: parseInt(rating),
      comment,
      date: new Date().toISOString().split('T')[0]
    };
    
    reviews.push(newReview);
    console.log('✅ Recenzie adăugată:', userName, 'pentru produsul', productId);
    res.json(newReview);
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Analytics în timp real
app.get('/api/analytics', (req, res) => {
  const totalReviews = reviews.length;
  const avgRating = reviews.length > 0 ? 
    (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;
  
  const productStats = products.map(p => ({
    id: p.id,
    name: p.name,
    reviews: reviews.filter(r => r.productId === p.id).length,
    avgRating: reviews.filter(r => r.productId === p.id).length > 0 ?
      (reviews.filter(r => r.productId === p.id).reduce((sum, r) => sum + r.rating, 0) / 
       reviews.filter(r => r.productId === p.id).length).toFixed(1) : 0
  }));

  res.json({
    totalUsers: users.length,
    totalProducts: products.length,
    totalServices: services.length,
    totalReviews,
    avgRating,
    productStats,
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    users: users.length, 
    products: products.length,
    services: services.length,
    total_items: allItems.length,
    message: 'ViorelShop API cu Produse si Servicii!' 
  });
});

app.listen(PORT, () => {
  console.log('🚀 ViorelShop Simple Backend API running on port', PORT);
  console.log('📧 Dezvoltat de: Jipeanu Viorel');
  console.log('🛍️ E-Commerce Full-Stack Application (Simple Version)');
  console.log('✅ Ready to accept connections!');
});