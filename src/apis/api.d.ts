declare namespace Api {
  interface Error {
    code: number;
    msg: string;
  }

  interface Response<T> {
    code: number;
    msg: string;
    message: string;
    data: T;
  }
}
