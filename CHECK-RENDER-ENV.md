# 🔍 Render Backend Environment Checker

## Ստուգում APP_URL-ի կարգավորումը

Այս script-ը ստուգում է, արդյոք `APP_URL` environment variable-ը ճիշտ է կարգավորված Render backend-ում:

## 🚀 Օգտագործում

### Քայլ 1: Սահմանեք Render Backend URL-ը

```bash
# Windows PowerShell
$env:RENDER_BACKEND_URL="https://your-backend-name.onrender.com"
node check-render-env.js

# Windows CMD
set RENDER_BACKEND_URL=https://your-backend-name.onrender.com
node check-render-env.js

# Linux/Mac
RENDER_BACKEND_URL=https://your-backend-name.onrender.com node check-render-env.js
```

### Քայլ 2: Գործարկեք script-ը

```bash
node check-render-env.js
```

## 📊 Ինչ է ստուգում script-ը

1. **Health Check** - Ստուգում է, արդյոք backend-ը աշխատում է
2. **CORS Configuration** - Ստուգում է, արդյոք CORS-ը ճիշտ է կարգավորված
3. **API Endpoint** - Ստուգում է, արդյոք API endpoints-ները հասանելի են

## ✅ Ակնկալվող արդյունք

Եթե `APP_URL`-ը ճիշտ է կարգավորված, պետք է տեսնեք:

```
✅ Health Check: ✅ PASS
✅ CORS Config:  ✅ PASS
✅ API Access:   ✅ PASS

✅ SUCCESS: APP_URL is correctly configured in Render!
   Frontend (https://white-shop-web-dhzt.vercel.app) can connect to backend
```

## ❌ Եթե սխալ է

Եթե CORS-ը չի աշխատում, script-ը կցույց տա:

```
❌ FAILURE: APP_URL might not be set correctly

💡 To fix:
   1. Go to Render Dashboard: https://dashboard.render.com
   2. Select your backend service
   3. Go to Environment tab
   4. Add: APP_URL=https://white-shop-web-dhzt.vercel.app
   5. Save and wait for service to restart
```

## 🔧 Այլընտրանքային մեթոդ

Կարող եք նաև manually ստուգել browser-ի Developer Tools-ում:

1. Բացեք browser console
2. Գործարկեք:
```javascript
fetch('https://your-backend.onrender.com/health', {
  method: 'GET',
  headers: {
    'Origin': 'https://white-shop-web-dhzt.vercel.app'
  }
})
.then(r => {
  console.log('CORS Headers:', r.headers.get('access-control-allow-origin'));
  return r.json();
})
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

Եթե `access-control-allow-origin` header-ը հավասար է `https://white-shop-web-dhzt.vercel.app`, ապա ամեն ինչ ճիշտ է:


