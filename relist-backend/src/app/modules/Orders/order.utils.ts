/* eslint-disable @typescript-eslint/no-explicit-any */
import Shurjopay, { VerificationResponse } from "shurjopay";
import config from "../../config";

const shurjopay = new Shurjopay()


shurjopay.config(
    config.sp_endpoint!,
    config.sp_username!,
    config.sp_password!,
    config.sp_prefix!,
    config.return_url!,
)
const makePayment = async (paymentPayload: any) => {
    return new Promise((resolve, reject) => {
        shurjopay.makePayment(
            paymentPayload,
            (response) => resolve(response),
            (error) => reject(error)
        )
    })
    // const paymentResult = await shurjopay.makePayment(paymentPayload, (response) => console.log(response), (error) => console.log(error))
    // return paymentResult;
}
const verifyPayment = async (
    sp_trxn_id: string
): Promise<VerificationResponse[]> => {
    return new Promise((resolve, reject) => {
        shurjopay.verifyPayment(
            sp_trxn_id,
            (response) => resolve(response),
            (error) => reject(error)
        );
    });
};

export const orderUtils = {
    makePayment,
    verifyPayment
}