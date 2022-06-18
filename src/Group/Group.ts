import { TUserId, TGroupConfig } from "../types/types";
import { User } from "../User/User";
let groupIdAutoInc = 1;
export class Group {

  private readonly _groupId: number;
  private _leader: User | null;
  private _userMap: Map< TUserId, User >;
  private readonly _config: TGroupConfig;
  
  constructor ( maxUser: number  ) {
    this._groupId = groupIdAutoInc++;
    this._userMap = new Map< TUserId, User >();
    this._config = { maxUser };
    this._leader = null;
  }

  get groupId() : number {
    return this._groupId;
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
    users.forEach( user => this._userMap.set( user.userId, user ) );
    
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
    users.forEach( user => this._userMap.delete( user.userId ) );
  }
  

}

