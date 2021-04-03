class InvalidCompressorTypeError extends Error {
  constructor(...args) {
    super(...args);
    this.name = 'InvalidCompressorTypeError';
    this.message = 'invalid compressor type';
    if (Error.captureStackTrace) Error.captureStackTrace(this, InvalidCompressorTypeError);
    Object.setPrototypeOf(this, InvalidCompressorTypeError.prototype);
  }
}

export default InvalidCompressorTypeError;
