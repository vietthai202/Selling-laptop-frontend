import { AxiosError, AxiosResponse } from "axios";
import api from "./api";
import { IMetadata } from "../types/metadatagroup";

export function createMultipleMetadata(listMetadata: IMetadata[], laptopId: number): Promise<string> {
  return api
    .post(`/metadata/create-multiple/${laptopId}`, listMetadata)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}
