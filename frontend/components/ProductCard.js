import { useState } from 'react';

export default function ProductCard({ product, reviews = [], addToCart, onSubmitReview }) {
    const [showReviews, setShowReviews] = useState(false);
    const [newReview, setNewReview] = useState({ userName: '', rating: 5, comment: '' });

    const isService = product.category === 'servicii';
    const bgColor = isService ? 'bg-red-50' : 'bg-blue-50'; // Warmer/Cooler backgrounds
    const borderColor = 'border-black'; // User requested black border for all
    const titleColor = isService ? 'text-red-600' : 'text-blue-600';

    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, i) => (
            <span key={i} style={{ color: i < rating ? '#f59e0b' : '#cbd5e1', fontSize: '1.2rem' }}>★</span>
        ));
    };

    const handleReviewSubmit = () => {
        if (!newReview.userName || !newReview.comment) {
            alert('Te rog completează toate câmpurile!');
            return;
        }
        onSubmitReview(product.id, newReview);
        setNewReview({ userName: '', rating: 5, comment: '' });
    };

    return (
        <div className={`card ${bgColor} ${borderColor} border-2`}>
            <div className="flex justify-between items-start mb-2">
                <h3 className={`text-xl font-bold ${titleColor}`}>{product.name}</h3>
                <span className="text-lg font-bold text-gray-800 bg-white/50 px-2 rounded">
                    {product.price} LEI
                </span>
            </div>

            <p className="text-gray-600 mb-4 text-sm min-h-[40px]">{product.description}</p>

            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(Math.round(avgRating))}</div>
                    <button
                        onClick={() => setShowReviews(!showReviews)}
                        className={`text-sm underline ${titleColor}`}
                    >
                        {avgRating > 0 ? `${avgRating} (${reviews.length})` : 'Fără recenzii'}
                    </button>
                </div>
            </div>

            <button onClick={() => addToCart(product)} className={`btn w-full ${isService ? 'btn-danger' : 'btn-primary'}`}>
                Adaugă în Coș
            </button>

            {showReviews && (
                <div className="mt-4 pt-4 border-t border-gray-200/50 animate-fade-in bg-white/50 p-2 rounded">
                    <h4 className="font-bold mb-3 text-sm">Recenzii</h4>
                    <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
                        {reviews.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">Nu există recenzii.</p>
                        ) : (
                            reviews.map((r, idx) => (
                                <div key={idx} className="bg-white p-2 rounded border border-gray-100 text-sm">
                                    <div className="flex justify-between font-semibold">
                                        <span>{r.userName}</span>
                                        <span className="text-warning">★ {r.rating}</span>
                                    </div>
                                    <p className="text-gray-600 mt-1">{r.comment}</p>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="border rounded p-3 bg-white">
                        <input
                            className="input text-sm"
                            placeholder="Numele tău"
                            value={newReview.userName}
                            onChange={e => setNewReview({ ...newReview, userName: e.target.value })}
                        />
                        <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => setNewReview({ ...newReview, rating: star })}
                                    className="bg-transparent border-0 p-0 text-lg focus:outline-none"
                                    style={{ color: star <= newReview.rating ? '#f59e0b' : '#cbd5e1' }}
                                >★</button>
                            ))}
                        </div>
                        <textarea
                            className="input text-sm"
                            placeholder="Mesaj..."
                            rows="2"
                            value={newReview.comment}
                            onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                        />
                        <button onClick={handleReviewSubmit} className="btn btn-secondary text-sm w-full">
                            Trimite Recenzia
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
