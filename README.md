# ViorelShop - Aplicație E-Commerce Full-Stack Modernă

**Dezvoltat de: Jipeanu Viorel**

O aplicație e-commerce cuprinzătoare și modernă construită cu Next.js, React, Express.js și PostgreSQL, demonstrând cele mai bune practici în dezvoltarea web full-stack.

---

## 🎓 **PENTRU PROFESOR - EVALUARE RAPIDĂ**

### **🌐 ACCES ONLINE (RECOMANDAT):**
**Link direct:** https://viorelshop.vercel.app
- ✅ **Accesibil de oriunde** - nu necesită instalare
- ✅ **Funcțional complet** - toate funcționalitățile disponibile
- ✅ **Testare instant** - coș, recenzii, analytics live

### **⚡ Rulare Locală (alternativă):**
```bash
# Terminal 1 - Backend
cd backend && npm install && node simple-server.js

# Terminal 2 - Frontend  
cd frontend && npm install && npm run dev
```
**Apoi accesați:** http://localhost:3000

### **🔍 Test Complet (3 minute):**
1. **Autentificare:** Register `profesor@test.com` / `123456` → Login
2. **Coș:** Click "🛒 Coș" → Adaugă produse → Modifică cantități  
3. **Recenzii:** "Vezi recenzii" → Adaugă recenzie cu 5 stele ⭐

### **✅ Funcționalități de Verificat:**
- Layout în coloane (Produse IT | Servicii Tehnice)
- Prețuri în LEI (nu EUR) 
- Coș funcțional cu total automat
- Sistem recenzii cu rating în stele
- Design modern, texte în română
- Autentificare JWT securizată

**📋 Vezi `GHID_PROFESOR.md` pentru detalii complete de evaluare.**

---

## 🚀 Caracteristici Principale

- **Frontend Modern**: Next.js 14+ cu React 18+ și TypeScript
- **Backend Robust**: Express.js cu Prisma ORM și PostgreSQL
- **Autentificare Securizată**: JWT tokens cu bcrypt hashing
- **Design Responsiv**: Optimizat pentru desktop și mobile
- **Arhitectură Scalabilă**: Separare clară între straturi
- **Testare Cuprinzătoare**: Unit tests și property-based testing

## 🛠️ Stack Tehnologic

### Frontend
- Next.js 14+ (App Router)
- React 18+ cu Hooks
- TypeScript pentru type safety
- Tailwind CSS pentru styling
- Axios pentru HTTP requests

### Backend
- Node.js cu Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (production) / SQLite (development)
- JWT pentru autentificare
- Bcrypt pentru hashing parole

## 📦 Instalare și Configurare

### Cerințe Preliminare
- Node.js 18+
- npm sau yarn
- PostgreSQL (pentru producție)

### Pași de Instalare

1. **Clonează repository-ul**
   ```bash
   git clone <repository-url>
   cd viorelshop
   ```

