import { Response } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  private statusCode: number = 500;
  private rootCause?: Error;

  private details: Record<string, any> = {};
  private logMessage?: string;

  private constructor(err: Error) {
    super(err.message);
  }

  static from(err: Error, statusCode: number = 500) {
    const appErr = new AppError(err);
    appErr.statusCode = statusCode;
    return appErr;
  }

  getRootCause(): Error | null {
    if (this.rootCause) {
      return this.rootCause instanceof AppError
        ? this.rootCause.getRootCause()
        : this.rootCause;
    }

    return null;
  }

  wrap(rootCause: Error): AppError {
    const appErr = AppError.from(this, this.statusCode);
    appErr.rootCause = rootCause;
    return appErr;
  }

  withDetail(key: string, value: any): AppError {
    this.details[key] = value;
    return this;
  }

  withLog(logMessage: string): AppError {
    this.logMessage = logMessage;
    return this;
  }

  toJSON(isProduction: boolean = true) {
    const rootCause: any = this.getRootCause();

    let rootCauseMessage = this.message;
    if (rootCause) {
      rootCauseMessage =
        rootCause instanceof ZodError
          ? JSON.stringify(rootCause.issues)
          : rootCause.message;
    }

    return isProduction
      ? {
          message: this.message,
          statusCode: this.statusCode,
          details: this.details,
        }
      : {
          message: this.message,
          statusCode: this.statusCode,
          details: this.details,
          rootCause: rootCauseMessage,
          logMessage: this.logMessage,
        };
  }

  getStatusCode(): number {
    return this.statusCode;
  }
}

export const responseErr = (err: Error, res: Response) => {
  const isProduction = process.env.ENV === 'production';
  //!isProduction && console.error(err.stack);

  if (err instanceof AppError) {
    const appErr = err;
    res.status(appErr.getStatusCode()).json(appErr.toJSON(isProduction));
    return;
  }

  if (err instanceof ZodError) {
    const zodErr = err;
    const appErr = AppErrInvalidRequest.wrap(zodErr);

    zodErr.issues.forEach((issue) => {
      appErr.withDetail(issue.path.join('.'), issue.message);
    });

    res.status(appErr.getStatusCode()).json(appErr.toJSON(isProduction));
    return;
  }

  const appErr = AppErrInternalServer.wrap(err);
  res.status(appErr.getStatusCode()).json(appErr.toJSON(isProduction));
};

export const AppErrInternalServer = AppError.from(
  new Error('Something went wrong, please try again later.'),
  500,
);
export const AppErrInvalidRequest = AppError.from(
  new Error('Invalid request'),
  400,
);
export const AppErrUnauthorized = AppError.from(new Error('Unauthorized'), 401);
export const AppErrForbidden = AppError.from(new Error('Forbidden'), 403);
export const AppErrNotFound = AppError.from(new Error('Not found'), 404);
export const AppErrMethodNotAllowed = AppError.from(
  new Error('Method not allowed'),
  405,
);
export const ErrTokenInvalid = AppError.from(
  new Error('Token is invalid'),
  401,
);
