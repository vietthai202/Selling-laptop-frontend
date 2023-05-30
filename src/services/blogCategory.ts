import { AxiosError, AxiosResponse } from "axios";
import api from "./api";
import { IBlogCategory } from "../types/blogCategory";

export function getAllBlogCategory(): Promise<IBlogCategory[]> {
  return api
    .get("/blog-category/list")
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function getBlogCategoryById(id: string): Promise<IBlogCategory> {
  return api
    .get(`/blog-category/get/${id}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function deleteBlogCategoryById(id: string): Promise<IBlogCategory> {
  return api
    .delete(`/blog-category/delete/${id}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function updateBlogCategoryById(blogCate: IBlogCategory): Promise<string> {
  return api
    .put(`/blog-category/edit/${blogCate.id}`, { name: blogCate.name, content: blogCate.content })
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function createCategory(data: IBlogCategory): Promise<IBlogCategory> {
  return api
    .post("/blog-category/create", { name: data.name, content: data.content })
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}
