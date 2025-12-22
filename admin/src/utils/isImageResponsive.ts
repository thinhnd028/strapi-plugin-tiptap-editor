/**
 * Checks if an image has responsive formats available.
 * @param imgFormats - The formats object from the image data.
 * @returns True if responsive formats exist, false otherwise.
 */
export function isImageResponsive(imgFormats: { [k: string]: Object }): boolean {
  const formats = Object.keys(imgFormats);
  const isResponsive = !(formats.length === 1 && formats[0] === 'thumbnail');
  return isResponsive;
}
