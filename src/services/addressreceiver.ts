import { AxiosError, AxiosResponse } from "axios";
import api from "./api";
import { IAddressReceive, IRA } from "../types/addressreceive";

export function createReceive(receive: IRA): Promise<IRA> {
  return api
    .post("/receive/create", receive)
    .then((response: AxiosResponse) => {
      console.log(response);
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function getReceiver(userId: number): Promise<any> {
  return api
    .get(`/receive/getByUserId/${userId}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function getReceiverById(id: number): Promise<IRA> {
  return api
    .get(`/receive/get/${id}`)
    .then((response: AxiosResponse) => {
      console.log(response)
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function deleteReceiver(id: string): Promise<string> {
  return api
    .delete(`/receive/delete/${id}`)
    .then((response: AxiosResponse) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Delete failed");
    });
}

export function updateReceiver(userInfo: IAddressReceive): Promise<void> {
  return api
    .put(`/receive/edit`, userInfo)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Get failed");
    });
}

export function updateReceiverByDefaulAddress(id:number): Promise<void> {
  return api
    .put(`/receive/update/${id}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Get failed");
    });
}