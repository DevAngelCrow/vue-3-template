export interface ApiResponseMenu<T> {
  data: T;
  message: string;
  statusCode: number;
}
