import FileType from 'file-type';

export const isZip = (mime: string): boolean => (
  mime === 'application/zip'
);

export const fileIsZip =  async (file: Buffer): Promise<boolean> => {
  const { mime } = await FileType.fromBuffer(file);
  return isZip(mime);
};

export default {
  isZip,
  fileIsZip,
};
