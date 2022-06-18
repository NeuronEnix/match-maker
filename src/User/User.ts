import { TUserId, TUserInfo } from "../types/types";
export class User {

  private _userId: TUserId;
  private _userInfo: TUserInfo;
  
  constructor ( userId: TUserId, userInfo: TUserInfo ) {
    this._userId = userId;
    this._userInfo = userInfo;
  }

  get userId () { return this._userId; }
  get userInfo () { return this._userInfo;  }
  set userInfo ( userInfo: TUserInfo ) { this._userInfo = userInfo; }

}