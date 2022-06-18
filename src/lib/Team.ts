import { TUserId, User } from "./User";
import { IdGenerator } from "./IdGenerator";

const temIdGen = new IdGenerator();

export type TTeamId = number;
export type TTeamConfig = {
  maxUser: number;
}

export class Team {

  private readonly _teamId: number;
  private _leader: User | null;
  private _userMap: Map< TUserId, User >;
  private readonly _config: TTeamConfig;
  
  constructor ( maxUser: number  ) {
    this._teamId = temIdGen.newId;
    this._userMap = new Map< TUserId, User >();
    this._config = { maxUser };
    this._leader = null;
  }

  get teamId() : number {
    return this._teamId;
  }
  get leader() : User | null {
    return this._leader;
  }
  get userCount() : number {
    return this._userMap.size;
  }
  hasVacancy( count: number | void ) : boolean | number {
    const availableVacancy = this._config.maxUser - this._userMap.size;
    if ( count === undefined ) return availableVacancy;
    return this._config.maxUser - this._userMap.size >= count;
  }

  addUser( ...users: User[] ) : boolean {
    
    if ( users.length == 0 ) return false;
    if ( !this.hasVacancy( users.length ) ) return false;

    if ( this._userMap.size == 0 ) this._leader = users[0];
    users.forEach( user => {
      this._userMap.set( user.userId, user );
    });
    
    return true;
  }
  
  getUserById( userId: TUserId) : User | undefined {
    return this._userMap.get( userId );
  }
  getUserList() : User[] {
    return Array.from( this._userMap.values() );
  }
  getUserIterator() : IterableIterator<User> {
    return this._userMap.values();
  }

  forEachUser( callbackFn: ( user: User ) => void ) {
    this._userMap.forEach( callbackFn );
  }
  
  delUser( ...users: User[] ) : void {

    users.forEach( user => {
      if ( user.userId === this.leader!.userId ) this._leader = null;
      this._userMap.delete( user.userId )
    });
    
    if( this._leader === null && this._userMap.size ) {
      const leastRecentlyAddedUser = this._userMap.values().next().value;
      this._leader = leastRecentlyAddedUser;
    }

  }

}

