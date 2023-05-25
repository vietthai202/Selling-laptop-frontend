import { AxiosError, AxiosResponse } from "axios";
import api from "./api";
import { IBlogCategory } from "../types/blogCategory";

export function getAllBlogCategory(): Promise<IBlogCategory[]> {
  return api
    .get("/blogcategories")
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function getBlogCategoryById(id: string): Promise<IBlogCategory> {
  return api
    .get(`/blogcategories/${id}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function deleteBlogCategoryById(id: string): Promise<IBlogCategory> {
  return api
    .delete(`/blogcategories/${id}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function updateBlogCategoryById(blogCate: IBlogCategory): Promise<string> {
  return api
    .put(`/blogcategories/${blogCate.id}`, { name: blogCate.name, content: blogCate.content })
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function createCategory(data: IBlogCategory): Promise<IBlogCategory> {
  return api
    .post("/blogcategory", { name: data.name, content: data.content })
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}
