import type { Metadata } from 'next';

import '@/styles/pages/not-found.scss';
import Link from 'antd/es/typography/Link';
import { Button } from './_components/ui';

export const metadata: Metadata = {
  title: 'Erreur 404',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className='not-found container'>
      <h1>Oups ! Cette page n'existe pas...</h1>
      <Button variant='primary'>
        <Link href='/'>Retour à la page d'accueil</Link>
      </Button>
    </main>
  );
}
