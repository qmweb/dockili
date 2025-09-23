'use client';

import type { Metadata } from 'next';

import '@/styles/pages/error.scss';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Erreur',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Error() {
  redirect('/');
}
