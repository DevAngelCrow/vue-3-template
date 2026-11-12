export interface UserStateStore {
  id: string;
  user_name: string;
  id_people?: number;
  id_status?: number;
  is_validated?: boolean;
}

export interface Token {
  access_token: string;
}

export interface Menu {
  id: string;
  name: string;
  description: string;
  icon: string;
  uri: string;
  show: boolean;
  order: number;
  id_parent?: string | null;
  parent: Menu | null;
  children: Menu[];
  required_auth: boolean;
  title: string;
  active: boolean;
}
