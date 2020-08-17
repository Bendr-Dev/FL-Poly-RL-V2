import { IUser } from "./User.Interface";

export interface IEvent {
  name: string;
  type: string;
  format: string;
  attending: Pick<
    IUser,
    "email" | "discordId" | "name" | "steam64Id" | "username"
  >[];
  uploader: Pick<
    IUser,
    "email" | "discordId" | "name" | "steam64Id" | "username"
  >;
  link: string;
  time: Date;
  isCompleted: boolean;
}
