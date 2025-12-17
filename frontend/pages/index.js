import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [reviews, setReviews] = useState({});
  const [showReviews, setShowReviews] = useState({});
  const [newReview, setNewReview] = useState({ productId: null, userName: '', rating: 5, comment: '' });
  const [notifications, setNotifications] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(()=> {
    fetch(process.env.NEXT_PUBLIC_API_URL + '/api/products')
      .then(r=>r.json()).then(setProducts).catch(()=>setProducts([]));
    
    // Încarcă toate recenziile
    fetch(process.env.NEXT_PUBLIC_API_URL + '/api/reviews')
      .then(r=>r.json())
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
      .catch(()=>console.log('Nu s-au putut încărca recenziile'));

    // Încarcă analytics
    loadAnalytics();
    
    // Actualizează analytics la fiecare 10 secunde
    const analyticsInterval = setInterval(loadAnalytics, 10000);
    
    return () => clearInterval(analyticsInterval);
  },[]);

  const loadAnalytics = () => {
    fetch(process.env.NEXT_PUBLIC_API_URL + '/api/analytics')
      .then(r=>r.json())
      .then(setAnalytics)
      .catch(()=>console.log('Nu s-au putut încărca analytics'));
  };

  const showNotification = (message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? {...item, quantity: item.quantity + 1}
          : item
      ));
      showNotification(`📦 ${product.name} - cantitate mărită în coș!`);
    } else {
      setCart([...cart, {...product, quantity: 1}]);
      showNotification(`🛒 ${product.name} adăugat în coș!`);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? {...item, quantity: newQuantity}
          : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getAverageRating = (productId) => {
    const productReviews = reviews[productId] || [];
    if (productReviews.length === 0) return 0;
    const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / productReviews.length).toFixed(1);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? '#ffc107' : '#e9ecef', fontSize: '16px' }}>
          ⭐
        </span>
      );
    }
    return stars;
  };

  const toggleReviews = (productId) => {
    setShowReviews(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const submitReview = async (productId) => {
    if (!newReview.userName || !newReview.comment) {
      alert('Te rog completează numele și comentariul!');
      return;
    }

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          userName: newReview.userName,
          rating: newReview.rating,
          comment: newReview.comment
        })
      });

      if (response.ok) {
        const addedReview = await response.json();
        
        // Actualizează recenziile local
        setReviews(prev => ({
          ...prev,
          [productId]: [...(prev[productId] || []), addedReview]
        }));

        // Resetează formularul
        setNewReview({ productId: null, userName: '', rating: 5, comment: '' });
        alert('Recenzia a fost adăugată cu succes!');
      }
    } catch (error) {
      alert('Eroare la adăugarea recenziei!');
    }
  };

  const ProductCard = ({ product }) => {
    const productReviews = reviews[product.id] || [];
    const avgRating = getAverageRating(product.id);
    
    return (
      <div style={{
        border:'1px solid #ddd', 
        padding:15, 
        margin:10, 
        borderRadius:'8px', 
        backgroundColor: product.category === 'produse' ? '#f8f9fa' : '#fff3cd',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h4 style={{
          color: product.category === 'produse' ? '#007bff' : '#dc3545', 
          margin:'0 0 8px 0'
        }}>
          {product.name}
        </h4>
        
        {/* Rating și recenzii */}
        <div style={{margin:'8px 0', display:'flex', alignItems:'center', gap:'10px'}}>
          <div style={{display:'flex', alignItems:'center'}}>
            {renderStars(Math.round(avgRating))}
            <span style={{marginLeft:'5px', fontSize:'14px', color:'#666'}}>
              {avgRating > 0 ? `${avgRating} (${productReviews.length} recenzii)` : 'Fără recenzii'}
            </span>
          </div>
          <button 
            onClick={() => toggleReviews(product.id)}
            style={{
              backgroundColor:'transparent',
              border:'1px solid #007bff',
              color:'#007bff',
              padding:'2px 8px',
              borderRadius:'3px',
              cursor:'pointer',
              fontSize:'12px'
            }}
          >
            {showReviews[product.id] ? 'Ascunde' : 'Vezi recenzii'}
          </button>
        </div>

        <p style={{margin:'5px 0 10px 0', color:'#666', fontSize:'14px'}}>
          {product.description}
        </p>
        
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <span style={{
              fontSize:'18px', 
              fontWeight:'bold', 
              color:'#28a745'
            }}>
              {product.price} LEI
            </span>
            <br/>
            <span style={{
              fontSize:'11px', 
              backgroundColor: product.category === 'produse' ? '#e9ecef' : '#f8d7da', 
              padding:'2px 6px', 
              borderRadius:'10px', 
              color: product.category === 'produse' ? '#495057' : '#721c24'
            }}>
              {product.category === 'produse' ? product.type.toUpperCase() : 'SERVICIU'}
            </span>
          </div>
          <button 
            onClick={() => addToCart(product)}
            style={{
              backgroundColor:'#28a745',
              color:'white',
              border:'none',
              padding:'8px 15px',
              borderRadius:'5px',
              cursor:'pointer',
              fontSize:'14px',
              fontWeight:'bold'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
          >
            🛒 Adaugă
          </button>
        </div>

        {/* Secțiunea de recenzii */}
        {showReviews[product.id] && (
          <div style={{
            marginTop:'15px',
            borderTop:'1px solid #ddd',
            paddingTop:'15px'
          }}>
            <h5 style={{margin:'0 0 10px 0', color:'#333'}}>📝 Recenzii</h5>
            
            {/* Lista recenziilor existente */}
            {productReviews.length > 0 ? (
              productReviews.map(review => (
                <div key={review.id} style={{
                  backgroundColor:'white',
                  border:'1px solid #eee',
                  padding:'10px',
                  margin:'8px 0',
                  borderRadius:'5px'
                }}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'5px'}}>
                    <strong style={{fontSize:'14px', color:'#333'}}>{review.userName}</strong>
                    <div style={{display:'flex', alignItems:'center'}}>
                      {renderStars(review.rating)}
                      <span style={{marginLeft:'5px', fontSize:'12px', color:'#666'}}>{review.date}</span>
                    </div>
                  </div>
                  <p style={{margin:'0', fontSize:'13px', color:'#555', fontStyle:'italic'}}>
                    "{review.comment}"
                  </p>
                </div>
              ))
            ) : (
              <p style={{fontSize:'13px', color:'#666', fontStyle:'italic'}}>
                Nu există recenzii încă. Fii primul care lasă o recenzie!
              </p>
            )}

            {/* Formular pentru recenzie nouă */}
            <div style={{
              backgroundColor:'#f8f9fa',
              border:'1px solid #dee2e6',
              padding:'12px',
              borderRadius:'5px',
              marginTop:'10px'
            }}>
              <h6 style={{margin:'0 0 8px 0', color:'#495057'}}>✍️ Lasă o recenzie</h6>
              
              <input 
                type="text"
                placeholder="Numele tău"
                value={newReview.productId === product.id ? newReview.userName : ''}
                onChange={(e) => setNewReview({...newReview, productId: product.id, userName: e.target.value})}
                style={{
                  width:'100%',
                  padding:'6px',
                  border:'1px solid #ccc',
                  borderRadius:'3px',
                  marginBottom:'8px',
                  fontSize:'13px'
                }}
              />
              
              <div style={{marginBottom:'8px'}}>
                <span style={{fontSize:'13px', marginRight:'8px'}}>Rating:</span>
                {[1,2,3,4,5].map(star => (
                  <span 
                    key={star}
                    onClick={() => setNewReview({...newReview, productId: product.id, rating: star})}
                    style={{
                      cursor:'pointer',
                      fontSize:'16px',
                      color: (newReview.productId === product.id && star <= newReview.rating) ? '#ffc107' : '#e9ecef'
                    }}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              
              <textarea 
                placeholder="Comentariul tău..."
                value={newReview.productId === product.id ? newReview.comment : ''}
                onChange={(e) => setNewReview({...newReview, productId: product.id, comment: e.target.value})}
                style={{
                  width:'100%',
                  padding:'6px',
                  border:'1px solid #ccc',
                  borderRadius:'3px',
                  marginBottom:'8px',
                  fontSize:'13px',
                  minHeight:'60px',
                  resize:'vertical'
                }}
              />
              
              <button 
                onClick={() => submitReview(product.id)}
                style={{
                  backgroundColor:'#007bff',
                  color:'white',
                  border:'none',
                  padding:'6px 12px',
                  borderRadius:'3px',
                  cursor:'pointer',
                  fontSize:'13px'
                }}
              >
                📤 Trimite recenzia
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Head>
        <style jsx>{`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          .pulse-animation {
            animation: pulse 0.3s ease-in-out;
          }
        `}</style>
      </Head>
      
      <div style={{padding:20, fontFamily:'Arial', backgroundColor:'#f5f5f5', minHeight:'100vh'}}>
        {/* Notificări Live */}
      <div style={{position:'fixed', top:'20px', right:'20px', zIndex:1000}}>
        {notifications.map(notification => (
          <div key={notification.id} style={{
            backgroundColor:'#28a745',
            color:'white',
            padding:'10px 15px',
            borderRadius:'8px',
            marginBottom:'10px',
            boxShadow:'0 4px 8px rgba(0,0,0,0.2)',
            animation: 'slideIn 0.3s ease-out',
            fontSize:'14px',
            maxWidth:'300px'
          }}>
            {notification.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={{
        backgroundColor:'white', 
        padding:'20px', 
        borderRadius:'10px', 
        marginBottom:'20px',
        boxShadow:'0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{margin:'0 0 5px 0', color:'#333'}}>🛍️ ViorelShop</h1>
        <p style={{fontSize:'14px', color:'#666', margin:'0 0 10px 0'}}>
          Dezvoltat de Jipeanu Viorel - Magazin IT & Servicii Tehnice
        </p>
        <div style={{
          backgroundColor:'#d1ecf1',
          border:'1px solid #bee5eb',
          padding:'8px 12px',
          borderRadius:'5px',
          fontSize:'13px',
          color:'#0c5460',
          marginBottom:'15px'
        }}>
          ℹ️ <strong>Mod Demo:</strong> Poți naviga, adăuga în coș și lăsa recenzii fără să te înregistrezi!
        </div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <span style={{
              backgroundColor:'#e9ecef',
              padding:'5px 10px',
              borderRadius:'15px',
              fontSize:'12px',
              color:'#495057',
              marginRight:'15px'
            }}>
              👤 Vizitator (Guest)
            </span>
            <Link href='/login' style={{marginRight:'15px', color:'#007bff', textDecoration:'none'}}>
              🔐 Login
            </Link>
            <Link href='/register' style={{color:'#28a745', textDecoration:'none'}}>
              📝 Register
            </Link>
          </div>
          
          {/* Analytics Dashboard */}
          {analytics && (
            <div style={{
              backgroundColor:'#f8f9fa',
              padding:'8px 15px',
              borderRadius:'20px',
              fontSize:'12px',
              color:'#495057',
              border:'1px solid #dee2e6',
              marginRight:'15px'
            }}>
              📊 <strong>{analytics.totalUsers}</strong> utilizatori | 
              ⭐ <strong>{analytics.avgRating}</strong> rating mediu | 
              💬 <strong>{analytics.totalReviews}</strong> recenzii
            </div>
          )}
          
          <button 
            onClick={() => setCartVisible(!cartVisible)}
            style={{
              backgroundColor:'#007bff',
              color:'white',
              border:'none',
              padding:'10px 20px',
              borderRadius:'25px',
              cursor:'pointer',
              fontSize:'16px',
              fontWeight:'bold'
            }}
          >
            🛒 Coș ({cart.length}) - {getTotalPrice()} LEI
          </button>
        </div>
      </div>

      {/* Layout principal cu coloane */}
      <div style={{display:'flex', gap:'20px'}}>
        
        {/* Coloana stângă - Produse și Servicii */}
        <div style={{flex:'1'}}>
          
          {/* Coloana Produse și Servicii alăturate */}
          <div style={{display:'flex', gap:'20px'}}>
            
            {/* Produse IT */}
            <div style={{flex:'1'}}>
              <h2 style={{
                color:'#28a745', 
                backgroundColor:'white',
                padding:'15px',
                borderRadius:'10px',
                margin:'0 0 10px 0',
                textAlign:'center',
                boxShadow:'0 2px 5px rgba(0,0,0,0.1)'
              }}>
                💻 PRODUSE IT
              </h2>
              {products.filter(p => p.category === 'produse').map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* Servicii Tehnice */}
            <div style={{flex:'1'}}>
              <h2 style={{
                color:'#dc3545',
                backgroundColor:'white',
                padding:'15px',
                borderRadius:'10px',
                margin:'0 0 10px 0',
                textAlign:'center',
                boxShadow:'0 2px 5px rgba(0,0,0,0.1)'
              }}>
                🔧 SERVICII TEHNICE
              </h2>
              {products.filter(p => p.category === 'servicii').map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>

        {/* Coloana dreaptă - Coș de cumpărături */}
        {cartVisible && (
          <div style={{
            width:'350px',
            backgroundColor:'white',
            padding:'20px',
            borderRadius:'10px',
            boxShadow:'0 2px 10px rgba(0,0,0,0.1)',
            height:'fit-content',
            position:'sticky',
            top:'20px'
          }}>
            <h3 style={{margin:'0 0 15px 0', color:'#333', textAlign:'center'}}>
              🛒 Coșul de Cumpărături
            </h3>
            
            {cart.length === 0 ? (
              <p style={{textAlign:'center', color:'#666', fontStyle:'italic'}}>
                Coșul este gol
              </p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} style={{
                    border:'1px solid #eee',
                    padding:'10px',
                    margin:'10px 0',
                    borderRadius:'5px',
                    backgroundColor:'#f9f9f9'
                  }}>
                    <h5 style={{margin:'0 0 5px 0', fontSize:'14px'}}>{item.name}</h5>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <span style={{fontSize:'12px', color:'#666'}}>
                        {item.price} LEI x {item.quantity}
                      </span>
                      <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{
                            backgroundColor:'#dc3545',
                            color:'white',
                            border:'none',
                            width:'25px',
                            height:'25px',
                            borderRadius:'3px',
                            cursor:'pointer',
                            fontSize:'12px'
                          }}
                        >
                          -
                        </button>
                        <span style={{minWidth:'20px', textAlign:'center', fontSize:'14px'}}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{
                            backgroundColor:'#28a745',
                            color:'white',
                            border:'none',
                            width:'25px',
                            height:'25px',
                            borderRadius:'3px',
                            cursor:'pointer',
                            fontSize:'12px'
                          }}
                        >
                          +
                        </button>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            backgroundColor:'#6c757d',
                            color:'white',
                            border:'none',
                            padding:'2px 6px',
                            borderRadius:'3px',
                            cursor:'pointer',
                            fontSize:'10px',
                            marginLeft:'5px'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div style={{textAlign:'right', marginTop:'5px'}}>
                      <strong style={{color:'#28a745'}}>
                        {item.price * item.quantity} LEI
                      </strong>
                    </div>
                  </div>
                ))}
                
                <div style={{
                  borderTop:'2px solid #007bff',
                  paddingTop:'15px',
                  marginTop:'15px',
                  textAlign:'center'
                }}>
                  <h4 style={{margin:'0 0 15px 0', color:'#333'}}>
                    Total: <span style={{color:'#28a745'}}>{getTotalPrice()} LEI</span>
                  </h4>
                  <button style={{
                    backgroundColor:'#007bff',
                    color:'white',
                    border:'none',
                    padding:'12px 25px',
                    borderRadius:'25px',
                    cursor:'pointer',
                    fontSize:'16px',
                    fontWeight:'bold',
                    width:'100%'
                  }}>
                    💳 Finalizează Comanda
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  )
}
