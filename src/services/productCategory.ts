import { AxiosError, AxiosResponse } from "axios";
import api from "./api";
import { IProductCategory } from "../types/productCategory";

export function getAllProductCategories(): Promise<IProductCategory[]> {
  return api
    .get("/category/list")
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function addProductCategory(data: IProductCategory): Promise<IProductCategory> {
  return api
    .post("/category/create", { name: data.name, slug: data.slug, description: data.description, image: data.image })
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function editProductCategory(data: IProductCategory): Promise<string> {
  return api
    .post(`/category/edit/${data.id}`, data)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function deleteProductCategory(id: string): Promise<string> {
  return api
    .delete(`/category/delete/${id}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function getProductCategoryById(id: string): Promise<IProductCategory> {
  return api
    .get(`/category/getById/${id}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}
