/**
 * Format a date string to a french short date format
 * @param {string} dateString - The date string to format
 * @returns {string} The formatted date string
 * @example
 * formatDateToFrenchShort('2021-12-31') // returns '31/12/21'
 * formatDateToFrenchShort('2021-12-31T00:00:00.000Z') // returns '31/12/21'
 */
export const formatDateToFrenchShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
};
