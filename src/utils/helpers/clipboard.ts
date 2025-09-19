/**
 * Copy text to clipboard
 *
 * @param text - The text to copy to clipboard
 * @returns Promise<boolean> - Returns true if successful, false otherwise
 * @example
 * const success = await copyToClipboard('Hello World');
 * if (success) {
 *   console.log('Text copied successfully');
 * }
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // Check if the Clipboard API is available
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers or non-secure contexts
      return fallbackCopyToClipboard(text);
    }
  } catch (error) {
    console.error('Failed to copy text to clipboard:', error);
    // Try fallback method
    return fallbackCopyToClipboard(text);
  }
};

/**
 * Fallback method for copying text to clipboard
 * Uses the older document.execCommand approach
 *
 * @param text - The text to copy to clipboard
 * @returns boolean - Returns true if successful, false otherwise
 */
const fallbackCopyToClipboard = (text: string): boolean => {
  try {
    // Create a temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Make the textarea invisible
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';

    // Add to DOM, select, and copy
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');

    // Clean up
    document.body.removeChild(textArea);

    return successful;
  } catch (error) {
    console.error('Fallback copy to clipboard failed:', error);
    return false;
  }
};

/**
 * Copy HTML content to clipboard
 *
 * @param html - The HTML content to copy
 * @returns Promise<boolean> - Returns true if successful, false otherwise
 * @example
 * const success = await copyHtmlToClipboard('<p>Hello World</p>');
 * if (success) {
 *   console.log('HTML copied successfully');
 * }
 */
export const copyHtmlToClipboard = async (html: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // Create a Blob with HTML content
      const blob = new Blob([html], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({ 'text/html': blob });

      await navigator.clipboard.write([clipboardItem]);
      return true;
    } else {
      // Fallback: copy as plain text
      return copyToClipboard(html);
    }
  } catch (error) {
    console.error('Failed to copy HTML to clipboard:', error);
    // Fallback to plain text
    return copyToClipboard(html);
  }
};
