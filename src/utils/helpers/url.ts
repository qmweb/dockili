import slugify from 'slugify';

export const slugifyStrictOptions = {
  lower: true,
  strict: true,
  trim: true,
};

/**
 * Function to extract a slug from an URL
 * @param {string} url
 * @returns {string} slug
 *
 * @example
 * const slug = extractSlug('https://example.com/blog/my-post');
 * // Returns: 'blog/my-post'
 */
export const extractSlug = (url: string): string => {
  // Create a URL object from the given URL
  const parsedUrl = new URL(url);
  // Get the pathname and remove leading slashes
  const path = parsedUrl.pathname.replace(/^\//, '');
  return path;
};

/**
 * Extracts the numeric ID from a slug.
 * Assumes that the ID is the last part of the slug after a hyphen.
 *
 * @param slug - The slug string (e.g., 'house-paris-123')
 * @returns {number | null} - The ID if found, or null if no ID is found.
 */
export const extractIdFromSlug = (slug: string): number | null => {
  const match = slug.match(/(\d+)$/); // Regular expression to match numbers at the end of the string
  return match ? parseInt(match[0], 10) : null;
};

/**
 * Remove the ID from the slug.
 * Assumes that the ID is the last part of the slug after a hyphen.
 *
 * @param slug - The slug string (e.g., 'house-paris-123')
 * @returns {string} - The non-numeric characters (e.g., 'house-paris-')
 */
export const removeIdFromSlug = (slug: string): string => {
  return slug.replace(/-\d+$/, '');
};

/**
 * Function to extract a hostname from an URL
 * @param {string} url
 * @returns {string} hostname
 *
 * @example
 * const hostname = extractHostname('https://example.com/blog/my-post');
 * // Returns: 'example.com'
 */
export const extractHostname = (url: string | undefined): string | null => {
  if (!url) return null;

  const parsedUrl = new URL(url);
  return parsedUrl.hostname;
};

/**
 * Function to build a URL from a title
 * @param {string} title
 * @param {string} customSlug
 * @param {string} parent
 * @returns {string} url
 */
export const buildUrl = (
  title: string,
  customSlug?: string,
  parent?: string,
): string => {
  const finalSlug =
    customSlug ||
    slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });

  const url = parent ? `${parent}/${finalSlug}` : finalSlug;

  return url;
};

/**
 * Converts a slugified string (hyphenated) back to a human-readable format.
 *
 * @param slug - The slug string to be converted (e.g., "house-paris").
 * @returns {string} - The human-readable string (e.g., "House Paris").
 */
export const unslugify = (slug: string): string => {
  return slug
    .split('-') // Split by hyphen to separate words
    .map((word, index) => {
      // Capitalize the first letter of each word, and lowercase the rest
      return index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word.toLowerCase();
    })
    .join(' '); // Join the words back together with spaces
};
