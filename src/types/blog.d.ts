export interface IBlog {
  id?: string;
  userName: string;
  name: string;
  content: string;
  image: string | null;
  createdAt: string;
  shortContent: string;
  slug: string;
  categoryId: number;
}
