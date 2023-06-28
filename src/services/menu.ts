import { AxiosError, AxiosResponse } from "axios";
import { IMenu } from "../types/menu";
import api from "./api";

export function getAllMenu(): Promise<IMenu[]> {
  return api
    .get(`/ui_menu/list`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function updatePositions(listMenu: IMenu[]): Promise<string> {
  return api
    .put(`/ui_menu/updatePositions`, listMenu)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function updateMenu(menu: IMenu): Promise<string> {
  return api
    .put(`/ui_menu/update`, menu)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function deleteMenuById(id: string): Promise<string> {
  return api
    .delete(`/ui_menu/delete/${id}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}
