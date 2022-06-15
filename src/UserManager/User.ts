type TUserId = string;
type TMeta = {
  userName: string,
}

interface IUser {
  UserId: TUserId,
}

class User implements IUser {

  private _userId: TUserId;
  private _meta: TMeta;
  
  constructor ( userId: TUserId, meta: TMeta ) {
    this._userId = userId;
    this._meta = meta;
  }

  get UserId() {
    return this._userId;
  }
  set UserId( userId: TUserId ) {
    this._userId = userId;
  }

}

const user = new User( "1", {userName:""});
