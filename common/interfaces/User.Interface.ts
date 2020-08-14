export interface IUser {
  _id?: string;
  username: string;
  email: string;
  name: string;
  steam64Id: string;
  discordId: string;
  role:
    | Set<"Guest" | "Player" | "Coach" | "Manager" | "Admin">
    | Array<"Guest" | "Player" | "Coach" | "Manager" | "Admin">;
  password?: string;
}
