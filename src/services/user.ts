import { AxiosResponse, AxiosError } from "axios";
import api from "./api";
import { IUser } from "../types/auth";

export function getAllUser(): Promise<IUser[]> {
  return api
    .get(`/listuser`)
    .then((response: AxiosResponse) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Get failed");
    });
}
