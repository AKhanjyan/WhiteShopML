# 🚀 Render Backend Setup - WhiteShop

## 📋 Environment Variables

Render Dashboard-ում ավելացրեք հետևյալ environment variables-ները:

### ✅ Քայլ 1 - APP_URL (Frontend URL)

```
APP_URL=https://white-shop-web-dhzt.vercel.app
```

**Ինչու է սա անհրաժեշտ:**
- Backend-ը օգտագործում է `APP_URL`-ը CORS configuration-ի համար
- Սա թույլ է տալիս frontend-ին (Vercel-ում) կապվել backend-ի հետ

### 📝 Մնացած Environment Variables

Render Dashboard-ում ավելացրեք նաև հետևյալ variables-ները:

#### Database
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

#### Redis
```
REDIS_URL=redis://username:password@host:port
```

#### Meilisearch
```
MEILI_HOST=https://your-meilisearch-instance.com
MEILI_MASTER_KEY=your-master-key
```

#### JWT
```
JWT_SECRET=your-secret-key-min-32-characters-long
JWT_EXPIRES_IN=7d
```

#### Payments (Idram)
```
IDRAM_MERCHANT_ID=your-merchant-id
IDRAM_SECRET_KEY=your-secret-key
IDRAM_PUBLIC_KEY=your-public-key
```

#### Payments (ArCa)
```
ARCA_MERCHANT_ID=your-merchant-id
ARCA_API_KEY=your-api-key
```

#### Email (SMTP)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@shop.am
SMTP_PASSWORD=your-password
```

## 🔧 Ինչպես ավելացնել Render Dashboard-ում

1. Մտեք [Render Dashboard](https://dashboard.render.com)
2. Ընտրեք ձեր backend service-ը
3. Գնացեք **Environment** tab
4. Կտտացրեք **Add Environment Variable**
5. Ավելացրեք `APP_URL` key-ը և `https://white-shop-web-dhzt.vercel.app` value-ը
6. Կտտացրեք **Save Changes**
7. Service-ը կվերագործարկվի ավտոմատ

## ✅ Ստուգում

Service-ը վերագործարկվելուց հետո, ստուգեք:

```bash
curl https://your-backend.onrender.com/health
```

Պետք է ստանաք:
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

## 🔗 Կապակցված Documentation

- `SETUP.md` - Լոկալ setup
- `SERVER-SETUP.md` - Production server setup
- `render.yaml` - Render configuration file


