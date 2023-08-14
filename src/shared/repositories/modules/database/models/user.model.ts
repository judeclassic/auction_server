import { Schema, model } from "mongoose";

export interface IUser {
    _id?: string;
    name: string;
    emailAddress: string;
    country?: string;
    password: string;
    updatedAt?: Date;
    createdAt?: Date;
    accessToken?: string;
    isVerified?: boolean;
    authenticationCode?: string;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
  },
  emailAddress: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
  },
  country: {
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
  authenticationCode: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false
  },
});

export const UserModel = model("User", UserSchema)

