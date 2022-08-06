import { TUserId } from "../User/user.types";
import { IdGenerator } from "../IdGenerator";
import { MatchMakingError, TErr_ActionDisallowed, TErr_InvalidParam, TErr_NotEnoughVacancy } from "../../error";
import { Team } from "../Team/Team";
import { User } from "../User/User";

const roomIdGen = new IdGenerator();

export type TRoomConfig = {
  maxTeam: number;
  maxUserPerTeam: number;
  spreadUserAcrossTeam: boolean;
}

type TRoomState = {
  isLive: boolean;
  allowToJoinAsLobbyTeam: boolean;
  allowToLeaveAsTeam: boolean;
  allowToLeaveAsUser: boolean;
}

export class Room {

  private readonly _roomId: number;
  private readonly _config: TRoomConfig;
  private readonly _roomTeamList: Team[];
  private readonly _userIdMapToRoomTeam: Map<TUserId,Team>;
  private readonly _state: TRoomState;
  
  constructor ( config: TRoomConfig  ) {

    this._roomId = roomIdGen.newId;
    this._config = config;
    this._roomTeamList = [];
    for ( let i=0; i<this._config.maxTeam; i++ )
      this._roomTeamList.push( new Team( this._config.maxUserPerTeam ) );
    
    this._userIdMapToRoomTeam = new Map<TUserId,Team>();

    this._state = {
      isLive: false,
      allowToJoinAsLobbyTeam: true,
      allowToLeaveAsUser: false,
      allowToLeaveAsTeam: true,
    }
  }
  
  get roomId() : number { return this._roomId; }
  get userCount() : number { return this._userIdMapToRoomTeam.size; }
  get teamCount() : number { return this._roomTeamList.length; }
  get isFull() : boolean { return !this.hasVacancy(1); }

  private _addTeamBySpread_noCheck( teamToBeAdded: Team ) : void {

    // add users from team by spreading across team available in room whichever has vacancy
    const userItr = teamToBeAdded.getUserIterator();
    for ( const roomTeam of this._roomTeamList ) {

      while ( roomTeam.hasVacancy(1) ) {
        const { value: user, done } = userItr.next();
        if ( done ) return;
        this._userIdMapToRoomTeam.set( user.userId, roomTeam );
        roomTeam.addUser( user );
        user.callback_onRoomJoined( this );
      }
    }

  }

  private _addTeamRestrictedToOneRoomTeam_noCheck( teamToBeAdded: Team ) : void {
   
    // add users from 'teamToBeAdded' to any one single teamHeldBy room 
    for ( const roomTeam of this._roomTeamList ) {
      if ( !roomTeam.hasVacancy( teamToBeAdded.size ) ) continue;
      teamToBeAdded.forEach( user => {
        this._userIdMapToRoomTeam.set( user.userId, roomTeam );
        roomTeam.addUser( user );
        user.callback_onRoomJoined( this );
      })
    }
  }

  private _delUserFromRoomTeam_noCheck( user: User ): void {
    const userInRoomTeam = this._userIdMapToRoomTeam.get( user.userId );
    if ( userInRoomTeam ) {
      userInRoomTeam.delUser( user );
      this._userIdMapToRoomTeam.delete( user.userId );
      user.callback_onRoomLeft( this );
    }
  }
  
  joinRoom( teamToBeAdded: Team ) : boolean {

    // Param check
    if ( !this.hasVacancy( teamToBeAdded.size ) ) throw errObj.NOT_ENOUGH_VACANCY( this._config.maxUserPerTeam, this.userCount, teamToBeAdded.size );

    if ( this._config.spreadUserAcrossTeam )
      this._addTeamBySpread_noCheck( teamToBeAdded );
    else this._addTeamRestrictedToOneRoomTeam_noCheck( teamToBeAdded );

    return true;
    
  }

  hasVacancy( count: number ): boolean {
    if ( !Number.isInteger( count ) || count < 1 ) return false; 

    const remainingVacancy = this._config.maxTeam * this._config.maxUserPerTeam - this._userIdMapToRoomTeam.size;
    
    // Fast Check
    if ( remainingVacancy === 0 ) return false;
    if ( remainingVacancy < count ) return false;

    if ( this._config.spreadUserAcrossTeam )
      return remainingVacancy > 0;

    for ( const team of this._roomTeamList )
      if ( team.hasVacancy( count ) ) return true;

    return false;
  }

  leaveRoom( user: User ): void;
  leaveRoom( lobbyTeam: Team ): void;
  leaveRoom( obj: User | Team ): void {

    // Param Validation
    if ( !( obj instanceof User ) && !( obj instanceof Team ) )
      throw errObj.INVALID_PARAM( "obj", `${User} | ${Team}`, obj );
    
    // remove the given user if exists
    if ( obj instanceof User ) {
      if ( !this._state.allowToLeaveAsUser ) throw errObj.ACTION_DISALLOWED( "Cannot leave room as user" );
      return this._delUserFromRoomTeam_noCheck( obj );
    }
      
    if ( obj instanceof Team ) {
      if ( !this._state.allowToLeaveAsTeam ) throw errObj.ACTION_DISALLOWED( "Cannot leave room as lobby team" );
      const lobbyTeam = obj;
      lobbyTeam.forEach( user => this._delUserFromRoomTeam_noCheck( user ) );
    }
  }

  // iterators
  forEach( cb: ( roomTeam: Team ) => void ) : void {
    this._roomTeamList.forEach( cb );
  }
  
  map( cb:( roomTeam: Team ) => any ): any[] {
    const arr: any[] = [];
    this._roomTeamList.forEach( team => arr.push( cb(team) ) )
    return arr;
  }

  forceDrain(): void {
    this._state.allowToLeaveAsUser = true;
    this.forEach( rt => rt.forEach( user=> {
      this._delUserFromRoomTeam_noCheck( user );
    }))
  }


}

const errObj = {

  NOT_ENOUGH_VACANCY: ( maxSlot: number, occupiedSlot: number, requiredSlot: number ): MatchMakingError => {
    const errData: TErr_NotEnoughVacancy = {
      code: "NOT_ENOUGH_VACANCY",
      info: { maxSlot, occupiedSlot, requiredSlot },
      msg: `Occupied: ${occupiedSlot}/${maxSlot}, Required: ${requiredSlot}`
    };
    return new MatchMakingError( errData );
  },

  INVALID_PARAM: ( paramName: string, expected: any, received: any ): MatchMakingError => {
    const errData: TErr_InvalidParam = {
      code: "INVALID_PARAM",
      msg: `${paramName}: Expected Value: ${expected}, Received Value: ${received}`,
      info: { paramName, expected, received }
    }
    return new MatchMakingError( errData );
  },

  ACTION_DISALLOWED: ( msg: string ): MatchMakingError => {
    const errData: TErr_ActionDisallowed = {
      code: "ACTION_DISALLOWED",
      msg,
      info: {} ,
    }
    return new MatchMakingError( errData );
  }

}