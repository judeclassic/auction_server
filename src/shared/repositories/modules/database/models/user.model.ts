import { Schema, model, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface IUser {
    _id?: string;
    name: string;
    username: string;
    email_address: string;
    password: string;
    updatedAt?: Date;
    isBanned: boolean;
    createdAt?: Date;
    accessToken?: string;
    authenticationCode?: string;
}
export interface IMultipleUser {
  users: IUser[];
  total_users: number;
  has_next: boolean;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
  },
  username: {
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
  isBanned: {
    type: Boolean
  },
  authenticationCode: {
    type: String
  },
});

UserSchema.plugin(mongoosePaginate);

export const UserModel = model<IUser, PaginateModel<IUser>>("User", UserSchema);