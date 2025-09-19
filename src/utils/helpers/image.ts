import sharp from 'sharp';

export const compressAndResize = (image: Buffer | string) => {
  return sharp(image).resize(800).jpeg({ quality: 70 }).toBuffer();
};

export const convertBufferToBase64 = (image: Buffer): string => {
  return Buffer.from(image).toString('base64');
};

export const buildFromBase64 = (
  base64Image: string,
  contentType: string,
): string => {
  return `data:${contentType};base64,${base64Image}`;
};
