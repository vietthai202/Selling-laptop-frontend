import { AxiosError, AxiosResponse } from "axios";
import api from "./api";
import { IMetadataGroup } from "../types/metadatagroup";

export function getMetadataWithMetadataGroup(slug: string): Promise<IMetadataGroup[]> {
  return api
    .get(`/metadatagroup/${slug}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}
