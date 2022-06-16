import { User } from "../User/User";

export class Party {

  private _leader: User;
  private _userMap: Map< TUserId, User >;
  
  constructor ( user: User  ) {
    this._userMap = new Map< TUserId, User >();
    this._leader = user;
  }

  get leader() : User {
    return this._leader;
  }

  addUser( user: User ) : Party {
    this._userMap.set( user.userId, user );
    return this;
  }
  
  getUser( userId: TUserId) : User | undefined {
    return this._userMap.get( userId );
  }

  getLeader() : User | undefined {
    return this._userMap.get( this._leader.userId );
  }
  
  delUser( user: User ) : boolean {
    return  this._userMap.delete( user.userId );
  }

}

