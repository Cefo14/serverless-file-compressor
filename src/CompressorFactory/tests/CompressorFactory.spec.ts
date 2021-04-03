import path from 'path';
import 'jest-extended';

import CompressorFactory from '..';
import FileToCompress from '../FileToCompress';

import File from '../../utils/File';
import MIME from '../../utils/MIME';

jest.setTimeout(50 * 1000);

const readFiles = async (fileNames: string[]) => {
  const BASE_FILE_PATH = path.join(__dirname, 'mocks');
  const files: FileToCompress[] = await Promise.all(
    fileNames.map(async (fileName) => {
      const FILE_PATH = path.join(BASE_FILE_PATH, fileName);
      const data = await File.read(FILE_PATH);
      return {
        fileName,
        data,
      };
    })
  );
  return files;
};

describe('CompressorFactory', () => {

  describe('when type is zip', () => {
    const type = 'zip';

    describe('when is ok', () => {
      it('should return a zip file', async () => {
        const MOCK_FILE_NAMES = ['dummy.pdf', 'dummy.png'];
        const files: FileToCompress[] = await readFiles(MOCK_FILE_NAMES);

        const compressorFactory = new CompressorFactory(type, files);
        const compressor = compressorFactory.exec();
        const compressedFile = await compressor.compress();

        const isZip = await MIME.fileIsZip(compressedFile);
        expect(isZip).toBeTrue();

        const dummyFileSize = files.reduce((previousValue, currentValue) => (
          previousValue + currentValue.data.length
        ), 0);
        expect(compressedFile.length).toBeLessThanOrEqual(dummyFileSize)
      });
    });

    describe('when is ok and store zip file', () => {
      it.skip('should return and store a zip file', async () => {
        const MOCK_FILE_NAMES = ['dummy.pdf', 'dummy.png'];
        const files: FileToCompress[] = await readFiles(MOCK_FILE_NAMES);

        const compressorFactory = new CompressorFactory(type, files);
        const compressor = compressorFactory.exec();
        const compressedFile = await compressor.compress();

        const isZip = await MIME.fileIsZip(compressedFile);
        expect(isZip).toBeTrue();

        const dummyFileSize = files.reduce((previousValue, currentValue) => (
          previousValue + currentValue.data.length
        ), 0);
        expect(compressedFile.length).toBeLessThanOrEqual(dummyFileSize)

        const BASE_FILE_PATH = path.join(__dirname, 'mocks');
        const outputCompressedFile = path.join(BASE_FILE_PATH, 'compressedFile.zip');
        await File.write(outputCompressedFile, compressedFile);
      });
    });
  });
});
