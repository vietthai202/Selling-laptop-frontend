import { AxiosError, AxiosResponse } from "axios";
import api from "./api";
import { IMetadata, IMetadataGroup } from "../types/metadatagroup";

/**
 *
 * @param slug slug of laptop
 * @returns
 */
export function getMetadataWithMetadataGroup(slug: string): Promise<IMetadataGroup[]> {
  return api
    .get(`/metadata-group/get/${slug}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function getAllMetaDataGroup(): Promise<IMetadataGroup[]> {
  return api
    .get(`/metadata-group/list`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}
