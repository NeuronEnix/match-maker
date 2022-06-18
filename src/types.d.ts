type TUserId = number;
type TUserInfo = {
  userName: string;
}

type TGroupId = number;
type TGroupConfig = {
  maxUser: number;
}

type TRoomId = number;
type TRoomConfig = {
  maxGroup: number;
  maxUserPerGroup: number;
  spreadUserAcrossGroup: boolean;
}
type TRoomTracker = {
  userCount: number;
}