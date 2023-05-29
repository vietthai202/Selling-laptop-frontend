import { message } from "antd";
import { AxiosError, AxiosResponse } from "axios";
import { IRegister, IUser } from "../types/auth";
import api from "./api";

export function login(username: string, password: string): Promise<string> {
  return api
    .post("/login", { username, password })
    .then((response: AxiosResponse) => {
      const token: string = response.data.token;
      const role: string = response.data.userRole;
      const username: string = response.data.username;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Login failed");
    });
}

export function register(userInfo: IRegister): Promise<boolean> {
  return api
    .post("/register", {
      name: userInfo.name,
      email: userInfo.email,
      username: userInfo.username,
      password: userInfo.password,
      dateOfBirth: userInfo.dateOfBirth,
      address: userInfo.address,
      phone: userInfo.phone,
    })
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      const errorData: any = error.response?.data;
      message.error(errorData.message);
      throw new Error("Register failed");
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

export function isLoggedIn(): boolean {
  const token = localStorage.getItem("token");
  return !!token;
}

export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
}
