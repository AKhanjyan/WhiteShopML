# 🔧 Render Environment Variables Setup

## ✅ Քայլ 1 - APP_URL (Frontend URL)

Render Dashboard-ում ավելացրեք հետևյալ environment variable-ը:

### 📝 Environment Variable

**Key:** `APP_URL`  
**Value:** `https://white-shop-web-dhzt.vercel.app`

### 🎯 Ինչպես ավելացնել

1. Մտեք [Render Dashboard](https://dashboard.render.com)
2. Ընտրեք ձեր **backend service**-ը (whiteshop-api)
3. Գնացեք **Environment** tab-ը
4. Կտտացրեք **Add Environment Variable** կոճակը
5. Մուտքագրեք:
   - **Key:** `APP_URL`
   - **Value:** `https://white-shop-web-dhzt.vercel.app`
6. Կտտացրեք **Save Changes**
7. Render-ը ավտոմատ կվերագործարկի service-ը

### ✅ Ստուգում

Service-ը վերագործարկվելուց հետո, ստուգեք health endpoint-ը:

```bash
curl https://your-backend-name.onrender.com/health
```

Պետք է ստանաք:
```json
{
  "status": "ok",
  "timestamp": "2025-01-XX..."
}
```

### 🔍 Ինչու է սա անհրաժեշտ

Backend-ի `server.js`-ում `APP_URL`-ը օգտագործվում է CORS configuration-ի համար:

```javascript
// Production mode-ում
const allowedOrigin = process.env.APP_URL || 'http://localhost:3000';
```

Այս արժեքը թույլ է տալիս Vercel-ի frontend-ին (https://white-shop-web-dhzt.vercel.app) կապվել Render-ի backend-ի հետ:

### 📋 Այլ անհրաժեշտ Environment Variables

Render Dashboard-ում պետք է ավելացնել նաև հետևյալ variables-ները (եթե դեռ չեք ավելացրել):

- `MONGODB_URI` - MongoDB connection string
- `REDIS_URL` - Redis connection string  
- `MEILI_HOST` - Meilisearch host
- `MEILI_MASTER_KEY` - Meilisearch master key
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRES_IN` - JWT expiration (default: 7d)
- `IDRAM_MERCHANT_ID`, `IDRAM_SECRET_KEY`, `IDRAM_PUBLIC_KEY` - Idram payment credentials
- `ARCA_MERCHANT_ID`, `ARCA_API_KEY` - ArCa payment credentials
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` - Email SMTP settings

Տես `apps/api/.env.example` ֆայլը բոլոր անհրաժեշտ variables-ների ցուցակի համար:


