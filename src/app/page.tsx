import { AppSidebar } from '@/app/_components/shared/app-sidebar';
import '@/styles/pages/home.scss';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dockili',
  description:
    '🐋🎉 Manage your Docker images very easily, from a modern and easy to use interface.',
};

export default async function Home() {
  return <AppSidebar />;
}
