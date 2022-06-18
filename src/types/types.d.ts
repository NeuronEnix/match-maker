export type TUserId = number;
export type TUserInfo = {
  userName: string;
}

export type TGroupId = number;
export type TGroupConfig = {
  maxUser: number;
}

export type TRoomId = number;
export type TRoomConfig = {
  maxGroup: number;
  maxUserPerGroup: number;
  spreadUserAcrossGroup: boolean;
}
export type TRoomTracker = {
  userCount: number;
}