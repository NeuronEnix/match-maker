import { User, TUserInfo, TUserId } from "./User";

type TUserManagerConfig = {
  maxUserInTeam: number;
};

export class UserManager {
  private _userMap: Map< number, User >;
  private readonly _config: TUserManagerConfig;
  constructor ( userManagerConfig: TUserManagerConfig ) {
    this._config = userManagerConfig;
    this._userMap = new Map();
  }
  
  addUser( userId: TUserId, userInfo: TUserInfo ): UserManager {
    const userExist = this._userMap.get( userId );
    if ( userExist ) userExist.userInfo = userInfo;
    this._userMap.set( userId, new User( {userId, userInfo}, { maxUserInTeam: this._config.maxUserInTeam } ) );
    return this;
  }

  getUser( userId: TUserId ): User | undefined {
    return this._userMap.get( userId );
  }
  delUser( userId: TUserId ): boolean {
    return this._userMap.delete( userId );
  }
}

