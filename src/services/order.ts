import { AxiosError, AxiosResponse } from "axios";
import { IOrder } from "../types/order";
import api from "./api";

export function createOrder(order: IOrder): Promise<IOrder> {
  return api
    .post("/orders/createOrder", order)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function getOrderByUserName(userName: string): Promise<any> {
  return api
    .get(`/orders/getOrder/${userName}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}
