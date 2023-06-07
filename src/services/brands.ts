import { AxiosError, AxiosResponse } from "axios";
import api from "./api";
import { IBrand } from "../types/brand";

export function getAllBrands(): Promise<IBrand[]> {
  return api
    .get("/brand/list")
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function addBrand(brand: IBrand): Promise<IBrand> {
  return api
    .post("/brand/create", { name: brand.name, description: brand.description, slug: brand.slug, image: brand.image })
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function editBrand(brand: IBrand): Promise<string> {
  return api
    .put(`/brand/edit/${brand.id}`, brand)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function deleteBrand(brandId: string): Promise<string> {
  return api
    .delete(`/brand/delete/${brandId}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function getBrandById(brandId: string): Promise<IBrand> {
  return api
    .get(`/brand/getById/${brandId}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}
