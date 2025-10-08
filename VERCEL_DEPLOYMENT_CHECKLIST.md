# Vercel Deployment Checklist

This checklist ensures that all security configurations are properly set up for Vercel deployment and that no image loading is blocked.

## Security Configuration Verification

### 1. Content Security Policy (CSP)
- [x] Middleware CSP header includes all IPFS gateways
- [x] Next.js image configuration includes all IPFS gateways
- [x] No restrictive CSP policies blocking image loading

### 2. Image Loading Configuration
- [x] Next.js `next.config.mjs` includes all necessary domains in `images.domains`
- [x] Next.js `next.config.mjs` includes all necessary patterns in `images.remotePatterns`
- [x] No rate limiting blocking image requests

### 3. Trusted Types
- [x] Trusted Types is disabled by default (`NEXT_PUBLIC_TRUSTED_TYPES_ENABLED=false`)
- [x] No Trusted Types policies blocking image loading

### 4. Network Security
- [x] No firewall rules blocking IPFS gateways
- [x] No DNS filtering blocking IPFS domains

## IPFS Gateway Verification

### Allowed Gateways
1. `nftstorage.link` - ✅ Configured
2. `ipfs.io` - ✅ Configured
3. `gateway.pinata.cloud` - ✅ Configured
4. `media.gateway.pinata.cloud` - ✅ Configured (was missing, now added)
5. `cloudflare-ipfs.com` - ✅ Configured
6. `dweb.link` - ✅ Configured
7. `ipfs.dweb.link` - ✅ Configured
8. `nft-cdn.alchemy.com` - ✅ Configured
9. `cf-ipfs.com` - ✅ Configured
10. `ipfs.decentralized-content.com` - ✅ Configured
11. `ipfs.runfission.com` - ✅ Configured
12. `ipfs.eth.arweave.network` - ✅ Configured
13. `ipfs.infura.io` - ✅ Configured
14. `ipfs.fleek.co` - ✅ Configured
15. `hardbin.com` - ✅ Configured

## Vercel-Specific Considerations

### Environment Variables
- [ ] Ensure all required environment variables are set in Vercel dashboard
- [ ] Verify `NEXT_PUBLIC_ALCHEMY_API_KEY_1` through `NEXT_PUBLIC_ALCHEMY_API_KEY_5` are configured
- [ ] Verify `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is configured

### Build Settings
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`
- [ ] Install command: `npm install`

### Vercel Headers
- [ ] No conflicting headers in Vercel dashboard
- [ ] CSP headers properly configured

## Testing Checklist

### Page-by-Page Testing
- [ ] Home page - Verify images load correctly
- [ ] Breed page - Verify NFT images load correctly
- [ ] Burn page - Verify NFT images load correctly
- [ ] Ping page - Verify NFT images load correctly
- [ ] Graveyard page - Verify NFT images load correctly
- [ ] Rewards page - Verify NFT images load correctly
- [ ] Stats page - Verify charts and images load correctly

### Image Loading Testing
- [ ] Verify Pinata gateway images load (`media.gateway.pinata.cloud`)
- [ ] Verify Alchemy gateway images load (`nft-cdn.alchemy.com`)
- [ ] Verify IPFS gateway images load (`ipfs.io`, `dweb.link`, etc.)
- [ ] Verify local images load correctly

### Error Monitoring
- [ ] Check browser console for ERR_NAME_NOT_RESOLVED errors
- [ ] Check browser console for CSP violations
- [ ] Check browser console for Trusted Types violations
- [ ] Check browser console for network errors

## Common Issues and Solutions

### ERR_NAME_NOT_RESOLVED
**Issue**: DNS resolution fails for IPFS gateways
**Solution**: 
1. ✅ Added missing gateways to CSP headers
2. ✅ Added missing gateways to Next.js image configuration
3. ✅ Verified all gateways are properly configured

### CSP Violations
**Issue**: Content Security Policy blocking image loading
**Solution**:
1. ✅ Updated CSP headers in middleware.ts
2. ✅ Verified img-src directive includes all IPFS gateways
3. ✅ Verified connect-src directive includes all IPFS gateways

### Rate Limiting
**Issue**: Too many requests causing blocking
**Solution**:
1. ✅ Optimized batch sizes for Monad Testnet
2. ✅ Reduced concurrent requests
3. ✅ Implemented proper retry mechanisms

## Post-Deployment Verification

### Monitoring
- [ ] Set up error monitoring for image loading failures
- [ ] Set up CSP violation reporting
- [ ] Monitor network errors in browser console

### Performance
- [ ] Verify image loading times are acceptable
- [ ] Verify no excessive retry attempts
- [ ] Verify proper caching of images

This checklist ensures that all security configurations are properly set up for Vercel deployment and that no image loading is blocked.