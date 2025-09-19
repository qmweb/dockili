import { Button } from '@/app/_components/ui';
import '@/styles/pages/home.scss';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get started 🔥 | Template',
  description: 'Accueil',
};

export default async function Home() {
  return (
    <main className='home'>
      <section className='home__hero'>
        <h1>Let's get started 🔥</h1>
        <Button loading>Start the project</Button>
      </section>
    </main>
  );
}
