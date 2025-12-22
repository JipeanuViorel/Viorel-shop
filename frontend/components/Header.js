import Link from 'next/link';

export default function Header({ cartCount, total, toggleCart, stats }) {
    // Default safe stats if not loaded yet
    const { totalUsers = 0, avgRating = 0, totalReviews = 0 } = stats || {};

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="container flex justify-between items-center py-4 relative">

                {/* Logo Area */}
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, var(--primary), var(--primary-hover))', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                        🛍️ ViorelShop
                    </h1>
                    <p className="text-sm text-muted hidden sm:block">Magazin IT & Servicii Tehnice</p>
                </div>

                {/* Center Badge (Absolute centered or Flex centered) */}
                <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
                    <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-full px-6 py-2 shadow-sm text-sm font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                            <span>📊</span>
                            <span>{totalUsers} utilizatori</span>
                        </div>
                        <div className="w-px h-4 bg-gray-300"></div>
                        <div className="flex items-center gap-2">
                            <span className="text-warning">⭐</span>
                            <span>{avgRating} rating mediu</span>
                        </div>
                        <div className="w-px h-4 bg-gray-300"></div>
                        <div className="flex items-center gap-2">
                            <span>💬</span>
                            <span>{totalReviews} recenzii</span>
                        </div>
                    </div>
                </div>

                {/* Right Area: Auth & Cart */}
                <div className="flex items-center gap-4">
                    <nav className="hidden md:flex gap-4 text-sm font-medium">
                        <Link href="/login" className="hover:text-primary transition">🔐 Login</Link>
                        <Link href="/register" className="hover:text-secondary transition">📝 Register</Link>
                    </nav>

                    <button onClick={toggleCart} className="btn btn-primary rounded-full px-6 shadow-lg">
                        🛒 <span className="mx-2">{cartCount}</span> <span className="opacity-75">| {total} LEI</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
