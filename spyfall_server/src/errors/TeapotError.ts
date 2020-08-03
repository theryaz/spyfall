export class TeapotError extends Error{
  public status: 418 = 418;
  public statusMessage: string = "I'm a teapot.";
  public payload: Object | undefined;
  constructor(message?: string, payload?: Object){
    super(message);
    this.name = this.constructor.name;
    this.payload = payload;
    Error.captureStackTrace(this, this.constructor);
  }
};
