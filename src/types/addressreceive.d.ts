export interface IRA{
    id: string;
    name: string;
    phone: string;
    address: string;
    user_id: number;
    defaultaddress: boolean;
}

export interface IAddressReceive {
    id?: string;
    name: string;
    phone: string;
    address: string;
    user_id: number;
    defaultaddress: boolean;
    token: string;
    userName: string;
}