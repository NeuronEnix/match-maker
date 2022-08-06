import { User } from "./User";
import { TUserInfo, TUserId } from "./user.types";

type TUserManagerConfig = {
  maxUserInTeam: number;
};
export class UserManager {

  private _userMap: Map< TUserId, User > = new Map< TUserId, User >();
  private readonly _config: TUserManagerConfig;

  constructor( userManagerConfig: TUserManagerConfig ) {
    this._config = userManagerConfig;
  }

  get size() { return this._userMap.size; }
  
  addUser( userId: TUserId, userInfo: TUserInfo ): User {
    const userExist = this._userMap.get( userId );
    if ( userExist ) {
      userExist.userInfo = userInfo;
      return userExist;
    }
    const newUser = new User( userId, userInfo, { maxUserInTeam: this._config.maxUserInTeam } );
    this._userMap.set( userId, newUser );
    return newUser;
  }

  getUser( userId: TUserId ): User | undefined {
    return this._userMap.get( userId );
  }

  delUser( userId: TUserId ): boolean {
    const user = this.getUser( userId );
    if ( !user ) return false;
    user.room = null;
    user.lobbyTeam = null;
    return this._userMap.delete( userId );
  }

  // iterator
  
  forEach( cb: ( user: User ) => void ) : void {
    this._userMap.forEach( cb );
  }
  
  map( cb:( user: User ) => any ): any[] {
    const arr: any[] = [];
    this._userMap.forEach( user => arr.push( cb(user) ) )
    return arr;
  }
}

