import { AxiosError, AxiosResponse } from "axios";
import api from "./api";
import { ISearch } from "../types/search";

export function getAllSearchData(keyword: string): Promise<ISearch[]> {
  return api
    .get(`/search?keyword=${keyword}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}
