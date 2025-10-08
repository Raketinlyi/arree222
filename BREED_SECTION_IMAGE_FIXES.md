# Breed Section Image Loading Fixes

This document summarizes the fixes made to resolve the issue where the Breed section was immediately showing placeholder coins instead of attempting to load actual NFT images.

## Issues Identified

1. **Empty Image URLs**: The [getNFTImageRaw](file:///c:/Users/denpi/Music/58/hooks/useUserNFTs.ts#L113-L132) function was returning empty strings when no image URLs were found in NFT data, causing immediate fallback to default images.

2. **Token ID Handling**: The [IpfsImage](file:///c:/Users/denpi/Music/58/components/IpfsImage.tsx#L63-L199) component wasn't properly handling when [tokenId](file:///c:/Users/denpi/Music/58/components/IpfsImage.tsx#L42-L42) was 0, preventing it from trying local fallback images.

3. **Immediate Fallback**: When image URLs were empty or invalid, the component immediately showed fallback images without attempting proper retry mechanisms.

4. **No Persistent Loading**: When all fallbacks failed, the system showed placeholders instead of continuing to attempt loading.

## Fixes Implemented

### 1. Enhanced getNFTImageRaw Function
- Modified [getNFTImageRaw](file:///c:/Users/denpi/Music/58/hooks/useUserNFTs.ts#L113-L132) in [hooks/useUserNFTs.ts](file:///c:/Users/denpi/Music/58/hooks/useUserNFTs.ts) to return empty strings instead of null values
- This allows the [IpfsImage](file:///c:/Users/denpi/Music/58/components/IpfsImage.tsx#L63-L199) component to properly handle the image loading process

### 2. Improved IpfsImage Component
- Updated [components/IpfsImage.tsx](file:///c:/Users/denpi/Music/58/components/IpfsImage.tsx) to handle empty [src](file:///c:/Users/denpi/Music/58/components/IpfsImage.tsx#L36-L36) values more gracefully
- Enhanced token ID handling to properly use local fallback images even when [tokenId](file:///c:/Users/denpi/Music/58/components/IpfsImage.tsx#L42-L42) is 0:
  ```typescript
  // Handle tokenId being 0 by using a default index
  if (typeof tokenId !== 'undefined' && tokenId !== null && !hasError) {
    const idx = (Number(tokenId) % 7) || 7; // Use 7 when tokenId % 7 is 0
    const localImageSrc = `/images/zol${idx}.png`;
    // ... rest of logic
  }
  ```
- Implemented final fallback behavior where the system keeps trying to load the default fallback image (/icons/favicon-180x180.png) without showing a placeholder
- Enhanced error handling to enable lazy loading behavior where images will eventually load

### 3. Updated Breed Section Components
- Modified [components/BreedingSection.tsx](file:///c:/Users/denpi/Music/58/components/BreedingSection.tsx) to ensure proper token ID handling:
  ```typescript
  // Get token ID for fallback images
  const tokenIdDecimal = getTokenIdAsDecimal(nft) || '0';
  ```
- Updated both main NFT display and selected parents preview to use the enhanced token ID handling
- Ensured consistent [tokenId](file:///c:/Users/denpi/Music/58/components/IpfsImage.tsx#L42-L42) passing to [IpfsImage](file:///c:/Users/denpi/Music/58/components/IpfsImage.tsx#L63-L199) component

### 4. Enhanced BreedForm Component
- Updated [components/BreedForm.tsx](file:///c:/Users/denpi/Music/58/components/BreedForm.tsx) to ensure consistent token ID handling in parent selection cards
- Added proper [tokenId](file:///c:/Users/denpi/Music/58/components/IpfsImage.tsx#L42-L42) passing to [IpfsImage](file:///c:/Users/denpi/Music/58/components/IpfsImage.tsx#L63-L199) component

## Results

These improvements should resolve the issue where:

1. **Immediate Placeholder Display**: The Breed section will no longer immediately show placeholder coins
2. **Proper Image Loading**: NFT images will be properly attempted to load through IPFS gateways
3. **Enhanced Fallback Mechanism**: When IPFS loading fails, the system will properly try local fallback images
4. **Persistent Loading**: When all fallbacks fail, the system will continue attempting to load the default fallback image without showing placeholders
5. **Better Error Handling**: Improved retry mechanisms with proper error type detection

The Breed section should now behave consistently with other sections of the application where NFT images load properly, with the added benefit of persistent loading attempts for the default fallback image.