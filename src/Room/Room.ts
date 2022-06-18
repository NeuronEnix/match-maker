import { TUserId, TRoomId, TRoomConfig } from "../types/types";
import { Group } from "../Group/Group";

let roomId: TRoomId = 1;

export class Room {

  private readonly _roomId: TRoomId;
  private readonly _config: TRoomConfig;
  private readonly _groupList: Group[];
  private readonly _userIdMapToGroup: Map<TUserId,Group>;

  constructor ( maxGroup: number, maxUserPerGroup: number, spreadUserAcrossGroup: boolean  ) {

    this._roomId = roomId++;
    this._config = { maxGroup, maxUserPerGroup, spreadUserAcrossGroup };

    this._groupList = [];
    for ( let i=0; i<this._config.maxGroup; i++ )
      this._groupList.push( new Group( this._config.maxUserPerGroup ) );
    
    this._userIdMapToGroup = new Map<TUserId,Group>();
  }
  
  get roomId() : TRoomId {
    return this._roomId;
  }
  get userCount() : number {
    return this._userIdMapToGroup.size;
  }
  get groupCount() : number {
    return this._groupList.length;
  }
  private _addGroupBySpread_noCheck( groupToBeAdded: Group ) : void {

    // add users from group by spreading across groups available in room whichever has vacancy
    const userItr = groupToBeAdded.getUserIterator();
    for ( const roomGroup of this._groupList ) {
      for ( let i=0; i<roomGroup.hasVacancy(); ++i ) {
        const { value: user, done } = userItr.next();
        if ( done ) return;
        this._userIdMapToGroup.set( user.userId, roomGroup );
        roomGroup.addUser( user );
      }
    }

  }

  private _addGroupRestrictedToOneRoomGroup_noCheck( groupToBeAdded: Group ) : void {
   
    // add users from 'groupToBeAdded' to any one single groupHeldBy room 
    for ( const roomGroup of this._groupList ) {
      if ( !roomGroup.hasVacancy( groupToBeAdded.userCount ) ) continue;
      groupToBeAdded.forEachUser( user => {
        this._userIdMapToGroup.set( user.userId, roomGroup );
        roomGroup.addUser( user );
      })
    }
  }
  
  addGroup( groupToBeAdded: Group ) : boolean {

    // Param check
    if ( !this.hasVacancy( groupToBeAdded.userCount ) ) return false;

    if ( this._config.spreadUserAcrossGroup )
      this._addGroupBySpread_noCheck( groupToBeAdded );
    else this._addGroupRestrictedToOneRoomGroup_noCheck( groupToBeAdded );

    return true;
    
  }

  hasVacancy( count: number ) : boolean {
    if ( this._config.spreadUserAcrossGroup )
      return (this._config.maxGroup * this._config.maxUserPerGroup - this._userIdMapToGroup.size ) >= count;

    for ( const group of this._groupList )
      if ( group.hasVacancy( count ) ) return true;

    return false;
  }
    
  delUser( group: Group ) : void {
    group.forEachUser( user => {
      const userInRoomGroup = this._userIdMapToGroup.get( user.userId );
      if ( userInRoomGroup ) {
        userInRoomGroup.delUser( user );
        this._userIdMapToGroup.delete( user.userId );
      }
    })
  }

}

