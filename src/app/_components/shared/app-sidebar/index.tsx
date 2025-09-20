'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import './app-sidebar.scss';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/app/_components/ui';
import {
  SidebarImage,
  SidebarMenuItem as SidebarMenuItemType,
} from '@/utils/types/registry.interface';
import { SidebarIcon } from './sidebar-icon';
import { useSidebarMenu } from './use-sidebar-menu';

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  const { menuData, isLoading, error, refetch } = useSidebarMenu();
  const pathname = usePathname();

  const isActiveUrl = (url: string): boolean => {
    // Handle dashboard/home page
    if (url === '/' && pathname === '/') return true;

    // Handle image pages
    if (url.startsWith('/images/') && pathname.startsWith('/images/')) {
      const urlImage = url.replace('/images/', '');
      const pathImage = pathname.replace('/images/', '');
      return decodeURIComponent(urlImage) === decodeURIComponent(pathImage);
    }

    // Handle exact matches for other URLs
    return url === pathname;
  };

  const isMenuItemActive = (item: SidebarMenuItemType): boolean => {
    if (isActiveUrl(item.url)) return true;
    if (item.items) {
      return item.items.some((subItem) => isActiveUrl(subItem.url));
    }
    return false;
  };

  const isSubItemActive = (subItem: SidebarImage): boolean => {
    return isActiveUrl(subItem.url);
  };

  const renderMenuItems = (items: SidebarImage[]) => {
    return items.map((subItem) => (
      <SidebarMenuItem key={subItem.title}>
        <SidebarMenuButton asChild isActive={isSubItemActive(subItem)}>
          <a href={subItem.url}>
            {subItem.icon && <SidebarIcon iconName={subItem.icon} />}
            {subItem.title}
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));
  };

  return (
    <div className={clsx('app-sidebar', className)}>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActiveUrl('/')}>
                    <a href='/'>
                      <SidebarIcon iconName='LayoutDashboard' />
                      Dashboard
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {isLoading ? (
            <SidebarGroup>
              <SidebarGroupLabel>Loading...</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className='app-sidebar__loading'>
                  <div className='app-sidebar__loading__spinner'></div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : error ? (
            <SidebarGroup>
              <SidebarGroupLabel>Error</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className='app-sidebar__error'>
                  <p>Failed to load images: {error}</p>
                  <button
                    onClick={refetch}
                    className='app-sidebar__retry-button'
                  >
                    Retry
                  </button>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : menuData ? (
            menuData.navMain.map((item) => (
              <SidebarGroup key={item.title}>
                <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items ? (
                      renderMenuItems(item.items)
                    ) : (
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isMenuItemActive(item)}
                        >
                          <a href={item.url}>
                            {item.icon && <SidebarIcon iconName={item.icon} />}
                            {item.title}
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))
          ) : null}
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
