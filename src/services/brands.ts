import { AxiosError, AxiosResponse } from "axios";
import api from "./api";
import { IBrand } from "../types/brand";

export function getAllBrands(): Promise<IBrand[]> {
  return api
    .get("/brands")
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function addBrand(brand: IBrand): Promise<string> {
  return api
    .post("/brand", { name: brand.name, description: brand.description, slug: brand.slug, image: brand.image })
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function editBrand(brand: IBrand): Promise<string> {
  return api
    .put(`/brands/${brand.id}`, brand)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function deleteBrand(brandId: string): Promise<string> {
  return api
    .delete(`/brands/${brandId}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function getBrandById(brandId: string): Promise<IBrand> {
  return api
    .get(`/brands/${brandId}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}
