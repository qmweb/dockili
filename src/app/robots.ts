import type { MetadataRoute } from 'next';

import { APP_URL } from '@/utils/constants/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [],
      disallow: [
        '/admin',
        '/mentions-legales',
        '/politique-confidentialite',
      ],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
