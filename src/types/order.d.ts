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
  transactions?: ITransaction[];
}

export interface IOrderItem {
  orderId: number;
  quantities: string;
  laptopIds: string;
}

export interface ITransaction {
  id: number;
  content: string;
  orderId: number;
  status: string;
  updatedAt: string;
  createdAt: string;
  userId: number;
}
