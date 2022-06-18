import { TUserId } from "./User";
import { Team } from "./Team";
import { IdGenerator } from "./IdGenerator";

const roomIdGen = new IdGenerator();

export type TRoomId = number;
export type TRoomConfig = {
  maxTeam: number;
  maxUserPerTeam: number;
  spreadUserAcrossTeam: boolean;
}

export class Room {

  private readonly _roomId: TRoomId;
  private readonly _config: TRoomConfig;
  private readonly _teamList: Team[];
  private readonly _userIdMapToTeam: Map<TUserId,Team>;
  
  constructor ( config: TRoomConfig  ) {

    this._roomId = roomIdGen.newId;
    this._config = config;
    this._teamList = [];
    for ( let i=0; i<this._config.maxTeam; i++ )
      this._teamList.push( new Team( this._config.maxUserPerTeam ) );
    
    this._userIdMapToTeam = new Map<TUserId,Team>();
  }
  
  get roomId() : TRoomId {
    return this._roomId;
  }
  get userCount() : number {
    return this._userIdMapToTeam.size;
  }
  get teamCount() : number {
    return this._teamList.length;
  }
  get isFull() : boolean {
    return this.hasVacancy(1);
  }
  private _addTeamBySpread_noCheck( teamToBeAdded: Team ) : void {

    // add users from team by spreading across team available in room whichever has vacancy
    const userItr = teamToBeAdded.getUserIterator();
    for ( const roomTeam of this._teamList ) {
      for ( let i=0; i<roomTeam.hasVacancy(); ++i ) {
        const { value: user, done } = userItr.next();
        if ( done ) return;
        this._userIdMapToTeam.set( user.userId, roomTeam );
        roomTeam.addUser( user );
      }
    }

  }

  private _addTeamRestrictedToOneRoomTeam_noCheck( teamToBeAdded: Team ) : void {
   
    // add users from 'teamToBeAdded' to any one single teamHeldBy room 
    for ( const roomTeam of this._teamList ) {
      if ( !roomTeam.hasVacancy( teamToBeAdded.userCount ) ) continue;
      teamToBeAdded.forEachUser( user => {
        this._userIdMapToTeam.set( user.userId, roomTeam );
        roomTeam.addUser( user );
      })
    }
  }
  
  addTeam( teamToBeAdded: Team ) : boolean {

    // Param check
    if ( !this.hasVacancy( teamToBeAdded.userCount ) ) return false;

    if ( this._config.spreadUserAcrossTeam )
      this._addTeamBySpread_noCheck( teamToBeAdded );
    else this._addTeamRestrictedToOneRoomTeam_noCheck( teamToBeAdded );

    return true;
    
  }

  hasVacancy( count: number ) : boolean {
    if ( count < 1 ) return false; 

    const remainingVacancy = this._config.maxTeam * this._config.maxUserPerTeam - this._userIdMapToTeam.size;
    
    // Fast Check
    if ( remainingVacancy === 0 ) return false;
    if ( remainingVacancy < count ) return false;

    if ( this._config.spreadUserAcrossTeam )
      return remainingVacancy > 0;

    for ( const team of this._teamList )
      if ( team.hasVacancy( count ) ) return true;

    return false;
  }
    
  delUser( team: Team ) : void {
    team.forEachUser( user => {
      const userInRoomTeam = this._userIdMapToTeam.get( user.userId );
      if ( userInRoomTeam ) {
        userInRoomTeam.delUser( user );
        this._userIdMapToTeam.delete( user.userId );
      }
    })
  }

}

