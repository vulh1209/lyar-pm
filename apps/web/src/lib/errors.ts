/**
 * Custom error class for API errors
 */
export class AppError extends Error {
  constructor(
    public code: string,
    public override message: string,
    public status: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
      },
    };
  }
}

// Common error factories
export const errors = {
  notFound: (resource: string) =>
    new AppError(`${resource.toUpperCase()}_NOT_FOUND`, `${resource} not found`, 404),

  badRequest: (message: string) =>
    new AppError("BAD_REQUEST", message, 400),

  unauthorized: (message = "Unauthorized") =>
    new AppError("UNAUTHORIZED", message, 401),

  forbidden: (message = "Forbidden") =>
    new AppError("FORBIDDEN", message, 403),

  conflict: (message: string) =>
    new AppError("CONFLICT", message, 409),

  internal: (message = "Internal server error") =>
    new AppError("INTERNAL_ERROR", message, 500),
};
