import { AxiosResponse, AxiosError } from "axios";
import api from "./api";
import { IUser } from "../types/auth";

export function getAllUser(): Promise<IUser[]> {
  return api
    .get(`/user/list`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Get failed");
    });
}

export function deleteUser(username: string): Promise<string> {
  return api
    .delete(`/user/delete/${username}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Get failed");
    });
}

export function updateUser(username: string, userInfo: IUser): Promise<string> {
  return api
    .put(`/user/edit/${username}`, {
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
      address: userInfo.address,
      dateOfBirth: userInfo.dateOfBirth,
      userRole: userInfo.userRole,
      password: userInfo.password,
    })
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Get failed");
    });
}

export function updateProfile(token: string, userInfo: IUser): Promise<void> {
  return api
    .put(`/user/profileEdit/${token}`, {
      username: userInfo.username,
      name: userInfo.name,
      dateOfBirth: userInfo.dateOfBirth,
      address: userInfo.address,
    })
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Get failed");
    });
}

export function changePassword(token: string, oldPass: string, newPass: string): Promise<void> {
  return api
    .put(`/user/passwordEdit/${token}`, {
      newpass: newPass,
      oldpass: oldPass,
    })
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Get failed");
    });
}

export function createUser(userInfo: IUser): Promise<string> {
  return api
    .post("/user/create", {
      name: userInfo.name,
      username: userInfo.username,
      password: userInfo.password,
      email: userInfo.email,
      phone: userInfo.phone,
      address: userInfo.address,
      dateOfBirth: userInfo.dateOfBirth,
      userRole: userInfo.userRole,
    })
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Create failed");
    });
}

export function getUserInfo(username: string): Promise<IUser> {
  return api
    .get(`/user/get/${username}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Get failed");
    });
}
