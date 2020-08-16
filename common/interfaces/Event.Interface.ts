import { IUser } from "./User.Interface";

export interface IEvent {
  type: string;
  format: string;
  attending: Pick<IUser, "email" | "discordId" | "name" | "steam64Id">;
  link: string;
  time: Date;
}
