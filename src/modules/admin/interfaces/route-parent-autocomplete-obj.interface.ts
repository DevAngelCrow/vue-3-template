export interface RouteParentAutocomplete {
  data: {
    title: string;
    id: number;
    uri: string;
    parent_route: object;
    name: string;
  }[];
  statusCode: number;
}
