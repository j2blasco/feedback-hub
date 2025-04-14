export interface Result<TSuccess1, TError1> {
  andThen<TResult extends Result<any, any>>(
    f: (value: TSuccess1) => TResult,
  ): Result<SuccessType<TResult>, TError1 | ErrorType<TResult>>;
  andThenAsync<TResult extends Result<any, any>>(
    f: (value: TSuccess1) => Promise<TResult>,
  ): Promise<Result<SuccessType<TResult>, TError1 | ErrorType<TResult>>>;
  catchError<TResult extends Result<any, any>>(
    f: (error: TError1) => TResult,
  ): Result<TSuccess1 | SuccessType<TResult>, ErrorType<TResult>>;
  catchErrorAsync<TResult extends Result<any, any>>(
    f: (error: TError1) => Promise<TResult>,
  ): Promise<Result<TSuccess1 | SuccessType<TResult>, ErrorType<TResult>>>;
  unwrapOrThrow(errorCallback?: (e: TError1) => void): TSuccess1;
}

export function unwrapSuccessResult<T>(result: Result<T, never>): T {
  if (result instanceof ResultSuccessImp) {
    return result['value'];
  }
  throw new Error('Unreachable code. Result is an error');
}

export type ErrorWithCode<TCode, TData = object> = { code: TCode; data: TData };
export function errorWithCode<TCode, TData>(
  code: TCode,
  data: TData,
): ErrorWithCode<TCode, TData> {
  return {
    code,
    data,
  };
}

export type ErrorUnknown = {
  code: 'unknown';
  data: { message: string };
};
export function errorUnkown(message: string): ErrorUnknown {
  return {
    code: 'unknown',
    data: { message },
  };
}

export type SuccessType<T> = T extends Result<infer S, any> ? S : never;
export type ErrorType<T> = T extends Result<any, infer E> ? E : never;

export type SuccessVoid = never;

export function resultSuccessVoid(): Result<SuccessVoid, never> {
  return new ResultSuccessImp<SuccessVoid>(undefined as never);
}

export function resultSuccess<TSuccess1>(
  value: TSuccess1,
): Result<TSuccess1, never> {
  return new ResultSuccessImp<TSuccess1>(value);
}

type EnforceLiteral<T> = string extends T ? never : T;

export class resultError {
  public static unknown(message: string): Result<never, ErrorUnknown> {
    return new ResultErrorImp<ErrorUnknown>(errorUnkown(message));
  }
  public static withCode<TCode, TData = object>(
    code: EnforceLiteral<TCode>,
    data: TData = {} as TData,
  ): Result<never, ErrorWithCode<TCode, TData>> {
    return new ResultErrorImp<ErrorWithCode<TCode, TData>>(
      errorWithCode(code, data),
    );
  }
  public static fromError<
    TSuccess1,
    TError1 extends ErrorWithCode<any, object>,
  >(error: TError1): Result<TSuccess1, TError1> {
    return new ResultErrorImp<TError1>(error);
  }
}

class ResultSuccessImp<TSuccess1> implements Result<TSuccess1, never> {
  constructor(private value: TSuccess1) {}

  public andThen<TSuccess2, TError2>(
    f: (value: TSuccess1) => Result<TSuccess2, TError2>,
  ): Result<TSuccess2, TError2> {
    return f(this.value);
  }

  public async andThenAsync<TSuccess2, TError2>(
    f: (value: TSuccess1) => Promise<Result<TSuccess2, TError2>>,
  ): Promise<Result<TSuccess2, TError2>> {
    return await f(this.value);
  }

  public catchError<TSuccess2, TError2>(
    _f: (error: never) => Result<TSuccess2, TError2>,
  ): Result<TSuccess1 | TSuccess2, TError2> {
    return this;
  }

  public async catchErrorAsync<TSuccess2, TError2>(
    _f: (error: never) => Promise<Result<TSuccess2, TError2>>,
  ): Promise<Result<TSuccess1 | TSuccess2, TError2>> {
    return this;
  }

  public unwrapOrThrow(_errorCallback?: (e: never) => void): TSuccess1 {
    return this.value;
  }
}

class ResultErrorImp<TError1> implements Result<never, TError1> {
  constructor(private error: TError1) {}

  public andThen<TSuccess2, TError2>(
    _f: (value: never) => Result<TSuccess2, TError2>,
  ): Result<TSuccess2, TError1 | TError2> {
    return this;
  }

  public async andThenAsync<TSuccess2, TError2>(
    _f: (value: never) => Promise<Result<TSuccess2, TError2>>,
  ): Promise<Result<TSuccess2, TError1 | TError2>> {
    return this;
  }

  public catchError<TSuccess2, TError2>(
    f: (error: TError1) => Result<TSuccess2, TError2>,
  ): Result<TSuccess2, TError2> {
    return f(this.error);
  }

  public async catchErrorAsync<TSuccess2, TError2>(
    f: (error: TError1) => Promise<Result<TSuccess2, TError2>>,
  ): Promise<Result<TSuccess2, TError2>> {
    return await f(this.error);
  }

  public unwrapOrThrow(errorCallback?: (e: TError1) => void): never {
    if (errorCallback !== undefined) {
      errorCallback(this.error);
    }
    throw this.error;
  }
}

export type UnwrapErrorFromResult<T> =
  T extends Result<any, infer U> ? U : never;

export function makeSafePromise<T>(
  promise: Promise<T>,
): Promise<Result<T, ErrorUnknown>> {
  return promise
    .then((value) => resultSuccess(value))
    .catch((error) => resultError.unknown(error.message));
}