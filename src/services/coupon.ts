import { AxiosError, AxiosResponse } from "axios";
import api from "./api";
import { ICoupon } from "../types/coupon";
export function createCO(coupon:ICoupon): Promise<string> {
    return api
      .post(`/coupon/create`,coupon)
      .then((response: AxiosResponse) => {
        return response.data;
      })
      .catch((error: AxiosError) => {
        throw new Error("Fetch failed");
      });
  }
  export function updateCo(coupon:ICoupon): Promise<string> {
    return api
      .post(`/coupon/edit/${coupon.id}`,coupon)
      .then((response: AxiosResponse) => {
        return response.data;
      })
      .catch((error: AxiosError) => {
        throw new Error("Fetch failed");
      });
  }
  export function deleteCo(id:string): Promise<ICoupon[]> {
    return api
      .delete(`/coupon/delete/${id}`)
      .then((response: AxiosResponse) => {
        return response.data;
      })
      .catch((error: AxiosError) => {
        throw new Error("Fetch failed");
      });
  }

  export function getAllCo(): Promise<ICoupon[]> {
    return api
      .get(`/coupon/list`)
      .then((response: AxiosResponse) => {
        return response.data;
      })
      .catch((error: AxiosError) => {
        throw new Error("Fetch failed");
      });
    }
    
export function getCouponById(CouponId: string): Promise<ICoupon> {
  return api
    .get(`/coupon/get/${CouponId}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      throw new Error("Fetch failed");
    });
  }
  