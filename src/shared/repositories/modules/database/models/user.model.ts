import { Schema, model } from "mongoose";

export interface IUser {
    _id?: string;
    name: string;
    email_address: string;
    password: string;
    updatedAt?: Date;
    createdAt?: Date;
    accessToken?: string;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
  },
  email_address: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: new Date()
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  accessToken: {
    type: String
  },
});

export const UserModel = model("User", UserSchema)

