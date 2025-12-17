# SimpleShop - backend

## Setup
- `npm install`
- `npx prisma generate`
- `npx prisma db push`
- `node index.js` (or `npm run dev` with nodemon)

## Routes
- POST /api/auth/register { email, password }
- POST /api/auth/login { email, password } -> returns { token }
- GET /api/products
- POST /api/products (Authorization: Bearer <token>)
- POST /api/seed
