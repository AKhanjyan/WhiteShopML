# ⚡ Render Quick Setup - APP_URL

## ✅ APP_URL Environment Variable

Ձեր Render backend service-ում պետք է ավելացնել հետևյալ environment variable-ը:

### 📋 Environment Variable

```
Key: APP_URL
Value: https://white-shop-web-dhzt.vercel.app
```

## 🚀 Երկու եղանակ ավելացնելու համար

### Մեթոդ 1: Render Dashboard (Manually)

1. Մտեք [Render Dashboard](https://dashboard.render.com)
2. Ընտրեք ձեր **backend service**-ը
3. Գնացեք **Environment** tab-ը
4. Կտտացրեք **Add Environment Variable**
5. Մուտքագրեք:
   - **Key:** `APP_URL`
   - **Value:** `https://white-shop-web-dhzt.vercel.app`
6. Կտտացրեք **Save Changes**
7. Service-ը ավտոմատ կվերագործարկվի

### Մեթոդ 2: Render Blueprint (render.yaml)

Եթե օգտագործում եք Render Blueprint, ապա `render.yaml` ֆայլը արդեն կարգավորված է:

1. Commit արեք `render.yaml` ֆայլը Git-ում
2. Render Dashboard-ում կապեք ձեր Git repository-ն
3. Render-ը ավտոմատ կկարդա `render.yaml`-ը և կավելացնի environment variables-ները

## ✅ Ստուգում

Service-ը վերագործարկվելուց հետո:

```bash
curl https://your-backend-name.onrender.com/health
```

Պետք է ստանաք:
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

## 🔍 Ինչու է սա անհրաժեշտ

Backend-ի `server.js`-ում `APP_URL`-ը օգտագործվում է CORS-ի համար:

```javascript
// Production mode
const allowedOrigin = process.env.APP_URL || 'http://localhost:3000';
```

Այս արժեքը թույլ է տալիս Vercel-ի frontend-ին (https://white-shop-web-dhzt.vercel.app) կապվել Render-ի backend-ի հետ:

## 📁 Ֆայլեր

- `render.yaml` - Render Blueprint configuration (արդեն կարգավորված է)
- `RENDER-ENV-SETUP.md` - Մանրամասն հրահանգներ
- `RENDER-SETUP.md` - Ընդհանուր setup հրահանգներ

