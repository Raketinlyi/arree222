import { Suspense } from 'react';
import HomePageClient from './page.client';

export const revalidate = 60;

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main className='min-h-screen bg-slate-950 text-white'>
          <div className='mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 py-24 sm:px-6 lg:px-8'>
            <div className='h-3 w-24 animate-pulse rounded-full bg-white/20' />
            <div className='h-12 w-full max-w-3xl animate-pulse rounded-3xl bg-white/10' />
            <div className='grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2'>
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className='h-36 animate-pulse rounded-2xl bg-white/5' />
              ))}
            </div>
          </div>
        </main>
      }
    >
      <HomePageClient />
    </Suspense>
  );
}
