export interface IMetadataGroup {
  id: number;
  name: string;
  metadataDtoSet: IMetadata[];
}

export interface IMetadata {
  id: number;
  icon: string;
  title: string;
  content: string;
  laptop_id: number;
  group_id: number;
}
