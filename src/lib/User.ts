import { Team } from "./Team";

export type TUserId = number;
export type TUserInfo = {
  userName: string;
  userId: number;
};
export type TUserConfig = {
  maxUserInTeam: number
};

type TUserData = {
  userId: TUserId;
  userInfo: TUserInfo;
};
export class User {

  private readonly _userId: TUserId;
  private _userInfo: TUserInfo;
  private readonly _config: TUserConfig;
  private _team: Team;

  constructor ( userData: TUserData, userConfig: TUserConfig  ) {
    this._userId = userData.userId;
    this._userInfo = userData.userInfo;
    this._config = userConfig;
    this._team = new Team( this._config.maxUserInTeam );
    this._team.addUser( this );
  }

  get userId () { return this._userId; }

  get userInfo () { return this._userInfo;  }
  set userInfo ( userInfo: TUserInfo ) { this._userInfo = userInfo; }
  
  get team () { return this._team }
  set team ( teamToBeSet: Team ) { 
    this._team.delUser( this );
    this._team = teamToBeSet;
  }
  
  hasVacancyInMyTeam( count: number | void ) : number | boolean {
    return this._team.hasVacancy( count );
  }

  addUserToMyTeam( userToBeAdded: User ) : boolean {
    if ( !this._team.hasVacancy(1) ) return false;
    this._team.addUser( userToBeAdded );
    userToBeAdded.team = this._team;
    return true;
  }

}