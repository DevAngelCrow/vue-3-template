export interface ApiResponseMenu<T> {
  data: {
    items: T;
  };
  message: string;
  statusCode: number;
}
