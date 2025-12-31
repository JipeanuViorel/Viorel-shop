# SimpleShop - backend

## Setup
- `npm install`
- `npx prisma generate`
- `npx prisma db push`
- `node server.js` (or `npm run dev`)

## Routes
- POST /api/auth/register { email, password }
- POST /api/auth/login { email, password } -> returns { token }
- GET /api/products
- POST /api/products (Authorization: Bearer <token>)
- POST /api/reviews { productId, userName, rating, comment }
- POST /api/orders { firstName, lastName, phone, email, address, city, county, deliveryMethod, paymentMethod, easyboxLocation, total, items }
- POST /api/seed
