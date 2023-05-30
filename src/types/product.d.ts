export interface IProduct {
  id: number;
  userName: string;
  title: string;
  metaTitle: string;
  slug: string;
  summary: string;
  image: string | null;
  sku: string;
  price: number;
  discount: number;
  quantity: number;
  categoryId: number;
  brandId: number;
}
