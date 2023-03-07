import Client, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

export type Message = {
  sender: String;
  message: String;
  image: String;
  senderId: String;
  messageId: String;
};