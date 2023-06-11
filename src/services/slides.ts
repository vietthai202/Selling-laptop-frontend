import { AxiosError, AxiosResponse } from "axios";
import api from "./api";
import { ISlide } from "../types/slide";

export function getAllSlide(): Promise<ISlide[]> {
  return api
    .get("/slide/list")
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function addSlide(slide: ISlide): Promise<string> {
  return api
    .post("/slide/create", slide)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function editSlide(slide: ISlide): Promise<string> {
  return api
    .put(`/slide/edit/${slide.id}`, slide)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function deleteSlideabc(slideId: string): Promise<string> {
  return api
    .delete(`/slide/delete/${slideId}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function getSlideById(slideId: string): Promise<ISlide> {
  return api
    .get(`/slide/get/${slideId}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}
