import { TRoomId, TRoomConfig } from "../types/types";

import { Group } from "../Group/Group";
import { Room } from "./Room";


export class RoomManager {

  private _roomMap: Map< TRoomId, Room >;
  private _config: TRoomConfig;

  constructor ( maxGroup: number, maxUserPerGroup: number, spreadUserAcrossGroup: boolean  ) {
    
    this._roomMap = new Map< TRoomId, Room >();

    this._config = { maxGroup, maxUserPerGroup, spreadUserAcrossGroup };
    
  }

  addGroup( groupToBeAdded: Group ) : Room {
    const roomItr = this._roomMap.values();

    // try to add to existing room
    while ( true ) {
      const { value: room, done } = roomItr.next();
      if( done ) break;
      if ( !room.hasVacancy( groupToBeAdded.userCount ) ) continue;
      room.addGroup( groupToBeAdded );
      return room;
    }

    // will come here if we cannot add group to room
    // therefore create a new room and add the group to it
    const newRoom = new Room( this._config.maxGroup, this._config.maxUserPerGroup, this._config.spreadUserAcrossGroup );
    newRoom.addGroup( groupToBeAdded );
    return newRoom;

  }
  
  getUser( userId: TRoomId) : Room | undefined {
    return this._roomMap.get( userId );
  }
  
  delUser( room: Room ) : boolean {
    return  this._roomMap.delete( room.roomId );
  }

}

