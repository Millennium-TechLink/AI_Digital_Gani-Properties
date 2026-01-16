# Pre-Deployment Checklist
## Complete Checklist Before Going Live

---

## 🔴 Critical (Must Complete)

### Database Setup
- [ ] Supabase account created
- [ ] Supabase project created
- [ ] Database schema created and tested
- [ ] Migration script created
- [ ] Existing properties migrated
- [ ] Database indexes created
- [ ] RLS policies configured
- [ ] Storage bucket created (property-images)
- [ ] Storage bucket set to public
- [ ] API keys saved securely

### Code Updates
- [ ] Supabase client library installed (`@supabase/supabase-js`)
- [ ] `src/lib/supabase.ts` created
- [ ] `src/lib/propertiesApi.ts` updated to use Supabase
- [ ] Dashboard API client updated
- [ ] Image upload component updated
- [ ] All API calls updated
- [ ] Serverless functions created in `api/` folder
- [ ] Authentication updated for serverless
- [ ] Error handling added everywhere

### Environment Variables
- [ ] `.env.example` created for frontend
- [ ] `.env.example` created for dashboard
- [ ] All required variables documented
- [ ] Vercel environment variables ready
- [ ] Supabase credentials ready

### Testing
- [ ] Database connection tested
- [ ] All API endpoints tested locally
- [ ] Property CRUD operations tested
- [ ] Image upload tested
- [ ] Authentication tested
- [ ] Forms tested
- [ ] No console errors
- [ ] Performance acceptable

---

## 🟡 Important (Should Complete)

### Configuration
- [ ] Build scripts verified
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] All dependencies up to date
- [ ] Package.json scripts correct

### SEO
- [ ] Site URL updated in `src/lib/seo.ts`
- [ ] Sitemap generated
- [ ] Robots.txt updated
- [ ] OG image created
- [ ] Meta tags verified

### Security
- [ ] Environment variables not committed
- [ ] API keys secured
- [ ] Authentication working
- [ ] CORS configured properly
- [ ] Input validation in place

---

## 🟢 Nice to Have (Optional)

### Monitoring
- [ ] Analytics setup (Vercel Analytics)
- [ ] Error tracking (optional)
- [ ] Performance monitoring

### Domain
- [ ] Custom domain purchased (if needed)
- [ ] DNS configured
- [ ] SSL verified

### Documentation
- [ ] Deployment guide reviewed
- [ ] Team trained on dashboard
- [ ] Backup procedures documented

---

## 📋 Deployment Day Checklist

### Before Deployment
- [ ] All critical items checked
- [ ] Backup of current data (if any)
- [ ] Team notified
- [ ] Maintenance window scheduled (if needed)

### During Deployment
- [ ] Deploy frontend first
- [ ] Deploy dashboard second
- [ ] Deploy API functions third
- [ ] Test each component after deployment

### After Deployment
- [ ] Test website on live URL
- [ ] Test dashboard on live URL
- [ ] Test all features
- [ ] Monitor for errors
- [ ] Check performance
- [ ] Verify SEO setup

---

## 🚨 Rollback Plan

If something goes wrong:
1. Revert to previous deployment in Vercel
2. Check error logs
3. Fix issues
4. Redeploy

---

## ✅ Ready to Deploy?

You're ready when:
- ✅ All critical items checked
- ✅ All tests passing
- ✅ No console errors
- ✅ Performance acceptable
- ✅ Team ready

**Then proceed to deployment! 🚀**















