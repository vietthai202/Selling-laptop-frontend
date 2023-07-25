import { AxiosError, AxiosResponse } from "axios";
import { IProductImage } from "../types/productImage";
import api from "./api";

export function getProductImage(productId: number): Promise<IProductImage[]> {
  return api
    .get(`/laptop-img/list/${productId}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function createMultipleProductImage(image: IProductImage): Promise<void> {
  return api
    .post(`/laptop-img/create-multiple`, image)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}
