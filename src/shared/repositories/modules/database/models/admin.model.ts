import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface IAdmin {
    _id?: string;
    name: string;
    username: string;
    email_address: string;
    password: string;
    updatedAt?: Date;
    createdAt?: Date;
    accessToken?: string;
    authenticationCode?: string;
}

const AdminSchema = new Schema<IAdmin>({
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
  authenticationCode: {
    type: String
  },
});

export const AdminModel = model<IAdmin>("Admin", AdminSchema);
