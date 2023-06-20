import { AxiosError, AxiosResponse } from "axios";
import { IFAQs } from "../types/faqs";
import api from "./api";

export function createMultipleFAQ(listFAQ: IFAQs[], laptopId: number): Promise<string> {
  return api
    .post(`/faqs/create-multiple/${laptopId}`, listFAQ)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function getFAQByLaptopId(laptopId: number): Promise<IFAQs[]> {
  return api
    .get(`/faqs/lists/${laptopId}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function updateFAQById(faq: IFAQs): Promise<string> {
  return api
    .post(`/faqs/edit/${faq.id}`, faq)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function deleteFAQById(faqId: number): Promise<string> {
  return api
    .delete(`/faqs/delete/${faqId}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function createFAQ(faq: IFAQs): Promise<IFAQs> {
  return api
    .post(`/faqs/create`, faq)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}

export function getFAQById(id: number): Promise<IFAQs> {
  return api
    .get(`/faqs/getById/${id}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
}
