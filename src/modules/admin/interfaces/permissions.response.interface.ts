export interface PermissionsResponse {
  data: {
    name: string;
    description: string;
    active: boolean;
    show: boolean;
  }[];
  statusCode: number;
}
