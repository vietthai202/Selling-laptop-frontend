import { message } from "antd";
import { AxiosError, AxiosResponse } from "axios";
import { IRegister } from "../types/auth";
import api from "./api";

export function checkBankUpdate(): Promise<string> {
  return api
    .get("/check-bank/all")
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Login failed");
    });
}
