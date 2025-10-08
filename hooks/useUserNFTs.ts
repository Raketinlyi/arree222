﻿'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { resolveIpfsUrl } from '@/lib/ipfs';
import { alchemyFetch } from '@/lib/alchemyFetch';
import { useMonadNetwork } from '@/hooks/useMonadNetwork';

export interface AlchemyNFT {
  contract: {
    address: string;
  };
  id: {
    tokenId: string;
    tokenMetadata?: {
      tokenType: string;
    };
  };
  balance: string;
  title: string;
  description: string;
  tokenUri: {
    gateway: string;
    raw: string;
  };
  media: Array<{
    gateway: string;
    thumbnail: string;
    raw: string;
    format: string;
    bytes?: number;
  }>;
  image?: {
    cachedUrl?: string;
    pngUrl?: string;
    thumbnailUrl?: string;
    raw?: string;
  };
  metadata: {
    name?: string;
    description?: string;
    image?: string;
    updatedAt?: string;
    attributes?: Array<{
      trait_type: string;
      value: string | number | boolean;
    }>;
  };
  timeLastUpdated: string;
  contractMetadata: {
    name: string;
    symbol: string;
    tokenType: string;
  };
  spamInfo?: {
    isSpam: boolean;
    classifications: string[];
  };
}

export interface UseUserNFTsReturn {
  nfts: AlchemyNFT[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const CONTRACT_ADDRESSES = [
  '0x606a47707d5aEdaE9f616A6f1853fE3075bA740B', // NFT contract address (40 characters)
  // Add other contract addresses if needed
];

// Helper functions for working with tokenId
// Convert a tokenId that may be in hex (padded 0x… or raw hex) OR already decimal
// to its plain decimal string form.
export const hexToDecimal = (value: string): string => {
  if (!value) return '';
  // If already looks like plain decimal, just return
  if (/^\d+$/.test(value)) return value;

  try {
    const clean = value.startsWith('0x') ? value.slice(2) : value;
    return BigInt('0x' + clean).toString();
  } catch {
    return '';
  }
};

export const decimalToHex = (decimal: string): string => {
  return '0x' + parseInt(decimal, 10).toString(16).padStart(64, '0');
};

// Function to get tokenId in decimal format
export const getTokenIdAsDecimal = (nft: Partial<AlchemyNFT> & { tokenId?: string; id?: { tokenId: string } }): string => {
  // 1) Try to extract ID from name/title (e.g. "CrazyCube #3430")
  const nameField = nft.metadata?.name || (nft as AlchemyNFT).title || '';
  const idMatch = /#(\d+)/.exec(nameField);
  if (idMatch?.[1]) {
    return idMatch[1];
  }

  // 2) Check if tokenId is already a string (from useAlchemyNfts)
  if (nft.tokenId && typeof nft.tokenId === 'string') {
    const dec = hexToDecimal(nft.tokenId);
    return dec || nft.tokenId; // Return original if conversion fails
  }

  // 3) Fallback: hex from Alchemy id -> decimal (if present)
  if (nft.id?.tokenId) {
    const dec = hexToDecimal(nft.id.tokenId);
    return dec || '';
  }

  // 4) Last resort – empty string (so UI shows "#" or hides number)
  return '';
};

// Function to get NFT image
export const getNFTImageRaw = (nft: AlchemyNFT): string => {
  let imageUrl =
    nft.image?.cachedUrl ||
    nft.image?.pngUrl ||
    nft.media?.[0]?.gateway ||
    nft.media?.[0]?.raw ||
    '';

  // If not in image/media, check metadata
  if (!imageUrl && nft.metadata?.image) {
    imageUrl = nft.metadata.image;
  }

  // If we still don't have an image URL, return empty string
  return imageUrl || '';
};

export const getNFTImage = (nft: AlchemyNFT): string => {
  // If tokenId is available, prefer the local path
  const tokenId = getTokenIdAsDecimal(nft as Partial<AlchemyNFT>);
  if (tokenId) return `/nft/${tokenId}.webp`;

  const raw = getNFTImageRaw(nft);
  return resolveIpfsUrl(raw) || '';
};

// Function to get NFT name
export const getNFTName = (
  nft: AlchemyNFT | { id: { tokenId: string } }
): string => {
  // Handle different NFT object structures
  if ('title' in nft || 'metadata' in nft) {
    const alchemyNft = nft as AlchemyNFT;
    return (
      alchemyNft.title ||
      alchemyNft.metadata?.name ||
      `Token #${getTokenIdAsDecimal(alchemyNft)}`
    );
  }

  // For simple objects with just tokenId
  return `Token #${getTokenIdAsDecimal(nft)}`;
};

export function useUserNFTs(): UseUserNFTsReturn {
  const { address, isConnected } = useAccount();
  const { getBatchSize, getRetrySettings } = useMonadNetwork(); // Use Monad network optimizations
  const [nfts, setNfts] = useState<AlchemyNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchNFTs = React.useCallback(async () => {
    if (!address || !isConnected) {
      setNfts([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use optimized batch size for Monad network - doubled as requested
      const batchSize = getBatchSize() * 2; // 50 instead of 25
      const parts: string[] = [
        `owner=${address}`,
        'withMetadata=true',
        `pageSize=${batchSize}`,
      ];
      CONTRACT_ADDRESSES.forEach(addr => {
        parts.push(`contractAddresses[]=${addr}`);
      });
      const queryPath = `/getNFTsForOwner?${parts.join('&')}`;

      // Use optimized retry settings for Monad network
      const retrySettings = getRetrySettings();
      
      // Use alchemyFetch with automatic key rotation and retry logic
      const response = await alchemyFetch('nft', queryPath, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }, retrySettings.maxRetries);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Alchemy API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      const userNFTs: AlchemyNFT[] = data.ownedNfts || [];

      // Improved enrichment with better error handling for DNS issues
      const enriched = await Promise.all(
        userNFTs.map(async (item: AlchemyNFT) => {
          const hasImage = getNFTImage(item) !== '';
          if (hasImage) return item;
          
          try {
            if (!item.id?.tokenId) return item;
            const metaPath = `/getNFTMetadata?contractAddress=${item.contract.address}&tokenId=${hexToDecimal(item.id.tokenId)}`;
            const metaRes = await alchemyFetch('nft', metaPath, {
              method: 'GET',
            }, retrySettings.maxRetries);
            if (!metaRes.ok) throw new Error('meta');
            const meta = await metaRes.json();
            
            // merge metadata/media fields if present
            if (meta.rawMetadata) {
              item.metadata = meta.rawMetadata;
            }
            if (meta.media && Array.isArray(meta.media) && meta.media.length) {
              item.media = meta.media;
            }
          } catch (e) {
            // Silently fail for individual NFTs to prevent blocking the entire list
            console.warn(`Failed to enrich NFT ${item.id?.tokenId}:`, e);
          }
          return item;
        })
      );

      setNfts(enriched);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch NFTs');
    } finally {
      setLoading(false);
    }
  }, [address, isConnected, getBatchSize, getRetrySettings]);

  useEffect(() => {
    fetchNFTs();
  }, [address, isConnected, fetchNFTs]);

  return {
    nfts,
    loading,
    error,
    refetch: fetchNFTs,
  };
}
