import { AxiosError, AxiosResponse } from "axios";
import { IProduct } from "../types/product";
import api from "./api";

export function getAllProduct(): Promise<IProduct[]> {
  return api
    .get("/laptops")
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function getProductBySlug(slug: string): Promise<IProduct> {
  return api
    .get(`/laptops/${slug}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}
