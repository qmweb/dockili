'use client';

import { ReactNode } from 'react';
import { AppSidebar } from '../shared';
import { SidebarInset, SidebarProvider } from '../ui';
import Header from './header';
import './index.scss';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
