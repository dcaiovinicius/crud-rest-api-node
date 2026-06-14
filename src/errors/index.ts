export class BaseError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class UserAlreadyExists extends BaseError {
  constructor() {
    super('User already exists', 409);
  }
}

export class UserNotFound extends BaseError {
  constructor() {
    super('User not found', 404);
  }
}
