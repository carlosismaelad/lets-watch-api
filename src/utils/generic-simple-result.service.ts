import { Injectable } from '@nestjs/common';

@Injectable()
export class GenericSimpleResult {
  message: string = '';
  success: boolean = false;
  json?: string;
  request?: string;
  response?: string;
  statusCode?: number;

  constructor(init?: Partial<GenericSimpleResult>) {
    Object.assign(this, init);
  }
}

export class GenericResult<T> extends GenericSimpleResult {
  result?: T;

  constructor(init?: Partial<GenericResult<T>>) {
    super(init);
    Object.assign(this, init);
  }
}
