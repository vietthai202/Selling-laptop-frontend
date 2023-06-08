import { AxiosError, AxiosResponse } from "axios";
import { IProduct } from "../types/product";
import api from "./api";

export function getAllProduct(): Promise<IProduct[]> {
  return api
    .get("/laptop/list")
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function getProductWithPage(pageNumber: number, brandName: string): Promise<any> {
  return api
    .get(`/laptop/products?pageNumber=${pageNumber}&brandName=${brandName}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function getProductBySlug(slug: string): Promise<IProduct> {
  return api
    .get(`/laptop/get/${slug}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function createProduct(product: IProduct): Promise<number> {
  return api
    .post("/laptop/create", product)
    .then((response: AxiosResponse) => {
      console.log(response);
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function updateProduct(product: IProduct): Promise<any> {
  return api
    .put(`/laptop/edit/${product.id}`, product)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}
