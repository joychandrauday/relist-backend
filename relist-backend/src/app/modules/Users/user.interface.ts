// User Model:
export interface IUser {
    name: string;
    email: string;
    password: string;
    role: string;
    status: string;
    avatar: string;
    paymentMethods: IPaymentMethod[];
    cart: ICart[];
}
export interface ICart {
    productId: string;
    quantity: number;
    price: number;
    totalPrice: number;
}
export interface IPaymentMethod {
    type: string;
    provider: string;
    accountNumber: string;
    expiryDate: string;
}