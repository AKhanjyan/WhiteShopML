You will migrate the entire backend into Next.js 14 App Router API routes.

IMPORTANT:
• Do NOT recreate or preserve any Node.js server.
• Do NOT generate Express, Fastify, Nest, or any standalone backend.
• ALL backend logic must become pure Next.js API route handlers inside:  
  apps/web/app/api/**  
• No server.js, no app.listen(), no ports.

Wait for my command: “execute Section X”.

────────────────────────────────────────
SECTION 1 — MIGRATE BACKEND TO PURE NEXT.JS API ROUTES (NO NODE SERVER)
────────────────────────────────────────
Goal:
Move all backend logic from `apps/api` (Express backend) into correct Next.js API routes under `apps/web/app/api/`.

Rules:
1. DO NOT create any Node.js server.
2. DO NOT create any Express/Fastify/Nest server.
3. Each endpoint must become a Next.js file at:
   apps/web/app/api/<route>/route.ts

4. Each handler must follow this exact format:

-------------------------------------
import { NextResponse } from "next/server";
import { db } from "@white-shop/db";
import { <serviceName> } from "@/lib/services/<serviceName>.service";

export async function GET() {
  return NextResponse.json(await <serviceName>.getAll());
}

export async function POST(req: Request) {
  const data = await req.json();
  return NextResponse.json(await <serviceName>.create(data));
}
-------------------------------------

5. All business logic must move into:
   apps/web/lib/services/<entity>.service.ts

6. All database logic must use Prisma:
   import { db } from "@white-shop/db";

7. Keep the old Express backend until I say cleanup.

────────────────────────────────────────
SECTION 2 — CREATE POSTGRESQL PRISMA PACKAGE
────────────────────────────────────────
Create package: packages/db

package.json:
-------------------------------------
{
  "name": "@white-shop/db",
  "version": "1.0.0",
  "main": "index.ts",
  "types": "index.ts",
  "dependencies": {
    "@prisma/client": "^5.9.0"
  },
  "devDependencies": {
    "prisma": "^5.9.0"
  }
}

client.ts:
-------------------------------------
import { PrismaClient } from "@prisma/client";
const globalForPrisma = globalThis as any;
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ["query", "error", "warn"] });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

index.ts:
-------------------------------------
export * from "./client";

schema.prisma (PostgreSQL):
-------------------------------------
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

(model definitions…)

────────────────────────────────────────
SECTION 3 — PREPARE NEXT.JS BACKEND STRUCTURE
────────────────────────────────────────
Ensure directories exist:
- apps/web/app/api/
- apps/web/lib/services/
- packages/db/

No deletion of old backend yet.

────────────────────────────────────────
SECTION 4 — VALIDATE THE NEW NEXT.JS BACKEND
────────────────────────────────────────
Before cleanup:
1. All new Next.js API routes must function as replacements.
2. Frontend must work normally using the NEW API routes.
3. No Node server must exist anywhere in the project.
4. Prisma must connect successfully to PostgreSQL.

────────────────────────────────────────
SECTION 5 — CLEANUP (ONLY WHEN I CONFIRM)
────────────────────────────────────────
When I explicitly say “execute Section 5”:

Delete permanently:
- apps/api/ (old Node backend)
- server.js or index.js (if exists)
- ecosystem.config.js
- render.yaml
- start-mongodb.*
- setup-server*.sh
- all FIX-*.md, CHECK-*.md, SERVER-*.md, RENDER-*.md
- any file related to Node backend

Keep:
- apps/web/
- packages/
- config/
- package.json
- turbo.json
- .env
- .gitignore

────────────────────────────────────────
SECTION 6 — UPDATE ROOT SCRIPTS
────────────────────────────────────────
Root package.json:
{
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "start": "turbo run start"
  }
}

apps/web/package.json:
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}

────────────────────────────────────────
SECTION 7 — POSTGRESQL ENV & CONFIGURATION
────────────────────────────────────────
DATABASE_URL must be:
postgresql://USER:PASSWORD@HOST:5432/DBNAME?schema=public

Environment variables to set:
- DATABASE_URL (PostgreSQL connection string)
- Remove or keep MONGODB_URI (for migration period only)

Prisma configuration:
- Run: npx prisma generate (in packages/db)
- Run: npx prisma migrate dev (for initial schema)
- Run: npx prisma db push (for schema sync in development)

────────────────────────────────────────
SECTION 8 — DATA MIGRATION (MongoDB → PostgreSQL)
────────────────────────────────────────
Goal:
Migrate all existing data from MongoDB to PostgreSQL using Prisma.

Steps:
1. Create migration script: scripts/migrate-mongo-to-postgres.ts
2. Export data from MongoDB:
   - Users
   - Products
   - Categories
   - Orders
   - Cart items
   - Settings
   - Brands
   - Attributes

3. Transform data to match Prisma schema:
   - Convert MongoDB ObjectId to PostgreSQL UUID or auto-increment IDs
   - Handle nested documents (flatten or create relations)
   - Convert dates to PostgreSQL timestamps
   - Handle arrays and JSON fields

4. Import data into PostgreSQL:
   - Use Prisma client for inserts
   - Handle foreign key relationships
   - Preserve data integrity

5. Validate migration:
   - Count records in both databases
   - Spot-check critical data
   - Verify relationships

Rules:
- Keep MongoDB data until migration is validated
- Create backup before migration
- Run migration in staging first

────────────────────────────────────────
SECTION 9 — MIDDLEWARE MIGRATION
────────────────────────────────────────
Goal:
Convert Express middleware to Next.js middleware and API route handlers.

Auth Middleware:
- Move: apps/api/src/middleware/auth.js
- To: apps/web/lib/middleware/auth.ts
- Convert JWT verification to Next.js compatible format
- Use Next.js headers() and cookies() APIs

CORS:
- Remove Express CORS
- Configure in next.config.js or middleware.ts
- Handle CORS in API routes if needed

Rate Limiting:
- Use Next.js compatible rate limiting (e.g., @upstash/ratelimit)
- Or implement custom rate limiting in middleware.ts

Security Headers:
- Configure in next.config.js headers
- Use Next.js built-in security features

────────────────────────────────────────
SECTION 10 — EXTERNAL SERVICES INTEGRATION
────────────────────────────────────────
Goal:
Migrate external service connections (Meilisearch, Redis) to Next.js compatible format.

Meilisearch:
- Move: apps/api/src/lib/meilisearch.js
- To: apps/web/lib/services/search.service.ts
- Use Meilisearch client in Next.js API routes
- Keep same indexing logic

Redis:
- Move: apps/api/src/lib/redis.js
- To: apps/web/lib/services/cache.service.ts
- Use Redis client compatible with Next.js
- Handle connection pooling for serverless

Environment Variables:
- MEILISEARCH_HOST
- MEILISEARCH_API_KEY
- REDIS_URL (if using Redis)

────────────────────────────────────────
SECTION 11 — FRONTEND API CLIENT UPDATES
────────────────────────────────────────
Goal:
Update frontend API calls to use new Next.js API routes.

Changes needed:
1. Update base URL:
   - Old: process.env.NEXT_PUBLIC_API_URL (external API)
   - New: /api/v1 (relative paths, same domain)

2. Update API client:
   - File: apps/web/lib/api-client.ts
   - Remove external API URL
   - Use relative paths for all endpoints

3. Update all API calls:
   - Check all files using api-client
   - Ensure they use new endpoint structure
   - Update error handling if needed

4. Remove CORS issues:
   - No CORS needed for same-domain requests
   - Simplify authentication (cookies work directly)

────────────────────────────────────────
SECTION 12 — PRISMA SCHEMA DEFINITION
────────────────────────────────────────
Goal:
Create complete Prisma schema based on existing MongoDB models.

Models to migrate:
1. User (from apps/api/src/models/User.js)
2. Product (from apps/api/src/models/Product.js)
3. Category (from apps/api/src/models/Category.js)
4. Order (from apps/api/src/models/Order.js)
5. Cart (from apps/api/src/models/Cart.js)
6. Brand (from apps/api/src/models/Brand.js)
7. Attribute (from apps/api/src/models/Attribute.js)
8. Settings (from apps/api/src/models/Settings.js)

Schema location:
- packages/db/prisma/schema.prisma

Requirements:
- Define all fields from MongoDB models
- Set up proper relationships (one-to-many, many-to-many)
- Add indexes for performance
- Use appropriate PostgreSQL types
- Add timestamps (createdAt, updatedAt)

────────────────────────────────────────
SECTION 13 — SERVICE LAYER CREATION
────────────────────────────────────────
Goal:
Create service layer for business logic in apps/web/lib/services/

Services to create:
1. auth.service.ts (authentication, JWT)
2. user.service.ts (user CRUD)
3. product.service.ts (product CRUD, search)
4. category.service.ts (category CRUD)
5. cart.service.ts (cart operations)
6. order.service.ts (order creation, management)
7. admin.service.ts (admin operations)
8. search.service.ts (Meilisearch integration)
9. cache.service.ts (Redis integration)

Structure:
- Each service exports functions (not classes)
- Use Prisma client from @white-shop/db
- Handle errors properly
- Return consistent response format

Example structure:
-------------------------------------
import { db } from "@white-shop/db";

export const productService = {
  async getAll() {
    return await db.product.findMany();
  },
  
  async getById(id: string) {
    return await db.product.findUnique({ where: { id } });
  },
  
  async create(data: any) {
    return await db.product.create({ data });
  },
  
  // ... more methods
};
-------------------------------------

────────────────────────────────────────
SECTION 14 — API ROUTES MIGRATION DETAILS
────────────────────────────────────────
Goal:
Detailed mapping of Express routes to Next.js API routes.

Route mappings:

1. Auth Routes:
   - POST /api/v1/auth/register → apps/web/app/api/v1/auth/register/route.ts
   - POST /api/v1/auth/login → apps/web/app/api/v1/auth/login/route.ts
   - POST /api/v1/auth/logout → apps/web/app/api/v1/auth/logout/route.ts
   - GET /api/v1/auth/me → apps/web/app/api/v1/auth/me/route.ts

2. Product Routes:
   - GET /api/v1/products → apps/web/app/api/v1/products/route.ts
   - GET /api/v1/products/:id → apps/web/app/api/v1/products/[id]/route.ts
   - POST /api/v1/products → apps/web/app/api/v1/products/route.ts
   - PUT /api/v1/products/:id → apps/web/app/api/v1/products/[id]/route.ts
   - DELETE /api/v1/products/:id → apps/web/app/api/v1/products/[id]/route.ts

3. Category Routes:
   - GET /api/v1/categories → apps/web/app/api/v1/categories/route.ts
   - GET /api/v1/categories/:id → apps/web/app/api/v1/categories/[id]/route.ts
   - POST /api/v1/categories → apps/web/app/api/v1/categories/route.ts
   - (similar pattern for other routes)

4. Cart Routes:
   - GET /api/v1/cart → apps/web/app/api/v1/cart/route.ts
   - POST /api/v1/cart → apps/web/app/api/v1/cart/route.ts
   - PUT /api/v1/cart/:id → apps/web/app/api/v1/cart/[id]/route.ts
   - DELETE /api/v1/cart/:id → apps/web/app/api/v1/cart/[id]/route.ts

5. Order Routes:
   - GET /api/v1/orders → apps/web/app/api/v1/orders/route.ts
   - GET /api/v1/orders/:id → apps/web/app/api/v1/orders/[id]/route.ts
   - POST /api/v1/orders → apps/web/app/api/v1/orders/route.ts

6. User Routes:
   - GET /api/v1/users → apps/web/app/api/v1/users/route.ts
   - GET /api/v1/users/:id → apps/web/app/api/v1/users/[id]/route.ts
   - PUT /api/v1/users/:id → apps/web/app/api/v1/users/[id]/route.ts

7. Admin Routes:
   - All admin routes → apps/web/app/api/v1/admin/*/route.ts
   - Protect with admin middleware

