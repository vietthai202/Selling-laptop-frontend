export interface IOrder {
  id: number;
  userId: number;
  totalPrice: number;
  status: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  line: string;
  city: string;
  province: string;
}

export interface IOrderItem {
  orderId: number;
  quantities: string;
  laptopIds: string;
}
