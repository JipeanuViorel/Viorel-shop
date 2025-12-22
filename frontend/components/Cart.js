import Link from 'next/link';

export default function Cart({ cart, updateQuantity, removeFromCart, total }) {
    return (
        <div className="sticky top-4">
            <div className="flex items-center gap-2 mb-4 px-2">
                {cart.length > 0 ? <span className="text-3xl animate-bounce-in">🤩</span> : <span className="text-3xl">🛒</span>}
                <h2 className="text-2xl font-bold text-gray-800">Coșul tău</h2>
            </div>

            <div className="bg-green-100 p-4 rounded-xl border-2 border-black">
                <div className="space-y-4 max-h-[70vh] overflow-y-auto mb-4">
                    {cart.length === 0 ? (
                        <div className="text-center py-8 text-green-800">
                            <p className="text-5xl mb-4 animate-bounce-in">😔</p>
                            <p>Coșul este gol.</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex gap-3 p-3 border-2 border-black rounded bg-white/90">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-sm">{item.name}</h4>
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-6 h-6 rounded bg-green-200 hover:bg-green-300 flex items-center justify-center font-bold text-green-800"
                                        >-</button>
                                        <span className="font-mono text-sm">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-6 h-6 rounded bg-green-200 hover:bg-green-300 flex items-center justify-center font-bold text-green-800"
                                        >+</button>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between items-end">
                                    <span className="font-bold text-primary">{item.price * item.quantity} LEI</span>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-xs text-red-500 hover:text-red-700"
                                    >Elimină</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="border-t border-green-200 pt-4">
                    <div className="flex justify-between items-center mb-4 text-lg font-bold text-green-900">
                        <span>Total</span>
                        <span className="text-green-700">{total} LEI</span>
                    </div>
                    <Link href="/checkout" className={`btn btn-secondary w-full py-2 shadow-sm text-center ${cart.length === 0 ? 'pointer-events-none opacity-50' : ''}`}>
                        Finalizează Comanda
                    </Link>
                </div>
            </div>
        </div>
    );
}
