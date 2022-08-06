import { MatchMakingError, TErr_InvalidParam } from "../../error";
import { Room } from "../Room/Room";
import { Team } from "../Team/Team";
import { TUserId, TUserInfo, TUserConfig, IUser } from "./user.types";

export class User implements IUser {
  
  private readonly _userId: TUserId;
  private _userInfo: TUserInfo;
  private readonly _config: TUserConfig;
  private _lobbyTeam: Team;
  private _room: Room | null;
  private _readyToJoinRoom: boolean;
  
  constructor ( userId: TUserId, userInfo: TUserInfo, userConfig: TUserConfig  ) {
    this._userId = userId;
    this._userInfo = userInfo;
    this._config = userConfig;
    this._lobbyTeam = new Team( this._config.maxUserInTeam );
    this._lobbyTeam.addUser( this );
    this._room = null;
    this._readyToJoinRoom = false;
  }
  
  get userId () { return this._userId; }

  get userInfo () { return this._userInfo;  }
  set userInfo ( userInfo: TUserInfo ) { this._userInfo = userInfo; }
  
  get lobbyTeam (): Team { return this._lobbyTeam; }
  set lobbyTeam ( newLobbyTeam: Team | null ) {

    if ( !( newLobbyTeam instanceof Team ) && newLobbyTeam !== null )
      throw errObj.INVALID_PARAM( "newLobbyTeam", `${Team} | ${null}`, newLobbyTeam );
    
    if ( this._lobbyTeam === newLobbyTeam ) return;
    
    // if "newLobbyTeam" is "null" then leave current lobby team and join the new team
    // ( Note: user must always be in a lobbyTeam )
    if ( newLobbyTeam === null )
      newLobbyTeam = new Team( this._config.maxUserInTeam );

    newLobbyTeam.addUser( this );
    this._lobbyTeam.delUser( this );
    this._lobbyTeam = newLobbyTeam;

  }

  get room(): Room | null { return this._room; }
  set room( newRoom: Room | null ) {
    if ( this._room && this._room !== newRoom )
      this._room.leaveRoom( this );
    this._room = newRoom;
  }

  callback_onRoomJoined( joinedRoom: Room ): void {
    this.room = joinedRoom;
  }
  
  callback_onRoomLeft( leftRoom: Room ): void {
    if ( this._room !== leftRoom ) return;
    this._room = null;
  }
    
}

const errObj = {
  
  INVALID_PARAM: ( paramName: string, expected: any, received: any ): MatchMakingError => {
    const errData: TErr_InvalidParam = {
      code: "INVALID_PARAM",
      msg: `${paramName}: Expected Value: ${expected}, Received Value: ${received}`,
      info: { paramName, expected, received }
    }
    return new MatchMakingError( errData );
  },

}
