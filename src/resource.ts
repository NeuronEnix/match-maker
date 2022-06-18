import { RoomManager } from "./lib/RoomManger";
import { UserManager } from "./lib/UserManager";

export const userManager = new UserManager({ maxUserInTeam: 4 });
export const roomManager = new RoomManager({ maxTeam: 2, maxUserPerTeam: 4, spreadUserAcrossTeam: true });