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

export function getProductWithPage(pageNumber: number, listBrandId: string, listCategoryId: string, priceOrder: string, minPrice: number, maxPrice: number): Promise<any> {
  return api
    .get(`/laptop/products?pageNumber=${pageNumber}&listBrandId=${listBrandId}&categoryId=${listCategoryId}&priceOrder=${priceOrder}&minPrice=${minPrice}&maxPrice=${maxPrice}`)
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
