import AdmZip from 'adm-zip';

import Compressor from './Compressor';
import ZipCompressor from './ZipCompressor';
import FileToCompress from './FileToCompress';

import InvalidCompressorTypeError from './errors/InvalidCompressorTypeError';

class CompressorFactory  {
  private type: string;
  private files: FileToCompress[];

  constructor(type: string, files: FileToCompress[]) {
    this.type = type
    this.files = files;
  }

  exec(): Compressor {
    switch(this.type.toLowerCase()) {
      case 'zip':
        return new ZipCompressor(this.files);
      default:
        throw new InvalidCompressorTypeError();
    }
  }
}

export default CompressorFactory;
