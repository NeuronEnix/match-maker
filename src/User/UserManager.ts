import { User } from "./User";

export class UserManager {
  private _userMap: Map< TUserId, User >;
  constructor () {
    this._userMap = new Map();
  }
  addUser( userId: TUserId, userInfo: TUserInfo ): UserManager {
    const user = new User( userId, userInfo );
    this._userMap.set( userId, user );
    return this;
  }
  getUser( userId: TUserId ): User | undefined {
    return this._userMap.get( userId );
  }
  delUser( userId: TUserId ): boolean {
    return this._userMap.delete( userId );
  }

}

