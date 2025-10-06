export interface UserStateStore {
  id: number;
  id_people: number;
  user_name: string;
  id_status: number;
  is_validated: boolean;
}

export interface Token {
  access_token: string;
}

export interface Menu {
  id: number;
  name: string;
  description: string;
  icon: string;
  uri: string;
  show: boolean;
  order: number;
  parent: Menu[];
  children: Menu[];
  requiredAuth: boolean;
  title: string;
  active: boolean;
  is_open: boolean;
  label: string;
  isUser: boolean;
}
