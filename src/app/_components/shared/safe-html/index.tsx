'use client';

import clsx from 'clsx';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import './safe-html.scss';

interface SafeHtmlProps {
  htmlContent: string;
  variant?: 'default' | 'article' | 'content';
  className?: string;
}

const SafeHtml = ({
  htmlContent,
  variant = 'default',
  className,
  ...props
}: SafeHtmlProps) => {
  const [sanitizedHtml, setSanitizedHtml] = useState('');

  useEffect(() => {
    const cleanHtml = DOMPurify.sanitize(htmlContent);
    setSanitizedHtml(cleanHtml);
  }, [htmlContent]);

  const containerClassName = clsx(
    'safeHtml',
    `safeHtml--${variant}`,
    className,
  );

  return (
    <div
      className={containerClassName}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      {...props}
    />
  );
};

export default SafeHtml;
