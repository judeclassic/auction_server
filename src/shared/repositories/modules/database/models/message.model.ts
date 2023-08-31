import { Schema, model } from "mongoose";
import { IMessage } from "../../../../types/request/message";

const MessageSchema = new Schema<IMessage>({
  userName: {
    type: String,
  },
  message: {
    type: String,
  },
  createdAt: {
    type: String,
  },
});

export const MessageModel = model("Message", MessageSchema);