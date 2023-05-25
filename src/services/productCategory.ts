import { AxiosError, AxiosResponse } from "axios";
import api from "./api";
import { IProductCategory } from "../types/productCategory";

export function getAllProductCategories(): Promise<IProductCategory[]> {
  return api
    .get("/categories")
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function addProductCategory(data: IProductCategory): Promise<string> {
  return api
    .post("/creCategory", { name: data.name, slug: data.slug, image: data.image })
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function editProductCategory(data: IProductCategory): Promise<string> {
  return api
    .post(`/updateCategory/${data.id}`, data)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function deleteProductCategory(id: string): Promise<string> {
  return api
    .delete(`/delCategory/${id}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function getProductCategoryById(id: string): Promise<IProductCategory> {
  return api
    .get(`/categories/${id}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}
