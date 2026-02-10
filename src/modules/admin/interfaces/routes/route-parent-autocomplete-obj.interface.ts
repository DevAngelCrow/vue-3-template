export interface RouteParentAutocomplete {
  data: {
    title: string;
    id: number;
    uri: string;
    parent: object;
    name: string;
  }[];
  statusCode: number;
}
