'use client';

import clsx from 'clsx';
import { ArrowUpRightIcon, MoreVertical, Trash2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './app-sidebar.scss';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
import { toast } from 'sonner';
import { SidebarIcon } from './sidebar-icon';
import { useSidebarMenu } from './use-sidebar-menu';

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  const { menuData, isLoading, error, refetch } = useSidebarMenu();
  const pathname = usePathname();
  const router = useRouter();

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

  const handleDeleteImage = () => {
    toast.info('Deleting images is not implemented yet');
  };

  const handleSeeImage = (imageUrl: string) => {
    router.push(imageUrl);
  };

  const renderMenuItems = (items: SidebarImage[]) => {
    return items.map((subItem) => (
      <SidebarMenuItem
        key={subItem.title}
        isActive={isSubItemActive(subItem)}
        className='app-sidebar__menu-item'
      >
        <SidebarMenuButton asChild>
          <a href={subItem.url}>
            {subItem.icon && <SidebarIcon iconName={subItem.icon} />}
            {subItem.title}
          </a>
        </SidebarMenuButton>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='app-sidebar__actions'>
              <MoreVertical size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' sideOffset={10} side='right'>
            <DropdownMenuItem onClick={() => handleSeeImage(subItem.url)}>
              <ArrowUpRightIcon size={16} />
              See
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteImage}>
              <Trash2 size={16} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
                <SidebarMenuItem isActive={isActiveUrl('/')}>
                  <SidebarMenuButton asChild>
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
              <SidebarGroupLabel>Images</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton asChild>
                        <SidebarIcon iconName='Package' />
                        <Skeleton height={16} width={120} />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : error ? (
            <SidebarGroup>
              <SidebarGroupLabel>Images</SidebarGroupLabel>
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
                      <SidebarMenuItem isActive={isMenuItemActive(item)}>
                        <SidebarMenuButton asChild>
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
