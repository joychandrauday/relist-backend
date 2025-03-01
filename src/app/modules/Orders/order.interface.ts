import { ObjectId } from 'mongodb';

export type IOrder = {
    user: ObjectId; // reference to the user who placed the order
    products: {
        productId: ObjectId; // reference to the product
        quantity: number; // quantity of the product ordered
        price: number; // price per unit of the product
        totalPrice: number; // total price for this product (quantity * price)
    }[];
    amount: number; // total price of the order (sum of all products' totalPrice)
    shippingAddress: string;
    paymentStatus: string; // e.g., 'Pending', 'Completed', 'Failed'
    orderStatus: string; // e.g., 'Processing', 'Shipped', 'Delivered', 'Cancelled'
    orderDate: Date; // the date when the order was placed
    transaction: {
        id: string,
        code: number,
        message: string,
        status: string,
        method: string,
        bank_status: string,
        date_time: string,
    },
    estimatedDeliveryDate?: Date; // optional, estimated delivery date
};