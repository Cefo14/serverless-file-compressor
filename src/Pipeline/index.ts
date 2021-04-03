import Joi from 'joi';

import Request from './Request';
import Response from './Response';

import ServiceFactory from '../ServiceFactory';
import CompressorFactory from '../CompressorFactory';
import FileToCompress from '../CompressorFactory/FileToCompress';

class Pipeline {
  private input: Request;

  constructor (input: Request) {
    this.input = input
  }

  private async validateInput(input: Request): Promise<Request> {
    const SchemaValidator = Joi.object<Request>({
      files: Joi
        .array()
        .items(Joi.object({
            fileName: Joi.string().required(),
            url: Joi.alternatives()
              .try(
                Joi.string().trim().uri(),
                Joi.string().trim()
              )
        }))
        .required(),
    });

    const request: Request = await SchemaValidator.validateAsync(input);
    return request;
  }

  private async downloadFiles(input: Request): Promise<FileToCompress[]> {
    const { files } = input;

    const serviceFactory = new ServiceFactory('aws');
    const service = serviceFactory.initialize();

    const downloadedFiles = await Promise.all(
      files.map(async (file) => {
        const data = await service.download(file.url);
        return {
          fileName: file.fileName,
          data,
        };
      })
    );

    return downloadedFiles;
  };

  private async uploadFile(file: Buffer): Promise<string> {
    const serviceFactory = new ServiceFactory('aws');
    const service = serviceFactory.initialize();
    const url = await service.upload(file);
    return url;
  };

  async exec(): Promise<Response> {
    const input = await this.validateInput(this.input);

    const downloadedFiles = await this.downloadFiles(input);

    const compressorFactory = new CompressorFactory('zip', downloadedFiles);
    const compressor = compressorFactory.exec();
    const compressedFile = await compressor.compress();

    const url = await this.uploadFile(compressedFile);
    const response = { url };

    return response;
  }
}

export default Pipeline;
