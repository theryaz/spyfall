export class BadRequestError extends Error{
  public status: 400 = 400;
  public statusMessage: string = "Not found";
  public payload: Object | undefined;
  constructor(message?: string, payload?: Object){
    super(message);
    this.name = this.constructor.name;
    this.payload = payload;
    Error.captureStackTrace(this, this.constructor);
  }
};
