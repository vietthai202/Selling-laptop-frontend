import { AxiosResponse, AxiosError } from "axios";
import api from "./api";
import { IUser } from "../types/auth";

export function getAllUser(): Promise<IUser[]> {
  return api
    .get(`/users`)
    .then((response: AxiosResponse) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Get failed");
    });
}

export function deleteUser(username: string): Promise<string> {
  return api
    .post("/users/delete", { username })
    .then((response: AxiosResponse) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Get failed");
    });
}

export function updateUser(username: string, userInfo: IUser): Promise<string> {
  return api
    .put(`/users/update/${username}`, { userInfo })
    .then((response: AxiosResponse) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Get failed");
    });
}
