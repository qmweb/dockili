
/**
 * Download a file from the client
 *
 * @param fileUrl The URL of the file to download
 * @returns void
 * @example
 * downloadFile('1234');
 */
export const downloadFile = (fileUrl: string) => {
  // Create an <a> element to trigger the download
  const link = document.createElement('a');
  link.href = fileUrl;

  document.body.appendChild(link);
  link.click();

  // Clean up by removing the link from the DOM
  document.body.removeChild(link);
};
