import axios, { AxiosError, AxiosResponse } from "axios";
import { IQRCode } from "../types/qrcode";

const api = axios.create({
  baseURL: "https://api.vietqr.io/v2/generate",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

export function generateQRCode(data: IQRCode): Promise<any> {
  return api
    .post("/", data)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Get failed");
    });
}
