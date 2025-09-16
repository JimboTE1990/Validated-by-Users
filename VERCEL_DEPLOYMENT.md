# 🚀 Vercel Deployment Guide

## Prerequisites
✅ Vercel CLI installed
✅ vercel.json configuration created
✅ Environment variables secured

## Step 1: Login to Vercel
```bash
vercel login
```
Follow the authentication flow in your browser.

## Step 2: Set Environment Variables
You'll need to add your Supabase credentials to Vercel:

### Option A: Via CLI
```bash
vercel env add VITE_SUPABASE_PROJECT_ID
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY
```

### Option B: Via Vercel Dashboard
1. Go to your project settings
2. Navigate to Environment Variables
3. Add:
   - `VITE_SUPABASE_PROJECT_ID`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`

## Step 3: Deploy
```bash
vercel --prod
```

## Step 4: Custom Domain (Optional)
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Domains
4. Add your custom domain

## Configuration Details

### vercel.json Features:
- **SPA Routing**: All routes redirect to index.html
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, Referrer-Policy
- **Vite Integration**: Optimized for Vite builds

### Build Settings:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Troubleshooting

### Common Issues:
1. **Environment Variables**: Make sure all VITE_ prefixed vars are set
2. **Build Errors**: Run `npm run build` locally first
3. **Routing Issues**: vercel.json handles SPA routing automatically

### Build Verification:
```bash
npm run build
npm run preview
```

## Post-Deployment Checklist:
- [ ] All pages load correctly
- [ ] Authentication works
- [ ] Supabase connection established
- [ ] Environment variables loaded
- [ ] Custom domain configured (if applicable)