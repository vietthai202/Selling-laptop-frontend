import { IMetadata } from "./metadatagroup";

export interface IProduct {
  id: number;
  userName: string;
  title: string;
  metaTitle: string;
  slug: string;
  summary: string;
  image: string | null;
  sku: string;
  metadataDtoSet?: IMetadata[];
  price: number;
  discount: number;
  quantity: number;
  categoryId: number;
  brandId: number;
}
