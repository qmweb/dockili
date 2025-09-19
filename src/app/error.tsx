'use client';

import type { Metadata } from 'next';

import '@/styles/pages/error.scss';
import Link from 'next/link';
import { Button } from './_components/ui';

export const metadata: Metadata = {
  title: 'Erreur',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Error() {
  return (
    <main className='error container'>
      <h1>Oups ! Une erreur est survenue...</h1>
      <Button variant='primary'>
        <Link href='/'>Retour à la page d'accueil</Link>
      </Button>
    </main>
  );
}