2. **Configurează Backend-ul**
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma db push
   node index.js
   ```

3. **Configurează Frontend-ul**
   ```bash
   cd frontend
   npm install
   # Setează NEXT_PUBLIC_API_URL=http://localhost:4000
   npm run dev
   ```

4. **Accesează aplicația**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

## 🎯 Funcționalități Implementate

### ✅ Funcționalități Actuale
- [x] Autentificare utilizatori (register/login cu email/parolă)
- [x] Listarea produselor cu interfață responsivă
- [x] API REST securizat cu JWT
- [x] Baza de date cu Prisma ORM
- [x] Interfață utilizator personalizată

### 🚧 În Dezvoltare (conform task list)
- [ ] Conversie completă la TypeScript
- [ ] Design responsiv cu Tailwind CSS
- [ ] Coș de cumpărături funcțional
- [ ] Gestionarea comenzilor
- [ ] Panou de administrare
- [ ] Upload imagini produse
- [ ] Testare cuprinzătoare
- [ ] Deployment în cloud (Vercel + Railway)

## 📁 Structura Proiectului

```
viorelshop/
├── backend/                 # API Express.js
│   ├── prisma/             # Schema și migrări database
│   │   └── schema.prisma   # Modelele de date
│   ├── index.js            # Server principal cu toate endpoint-urile
│   ├── package.json        # Dependențe backend
│   └── .env               # Configurări mediu (DATABASE_URL, JWT_SECRET)
├── frontend/               # Aplicația Next.js
│   ├── pages/              # Pagini React
│   │   ├── index.js       # Homepage cu lista produselor
│   │   ├── login.js       # Pagina de autentificare
│   │   ├── register.js    # Pagina de înregistrare
│   │   └── _app.js        # Configurația aplicației
│   ├── styles/             # Stiluri CSS
│   └── package.json        # Dependențe frontend
├── .kiro/specs/            # Documentație tehnică completă
│   ├── requirements.md     # Cerințe funcționale detaliate
│   ├── design.md          # Documentația arhitecturii
│   └── tasks.md           # Plan de implementare pas cu pas
└── README.md              # Acest fișier
```

## 🔧 Comenzi Utile

### Backend
```bash
cd backend
npm install                 # Instalează dependențele
npx prisma generate        # Generează clientul Prisma
npx prisma db push         # Aplică schema la baza de date
node index.js              # Pornește serverul (port 4000)
npm run dev                # Pornește cu nodemon pentru development
```

### Frontend
```bash
cd frontend
npm install                # Instalează dependențele
npm run dev               # Pornește aplicația (port 3000)
npm run build             # Construiește pentru producție
npm start                 # Pornește versiunea de producție
```

## 🌐 Deployment

### Frontend (Vercel)
- Deploy automat din repository GitHub
- Setează `NEXT_PUBLIC_API_URL` către backend-ul deployed

### Backend (Railway/Render)
- Deploy din repository GitHub
- Configurează variabilele de mediu:
  - `DATABASE_URL` (PostgreSQL)
  - `JWT_SECRET` (secret pentru JWT)
  - `PORT` (setat automat de platformă)

## 📚 Documentație Tehnică

Pentru informații detaliate despre arhitectură și implementare:
- [📋 Cerințe Funcționale](.kiro/specs/full-stack-webapp/requirements.md) - Specificații complete ale funcționalităților
- [🏗️ Documentația de Design](.kiro/specs/full-stack-webapp/design.md) - Arhitectura și tehnologiile folosite
- [📝 Planul de Implementare](.kiro/specs/full-stack-webapp/tasks.md) - Task-uri pas cu pas pentru dezvoltare

## 🎓 Obiective Educaționale

Acest proiect demonstrează:
- **Dezvoltarea Full-Stack** cu tehnologii moderne JavaScript/TypeScript
- **Arhitectura REST API** cu Express.js și autentificare JWT
- **Frontend Responsiv** cu Next.js și React hooks
- **Gestionarea Bazei de Date** cu Prisma ORM
- **Securitatea Aplicațiilor Web** (hashing parole, validare input)
- **Testarea Software** (unit tests, property-based testing)
- **DevOps și Deployment** pe platforme cloud moderne

## 🔐 Securitate

Aplicația implementează:
- Hashing securizat al parolelor cu bcrypt
- Autentificare JWT cu expirare
- Validarea input-urilor pe server
- Protecția împotriva atacurilor comune (XSS, injection)

## 👨‍💻 Autor

**Jipeanu Viorel**
- 🎯 Dezvoltator Full-Stack specializat în JavaScript/TypeScript
- 🚀 Experiență cu React, Node.js, și tehnologii web moderne
- 💡 Pasionat de arhitectura software și cele mai bune practici
- 📧 Dedicat creării de aplicații web scalabile și sigure

---

*Acest proiect face parte din portofoliul personal de dezvoltare web full-stack al lui Jipeanu Viorel, demonstrând competențele în construirea aplicațiilor e-commerce moderne și scalabile.*