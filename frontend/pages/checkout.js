import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Checkout() {
    const router = useRouter();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        county: ''
    });

    const [deliveryMethod, setDeliveryMethod] = useState('courier'); // 'courier' | 'easybox'
    const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'cash'
    const [easyboxLocation, setEasyboxLocation] = useState('');

    useEffect(() => {
        const savedCart = localStorage.getItem('viorel_cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
        setLoading(false);
    }, []);

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const deliveryCost = total > 500 ? 0 : 25; // Free shipping logic example
    const finalTotal = total + deliveryCost;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;

        const orderData = {
            ...formData,
            deliveryMethod,
            paymentMethod,
            easyboxLocation,
            total: finalTotal,
            items: cart
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                const result = await response.json();
                alert(`Comandă plasată cu succes!\nID Comandă: ${result.orderId}\nTotal: ${finalTotal} LEI`);
                localStorage.removeItem('viorel_cart');
                router.push('/');
            } else {
                alert('Eroare la plasarea comenzii. Vă rugăm să încercați din nou.');
            }
        } catch (error) {
            console.error('Order submission error:', error);
            alert('Eroare de conexiune la server.');
        }
    };

    if (loading) return <div className="p-10 text-center">Se încarcă...</div>;
    if (!loading && cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-2xl font-bold mb-4">Coșul tău este gol 😔</h1>
                <Link href="/" className="btn btn-primary">Înapoi la cumpărături</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <Head>
                <title>Finalizare Comandă - ViorelShop</title>
            </Head>

            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Finalizare Comandă</h1>

                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Left Column: Details & Options */}
                    <div className="flex-1 w-full space-y-6">

                        {/* 1. Date Personale */}
                        <div className="card bg-white p-6 shadow-sm rounded-xl">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                Date de Facturare
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required name="firstName" placeholder="Prenume" className="input" onChange={handleInputChange} />
                                <input required name="lastName" placeholder="Nume" className="input" onChange={handleInputChange} />
                                <input required name="phone" placeholder="Telefon" className="input" onChange={handleInputChange} />
                                <input required name="email" type="email" placeholder="Email" className="input" onChange={handleInputChange} />
                            </div>
                        </div>

                        {/* 2. Metoda de Livrare */}
                        <div className="card bg-white p-6 shadow-sm rounded-xl">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                Metoda de Livrare
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className={`border p-4 rounded cursor-pointer transition ${deliveryMethod === 'courier' ? 'border-primary bg-blue-50' : 'hover:border-gray-300'}`}>
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="delivery" value="courier" checked={deliveryMethod === 'courier'} onChange={(e) => setDeliveryMethod(e.target.value)} />
                                        <div>
                                            <div className="font-bold">Curier Rapid</div>
                                            <div className="text-xs text-muted">Livrare la adresă (24-48h)</div>
                                        </div>
                                    </div>
                                </label>
                                <label className={`border p-4 rounded cursor-pointer transition ${deliveryMethod === 'easybox' ? 'border-primary bg-blue-50' : 'hover:border-gray-300'}`}>
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="delivery" value="easybox" checked={deliveryMethod === 'easybox'} onChange={(e) => setDeliveryMethod(e.target.value)} />
                                        <div>
                                            <div className="font-bold">Easybox</div>
                                            <div className="text-xs text-muted">Ridicare personală</div>
                                        </div>
                                    </div>
                                </label>
                            </div>

                            <div className="mt-4">
                                {deliveryMethod === 'courier' ? (
                                    <div className="space-y-4 animate-fade-in">
                                        <input required name="address" placeholder="Adresa completă (Strada, Nr, Bloc, Ap)" className="input" onChange={handleInputChange} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input required name="city" placeholder="Oraș" className="input" onChange={handleInputChange} />
                                            <input required name="county" placeholder="Județ" className="input" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="animate-fade-in">
                                        <label className="block text-sm font-bold mb-2">Alege Locker-ul Easybox</label>
                                        <select className="input cursor-pointer" onChange={(e) => setEasyboxLocation(e.target.value)} required>
                                            <option value="">-- Selectează un Easybox --</option>
                                            <option value="1">Easybox Auchan Galati</option>
                                            <option value="2">Easybox Kaufland</option>
                                            <option value="3">Easybox Shopping City</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. Metoda de Plată */}
                        <div className="card bg-white p-6 shadow-sm rounded-xl">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                                Metoda de Plată
                            </h2>
                            <div className="space-y-3">
                                <label className={`flex items-center gap-3 border p-4 rounded cursor-pointer transition ${paymentMethod === 'card' ? 'border-primary bg-blue-50' : ''}`}>
                                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                    <span className="flex-1 font-bold">Card Online 💳</span>
                                </label>

                                {paymentMethod === 'card' && (
                                    <div className="p-4 bg-gray-50 rounded border animate-fade-in mb-2">
                                        <div className="text-sm text-muted mb-2">Simulare plată card (Nu introduce date reale)</div>
                                        <input placeholder="Număr Card" className="input mb-2" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input placeholder="MM/YY" className="input" />
                                            <input placeholder="CVC" className="input" />
                                        </div>
                                    </div>
                                )}

                                <label className={`flex items-center gap-3 border p-4 rounded cursor-pointer transition ${paymentMethod === 'cash' ? 'border-primary bg-blue-50' : ''}`}>
                                    <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                    <span className="flex-1 font-bold">Ramburs la Curier / Card la Easybox 💵</span>
                                </label>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="w-full lg:w-96 space-y-6">
                        <div className="card bg-white p-6 shadow-lg sticky top-4">
                            <h3 className="text-xl font-bold mb-4 border-b pb-2">Sumar Comandă</h3>

                            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span>{item.quantity} x {item.name}</span>
                                        <span className="font-semibold">{item.price * item.quantity} LEI</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal produse:</span>
                                    <span className="font-bold">{total} LEI</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Livrare:</span>
                                    <span className="font-bold text-green-600">{deliveryCost === 0 ? 'GRATUIT' : `${deliveryCost} LEI`}</span>
                                </div>
                            </div>

                            <div className="border-t mt-4 pt-4">
                                <div className="flex justify-between text-xl font-extrabold mb-6">
                                    <span>TOTAL</span>
                                    <span>{finalTotal} LEI</span>
                                </div>
                                <button type="submit" className="btn btn-primary w-full py-4 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                                    PLASEAZĂ COMANDA
                                </button>
                                <p className="text-xs text-center text-muted mt-3">
                                    Prin plasarea comenzii ești de acord cu termenii și condițiile.
                                </p>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}
