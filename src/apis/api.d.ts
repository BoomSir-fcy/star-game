declare namespace Api {
  interface Error {
    code: number;
    msg: string;
    message: string;
  }

  interface Response<T> {
    code: number;
    msg: string;
    message: string;
    data: T;
  }
}
