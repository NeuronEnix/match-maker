import { RoomManager } from "./lib/Room/RoomManger";
import { UserManager } from "./lib/User/UserManager";

export const logicTime = {
  user: { add: 0 }
};
export const userManager = new UserManager({ maxUserInTeam: 4 });
export const roomManager = new RoomManager({ maxTeam: 2, maxUserPerTeam: 4, spreadUserAcrossTeam: true });