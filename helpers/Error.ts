export class ServerError extends Error {
  status = 404;

  constructor({ status, message }: { status: number; message: string }) {
    super(message);

    this.status = status;

    Object.setPrototypeOf(this, ServerError.prototype);
  }

  getErrorMessage() {
    return 'Something went wrong: ' + this.message;
  }
}
