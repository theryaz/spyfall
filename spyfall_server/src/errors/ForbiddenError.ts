export class ForbiddenError extends Error{
  public status: 403 = 403;
  public statusMessage: string = "Forbidden";
  public payload: Object | undefined;
  constructor(message?: string, payload?: Object){
    super(message);
    this.name = this.constructor.name;
    this.payload = payload;
    Error.captureStackTrace(this, this.constructor);
  }
};
