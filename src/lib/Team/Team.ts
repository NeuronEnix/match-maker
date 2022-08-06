import { MatchMakingError, TErr_NotEnoughVacancy, TErr_EmptyUserList, TErr_NotAUserInstance } from "../../error";
import { IdGenerator } from "../IdGenerator";
import { TUserId } from "../User/user.types";
import { User } from "../User/User";

const temIdGen = new IdGenerator();

export type TTeamConfig = {
  maxUser: number;
}


export class Team {

  private readonly _teamId: number;
  private readonly _config: TTeamConfig;

  private _leader: User | null = null;
  private _userMap: Map< TUserId, User > = new Map< TUserId, User >();
  
  constructor ( maxUser: number  ) {
    this._teamId = temIdGen.newId;
    this._config = { maxUser };
  }

  get teamId() : number {
    return this._teamId;
  }
  get leader() : User | null {
    return this._leader;
  }
  get size() : number {
    return this._userMap.size;
  }

  hasVacancy() : number;
  hasVacancy( count: number) : boolean;
  hasVacancy( count: number | void ) : boolean | number {
    const availableVacancy = this._config.maxUser - this._userMap.size;
    if ( count === undefined ) return availableVacancy;
    return this._config.maxUser - this._userMap.size >= count;
  }

  addUser( user: User ) : Team {

    if ( !(user instanceof User) ) throw errObj.NOT_A_USER_INSTANCE( user );
          
    if ( !this.hasVacancy(1) ) 
      throw errObj.NOT_ENOUGH_VACANCY( this._config.maxUser, this.size, 1 );

    if ( this._userMap.size == 0 ) this._leader = user;
    this._userMap.set( user.userId, user );
    
    return this;
  }
  
  getUserById( userId: TUserId ) : User | undefined {
    return this._userMap.get( userId );
  }
  getUserList() : User[] {
    return Array.from( this._userMap.values() );
  }
  getUserIterator() : IterableIterator<User> {
    return this._userMap.values();
  }
  
  delUser( user: User ) : void {
    if ( !(user instanceof User) ) throw errObj.NOT_A_USER_INSTANCE( user );
    if ( this._userMap.size === 0 ) return;
    
    if ( user == this._leader ) this._leader = null;
    this._userMap.delete( user.userId )
    
    // if leader was deleted from the team then assign some other user as a leader
    if ( this._leader === null && this._userMap.size ) {
      const leastRecentlyAddedUser = this._userMap.values().next().value;
      this._leader = leastRecentlyAddedUser;
    }
  }

  // iterators
  forEach( cb:( user: User ) => void ) : void {
    this._userMap.forEach( cb );
  }
  map( cb:( user: User ) => any ): any[] {
    const arr: any[] = [];
    this._userMap.forEach( user => arr.push( cb(user) ) )
    return arr;
  }

}

const errObj = {
  
  EMPTY_USER_LIST: (): MatchMakingError => {
    const errData: TErr_EmptyUserList = {
      code: "EMPTY_USER_LIST",
      info: {},
      msg: "Pass at least 1 user",
    }
    return new MatchMakingError( errData );
  },

  NOT_ENOUGH_VACANCY: ( maxSlot: number, occupiedSlot: number, requiredSlot: number ): MatchMakingError => {
    const errData: TErr_NotEnoughVacancy = {
      code: "NOT_ENOUGH_VACANCY",
      info: { maxSlot, occupiedSlot, requiredSlot },
      msg: `Occupied: ${occupiedSlot}/${maxSlot}, Required: ${requiredSlot}`
    }
    return new MatchMakingError( errData );
  },

  NOT_A_USER_INSTANCE: ( provided: any ): MatchMakingError => {
    const errData: TErr_NotAUserInstance = {
      code: "NOT_A_USER_INSTANCE",
      msg: `Expected User Instance, but provided ${provided}`,
      info: { provided }
    }
    return new MatchMakingError( errData );
  },

}