────────────────────────────────────────
SECTION 15 — TESTING & VALIDATION
────────────────────────────────────────
Goal:
Ensure all migrated functionality works correctly.

Testing checklist:
1. API Routes:
   - Test all GET endpoints
   - Test all POST endpoints
   - Test all PUT/PATCH endpoints
   - Test all DELETE endpoints
   - Test authentication/authorization
   - Test error handling

2. Database:
   - Test Prisma connection
   - Test all CRUD operations
   - Test relationships
   - Test transactions

3. External Services:
   - Test Meilisearch integration
   - Test Redis caching (if used)

4. Frontend Integration:
   - Test all pages that use API
   - Test authentication flow
   - Test cart functionality
   - Test checkout process
   - Test admin panel

5. Performance:
   - Check API response times
   - Check database query performance
   - Optimize slow queries

────────────────────────────────────────
SECTION 16 — DEPLOYMENT CONFIGURATION
────────────────────────────────────────
Goal:
Update deployment configuration for Next.js-only architecture.

Vercel Configuration:
- vercel.json (if needed for rewrites/redirects)
- Environment variables in Vercel dashboard
- Build command: npm run build
- Output directory: .next

Environment Variables:
- DATABASE_URL (PostgreSQL)
- JWT_SECRET
- MEILISEARCH_HOST
- MEILISEARCH_API_KEY
- REDIS_URL (if used)
- NEXTAUTH_SECRET (if using NextAuth)
- APP_URL

Remove:
- Render configuration (render.yaml)
- PM2 configuration (ecosystem.config.js)
- Server startup scripts

────────────────────────────────────────
SECTION 17 — DOCUMENTATION UPDATES
────────────────────────────────────────
Goal:
Update all project documentation to reflect new architecture.

Files to update:
1. README.md:
   - Update installation instructions
   - Update development setup
   - Update deployment instructions
   - Remove MongoDB references
   - Add PostgreSQL setup

2. API Documentation:
   - Update API endpoint documentation
   - Document new Next.js API routes
   - Update authentication flow

3. Architecture Documentation:
   - Document new monorepo structure
   - Document service layer
   - Document Prisma schema

────────────────────────────────────────
RULE
────────────────────────────────────────
Do NOTHING until I explicitly say:
• "execute Section X"
• "execute Sections X–Y"
• "execute all sections"
ցդց