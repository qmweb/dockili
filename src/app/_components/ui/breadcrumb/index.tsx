import clsx from 'clsx';
import React from 'react';
import './breadcrumb.scss';

// Breadcrumb
interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const Breadcrumb = ({ children, className, ...props }: BreadcrumbProps) => {
  return (
    <nav className={clsx('breadcrumb', className)} {...props}>
      {children}
    </nav>
  );
};

// Breadcrumb List
interface BreadcrumbListProps extends React.HTMLAttributes<HTMLOListElement> {
  children: React.ReactNode;
}

const BreadcrumbList = ({
  children,
  className,
  ...props
}: BreadcrumbListProps) => {
  return (
    <ol className={clsx('breadcrumb', className)} {...props}>
      {children}
    </ol>
  );
};

// Breadcrumb Item
interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  className?: string;
}

const BreadcrumbItem = ({
  children,
  className,
  ...props
}: BreadcrumbItemProps) => {
  return (
    <li className={clsx('breadcrumb__item', className)} {...props}>
      {children}
    </li>
  );
};

// Breadcrumb Link
interface BreadcrumbLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href: string;
}

const BreadcrumbLink = ({
  children,
  className,
  ...props
}: BreadcrumbLinkProps) => {
  return (
    <a className={clsx('breadcrumb__link', className)} {...props}>
      {children}
    </a>
  );
};

// Breadcrumb Page
interface BreadcrumbPageProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

const BreadcrumbPage = ({
  children,
  className,
  ...props
}: BreadcrumbPageProps) => {
  return (
    <span className={clsx('breadcrumb__page', className)} {...props}>
      {children}
    </span>
  );
};

// Breadcrumb Separator
interface BreadcrumbSeparatorProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  className?: string;
}

const BreadcrumbSeparator = ({
  children = '/',
  className,
  ...props
}: BreadcrumbSeparatorProps) => {
  return (
    <span className={clsx('breadcrumb__separator', className)} {...props}>
      {children}
    </span>
  );
};

export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
