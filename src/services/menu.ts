import { AxiosError, AxiosResponse } from "axios";
import { IMenu, ISubMenu } from "../types/menu";
import api from "./api";

export function getAllMenu(menuType: string): Promise<IMenu[]> {
  return api
    .get(`/ui_menu/list/${menuType}`)
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

export function createMenu(menu: IMenu): Promise<string> {
  return api
    .post(`/ui_menu/create`, menu)
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

export function createSubMenu(menu: ISubMenu): Promise<string> {
  return api
    .post(`/ui_submenu/create`, menu)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function updateSubMenu(menu: ISubMenu): Promise<string> {
  return api
    .put(`/ui_submenu/update`, menu)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function deleteSubMenu(id: string): Promise<string> {
  return api
    .delete(`/ui_submenu/delete/${id}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}
