export interface IRegister {
  name: string;
  email: string;
  username: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  password: string;
}

export interface IUser {
  id: number;
  name: string;
  password?: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  userRole: string;
  username: string;
  address: string;
  image: string;
}
