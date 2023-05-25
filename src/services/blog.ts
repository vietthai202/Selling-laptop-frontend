import { AxiosError, AxiosResponse } from "axios";
import api from "./api";
import { IBlog } from "../types/blog";

export function getAllBlog(): Promise<IBlog[]> {
  return api
    .get("/blogs")
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function getBlogBySlug(slug: string): Promise<IBlog> {
  return api
    .get(`/blog/${slug}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function deleteBlog(blogid: string): Promise<string> {
  return api
    .delete(`/deleteBl/${blogid}`)
    .then((response: AxiosResponse) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Delete failed");
    });
}

export function createBlog(blog: IBlog): Promise<string> {
  return api
    .post(`/createBlog`, { userName: blog.userName, name: blog.name, content: blog.content, image: blog.image, slug: blog.slug, categoryId: blog.categoryId, shortContent: blog.shortContent })
    .then((response: AxiosResponse) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Create failed");
    });
}

export function updateBlog(blog: IBlog): Promise<string> {
  return api
    .post(`/updateBl/${blog.id}`, { userName: blog.userName, name: blog.name, content: blog.content, image: blog.image, slug: blog.slug, categoryId: blog.categoryId, shortContent: blog.shortContent })
    .then((response: AxiosResponse) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Create failed");
    });
}
