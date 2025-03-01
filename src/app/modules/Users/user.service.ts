// 4.service

import { IUser } from "./user.interface"
import { userModel } from "./user.model"

// get all users
const getUsers = async () => {
  const users = await userModel.find()
  return users
}
// edit a user
const editUser = async (id: string, updatedUser: Partial<IUser>) => {
  const user = await userModel.findByIdAndUpdate(id, updatedUser, { new: true })
  return user
}
// get single user by email
const getSingleUser = async (identifier: string) => {
  if (!identifier) {
    throw new Error('No identifier provided')
  }

  // Populate 'cart' with 'name' and 'price' fields from the Product model
  const user = await userModel.findById(identifier)
  return user;
}
// get single user by email
const getSingleUserById = async (identifier: string) => {
  if (!identifier) {
    throw new Error('No identifier provided')
  }

  // Populate 'cart' with 'name' and 'price' fields from the Product model
  const user = await userModel.findOne({ email: identifier })// You can specify more fields if necessary

  return user;
}

// de;et user by id

const deleteUser = async (id: string) => {
  const user = await userModel.findByIdAndDelete(id)
  return user;
}
// sending all to controller
export const userService = {
  getUsers,
  editUser,
  deleteUser,
  getSingleUser,
  getSingleUserById,
}
