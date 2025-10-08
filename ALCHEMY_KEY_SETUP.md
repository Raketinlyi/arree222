# Alchemy API Key Setup Guide

This document explains how to properly configure your 5 Alchemy API keys for optimal NFT loading performance.

## Why Multiple Keys?

Using multiple API keys provides several benefits:

1. **Increased Rate Limits**: Each key has its own rate limit quota
2. **Better Reliability**: If one key fails, others can take over
3. **Load Distribution**: Requests are distributed across multiple keys
4. **Improved Performance**: Parallel requests can be made with different keys

## Setup Instructions

### 1. Obtain Your Keys

1. Go to [Alchemy Dashboard](https://dashboard.alchemy.com/)
2. Create 5 separate API keys for your app
3. Note down each key - you'll need all 5

### 2. Configure Environment Variables

In your `.env.local` file, add all 5 keys:

```env
# Method 1: Individual key variables (recommended)
NEXT_PUBLIC_ALCHEMY_API_KEY_1=your_first_key_here
NEXT_PUBLIC_ALCHEMY_API_KEY_2=your_second_key_here
NEXT_PUBLIC_ALCHEMY_API_KEY_3=your_third_key_here
NEXT_PUBLIC_ALCHEMY_API_KEY_4=your_fourth_key_here
NEXT_PUBLIC_ALCHEMY_API_KEY_5=your_fifth_key_here

# Method 2: Comma-separated list
ALCHEMY_KEYS=your_first_key_here,your_second_key_here,your_third_key_here,your_fourth_key_here,your_fifth_key_here
```

### 3. Dedicated Keys for Specific Functions

You can also set dedicated keys for specific functions:

```env
# Dedicated key for breeding operations
NEXT_PUBLIC_ALCHEMY_API_KEY_BREED=your_dedicated_breeding_key_here
```

## Best Practices

### Key Rotation
- The system automatically rotates between keys
- Failed keys are temporarily disabled and re-enabled after 2 minutes
- Stats are tracked for each key to optimize selection

### Key Usage Recommendations
1. **NFT Metadata**: Use keys 1-2
2. **RPC Calls**: Use keys 3-4
3. **Breeding Operations**: Use key 5 or dedicated BREED key
4. **Fallback**: System automatically falls back to public RPC if all keys fail

### Monitoring
Use the `useNFTPerformance` hook to monitor key performance:

```typescript
import { useNFTPerformance } from '@/hooks/useNFTPerformance';

const { metrics, loading, refresh } = useNFTPerformance();

console.log(`Active keys: ${metrics.activeKeys}/${metrics.totalKeys}`);
console.log(`Current tier: ${metrics.currentTier}`);
```

## Troubleshooting

### If Images Still Don't Load
1. Check that all 5 keys are properly configured
2. Verify keys are valid and not expired
3. Check the key stats: `console.log(getRotationStats())`
4. Ensure you haven't hit rate limits on all keys

### Rate Limit Issues
- The system automatically retries with different keys
- Exponential backoff is used (1.5s, 3s, 6s, 12s, etc.)
- Maximum of 8 retries per request

## Key Benefits After Setup

1. **5x Rate Limit**: Each key has its own quota
2. **Automatic Failover**: If one key fails, others take over
3. **Smart Rotation**: Keys are selected based on performance
4. **Load Balancing**: Requests distributed across keys
5. **Performance Monitoring**: Track key usage and success rates

With proper setup, you should see significantly improved NFT loading times and reliability.