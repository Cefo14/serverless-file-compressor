import AdmZip from 'adm-zip';

import Compressor from './Compressor';
import FileToCompress from './FileToCompress';

class ZipCompressor extends Compressor  {
  constructor(files: FileToCompress[]) {
    super(files);
  }

  async compress(): Promise<Buffer> {
    const zip = new AdmZip();

    this.files.forEach((file) => {
      zip.addFile(file.fileName, file.data);
    });

    return zip.toBuffer();
  }
}

export default ZipCompressor;
