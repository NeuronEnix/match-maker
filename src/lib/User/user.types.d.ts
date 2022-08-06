import { Room } from "../Room/Room";

export type TUserId = number | string;
export type TUserInfo = any;

export type TUserConfig = {
  maxUserInTeam: number
};

interface IUser {
  userId: TUserId;
  userInfo: TUserInfo;
  lobbyTeam: LobbyTeam | null;
  room: Room | null;
}