# Quick Fix for Vercel NOT_FOUND Error

## Immediate Actions

### 1. Update `vercel.json` ✅ (Already Done)
The file has been updated with proper API caching headers.

### 2. Verify Build Locally
```bash
cd web
npm run build
```

If build fails, fix errors before deploying.

### 3. Check Vercel Deployment Logs
1. Go to Vercel Dashboard
2. Open your project
3. Check "Deployments" tab
4. Click on the latest deployment
5. Review "Build Logs" and "Function Logs"

### 4. Verify Environment Variables
In Vercel Dashboard → Settings → Environment Variables, ensure:
- `DATABASE_URL` is set
- `BLOB_READ_WRITE_TOKEN` is set (if using file uploads)

### 5. Test Routes After Deployment
After deployment, test these routes:
- `/` (home page)
- `/consultants` (consultant list)
- `/consultants/[id]` (consultant detail - use a real ID)
- `/api/reviews` (POST request)
- `/api/reviews/[id]/approve` (PATCH request)

## Common Causes

1. **Build Failure**: Check build logs for TypeScript or build errors
2. **Missing Environment Variables**: Can cause runtime errors that look like NOT_FOUND
3. **Route Not Exported**: Ensure all `page.tsx` files have `export default`
4. **API Route Missing Handler**: Ensure all `route.ts` files export HTTP methods (GET, POST, etc.)

## Debugging Commands

```bash
# Check for TypeScript errors
cd web
npx tsc --noEmit

# Verify all routes export correctly
grep -r "export default" app --include="page.tsx" | wc -l
grep -r "export async function" app/api --include="route.ts" | wc -l

# Test production build locally
npm run build
npm start
# Then visit http://localhost:3000
```

## If Still Not Working

1. Check Vercel Function Logs for specific error messages
2. Verify the route exists in your codebase
3. Ensure the route file follows Next.js App Router conventions:
   - `page.tsx` for pages
   - `route.ts` for API endpoints
   - Proper file naming (case-sensitive)

## Route Checklist

✅ All routes properly await `params` (Next.js 16 requirement):
```tsx
const { id } = await params;
```

✅ All API routes export HTTP methods:
```tsx
export async function POST() { ... }
export async function GET() { ... }
```

✅ All page components export default:
```tsx
export default function MyPage() { ... }
```

