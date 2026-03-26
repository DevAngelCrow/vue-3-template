export interface RolByIdResponse {
  id: number;
  name: string;
  description: string;
  code: string;
  status: {
    id: number;
    name: string;
    description: string;
  };
  permissions: {
    id: number;
    name: string;
    description: string;
    active: boolean;
  }[];
}
