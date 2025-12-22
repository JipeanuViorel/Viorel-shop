import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Cart from '../components/Cart';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartVisible, setCartVisible] = useState(true); // Default to visible
  const [reviews, setReviews] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, avgRating: 0, totalReviews: 0 });

  // Fetch initial data
  useEffect(() => {
    loadProducts();
    loadReviews();
    loadStats();

    // Load local cart
    const savedCart = localStorage.getItem('viorel_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart');
      }
    }
  }, []);

  // Save cart on change
  useEffect(() => {
    localStorage.setItem('viorel_cart', JSON.stringify(cart));
  }, [cart]);

  const loadProducts = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/products`)
      .then(r => r.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]));
  };

  const loadReviews = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/reviews`)
      .then(r => r.json())
      .then(allReviews => {
        const reviewsByProduct = {};
        allReviews.forEach(review => {
          if (!reviewsByProduct[review.productId]) {
            reviewsByProduct[review.productId] = [];
          }
          reviewsByProduct[review.productId].push(review);
        });
        setReviews(reviewsByProduct);
      })
      .catch(console.error);
  };

  const loadStats = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/analytics`)
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(console.error);
  };

  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
      showNotification(`${product.name} - cantitate mărită!`);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      showNotification(`${product.name} adăugat în coș!`);
    }
    setCartVisible(true);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) return removeFromCart(productId);
    setCart(cart.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const submitReview = async (productId, { userName, rating, comment }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userName, rating, comment })
      });

      if (response.ok) {
        const addedReview = await response.json();
        setReviews(prev => ({
          ...prev,
          [productId]: [...(prev[productId] || []), addedReview]
        }));
        showNotification('Recenzia a fost adăugată!');
      } else {
        showNotification('Eroare la server!', 'error');
      }
    } catch (error) {
      showNotification('Eroare conexiune!', 'error');
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Head>
        <title>ViorelShop - Magazin IT</title>
      </Head>

      {/* Notifications */}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2">
        {notifications.map(n => (
          <div key={n.id} className={`p-4 rounded shadow-lg text-white text-sm font-semibold animate-bounce-in ${n.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
            {n.message}
          </div>
        ))}
      </div>

      <Header
        cartCount={cart.reduce((Acc, item) => Acc + item.quantity, 0)}
        total={getTotalPrice()}
        toggleCart={() => setCartVisible(!cartVisible)}
        stats={stats}
      />

      <main className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8 px-4">
          <h2 className="text-3xl font-extrabold text-gray-800">Oferta Noastră</h2>
        </div>

        <div className="flex flex-row gap-12 items-start px-4 overflow-x-auto pb-4">

          {/* Main Content Area - Expands to fill space */}
          <div className="flex-1 min-w-[800px]"> {/* Min width ensures columns don't squish too much */}

            <div className="grid grid-cols-2 gap-6">
              {/* Products Column */}
              <section>
                <div className="flex items-center gap-3 mb-4 px-2">
                  <span className="text-3xl">💻</span>
                  <h3 className="text-2xl font-bold text-gray-800">Produse IT</h3>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border-2 border-black min-h-[500px]">
                  <div className="space-y-6">
                    {products.filter(p => p.category === 'produse').map(p => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        addToCart={addToCart}
                        reviews={reviews[p.id] || []}
                        onSubmitReview={submitReview}
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* Services Column */}
              <section>
                <div className="flex items-center gap-3 mb-4 px-2">
                  <span className="text-3xl">🔧</span>
                  <h3 className="text-2xl font-bold text-gray-800">Servicii Tehnice</h3>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border-2 border-black min-h-[500px]">
                  <div className="space-y-6">
                    {products.filter(p => p.category === 'servicii').map(p => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        addToCart={addToCart}
                        reviews={reviews[p.id] || []}
                        onSubmitReview={submitReview}
                      />
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Cart Sidebar - NOW ALIGNED WITH COLUMNS */}
          {cartVisible && (
            <div className="w-96 shrink-0 animation-fade-in sticky top-4">
              <Cart
                cart={cart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                total={getTotalPrice()}
              />
            </div>
          )}

        </div>
      </main>
    </div>
  );
}