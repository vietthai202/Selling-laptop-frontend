import { AxiosError, AxiosResponse } from "axios";
import { IOrderItem } from "../types/order";
import api from "./api";

export function createOrderItems(orderItem: IOrderItem): Promise<string> {
  return api
    .post("/orders/create-mul-order-item", orderItem)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}
