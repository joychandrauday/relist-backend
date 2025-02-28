// 5.Model
import { model, Schema } from "mongoose"
import { IUser } from "./user.interface"


const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    status: { type: String, default: "active" },
    avatar: { type: String, default: 'https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg', required: false },
    paymentMethods: [
      {
        type: { type: String, required: true },
        provider: { type: String, required: true },
        accountNumber: { type: String, required: true },
        expiryDate: { type: String, required: true },
      }
    ],
    cart: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      }
    ],
  },
  { timestamps: true }
)

export const userModel = model<IUser>('User', userSchema)
