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

export function deleteMetadataById(metadataId: number): Promise<string> {
  return api
    .delete(`/metadata/delete/${metadataId}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function addNewMetadata(metadata: IMetadata): Promise<IMetadata> {
  return api
    .post(`/metadata/create`, metadata)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function getMetadataById(id: number): Promise<IMetadata> {
  return api
    .get(`/metadata/get/${id}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}
