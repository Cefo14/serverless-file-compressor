import FileToCompress from './FileToCompress';

abstract class Compressor  {
  protected files: FileToCompress[];

  constructor(files: FileToCompress[]) {
    this.files = files;
  }

  abstract compress(): Promise<Buffer>
}

export default Compressor;
