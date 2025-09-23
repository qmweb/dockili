import type { Metadata } from 'next';

import '@/styles/pages/not-found.scss';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Erreur 404',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  redirect('/');
}
