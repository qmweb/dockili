'use client';

import clsx from 'clsx';
import { PanelLeft } from 'lucide-react';
import React, { createContext, useContext, useState } from 'react';
import './sidebar-inset.scss';
import './sidebar.scss';

// Sidebar Context
interface SidebarContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(
  undefined,
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

// Sidebar Provider
interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  defaultCollapsed?: boolean;
}

const SidebarProvider = ({
  children,
  defaultOpen = true,
  defaultCollapsed = false,
}: SidebarProviderProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SidebarContext.Provider
      value={{ isOpen, setIsOpen, isCollapsed, setIsCollapsed, toggleSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

// Main Sidebar Component
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

const Sidebar = ({
  children,
  collapsible: _collapsible = false,
  defaultCollapsed: _defaultCollapsed = false,
  className,
  ...props
}: SidebarProps) => {
  const { isOpen, isCollapsed } = useSidebar();

  return (
    <>
      <div
        className={clsx(
          'sidebar',
          isCollapsed && 'sidebar--collapsed',
          className,
        )}
        data-state={isOpen ? 'open' : 'closed'}
        {...props}
      >
        {children}
      </div>
      {isOpen && (
        <div
          className='sidebar__overlay'
          data-state={isOpen ? 'open' : 'closed'}
        />
      )}
    </>
  );
};

// Sidebar Header
interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SidebarHeader = ({
  children,
  className,
  ...props
}: SidebarHeaderProps) => {
  return (
    <div className={clsx('sidebar__header', className)} {...props}>
      {children}
    </div>
  );
};

// Sidebar Content
interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SidebarContent = ({
  children,
  className,
  ...props
}: SidebarContentProps) => {
  return (
    <div className={clsx('sidebar__content', className)} {...props}>
      {children}
    </div>
  );
};

// Sidebar Group
interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SidebarGroup = ({ children, className, ...props }: SidebarGroupProps) => {
  return (
    <div className={clsx('sidebar__group', className)} {...props}>
      {children}
    </div>
  );
};

// Sidebar Group Label
interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SidebarGroupLabel = ({
  children,
  className,
  ...props
}: SidebarGroupLabelProps) => {
  return (
    <div className={clsx('sidebar__group__label', className)} {...props}>
      {children}
    </div>
  );
};

// Sidebar Group Content
interface SidebarGroupContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SidebarGroupContent = ({
  children,
  className,
  ...props
}: SidebarGroupContentProps) => {
  return (
    <div className={clsx('sidebar__group__content', className)} {...props}>
      {children}
    </div>
  );
};

// Sidebar Menu
interface SidebarMenuProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode;
}

const SidebarMenu = ({ children, className, ...props }: SidebarMenuProps) => {
  return (
    <ul className={clsx('sidebar__menu', className)} {...props}>
      {children}
    </ul>
  );
};

// Sidebar Menu Item
interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
}

const SidebarMenuItem = ({
  children,
  className,
  ...props
}: SidebarMenuItemProps) => {
  return (
    <li className={clsx('sidebar__menu__item', className)} {...props}>
      {children}
    </li>
  );
};

// Sidebar Menu Button
interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
  isActive?: boolean;
}

const SidebarMenuButton = ({
  children,
  asChild = false,
  isActive = false,
  className,
  ...props
}: SidebarMenuButtonProps) => {
  const buttonClassName = clsx(
    'sidebar__menu__button',
    isActive && 'sidebar__menu__button--active',
    className,
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: clsx(buttonClassName, children.props.className),
      'data-active': isActive,
      ...props,
    });
  }

  return (
    <button className={buttonClassName} data-active={isActive} {...props}>
      {children}
    </button>
  );
};

// Sidebar Rail
interface SidebarRailProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const SidebarRail = ({ className, ...props }: SidebarRailProps) => {
  return <div className={clsx('sidebar__rail', className)} {...props} />;
};

// Sidebar Inset
interface SidebarInsetProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SidebarInset = ({ children, className, ...props }: SidebarInsetProps) => {
  return (
    <div className={clsx('sidebarInset', className)} {...props}>
      {children}
    </div>
  );
};

// Sidebar Trigger
interface SidebarTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const SidebarTrigger = ({ className, ...props }: SidebarTriggerProps) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      className={clsx('sidebar__trigger', className)}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeft className='sidebar__trigger__icon' />
    </button>
  );
};

export {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
};
