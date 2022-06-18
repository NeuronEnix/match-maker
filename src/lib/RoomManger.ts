import { TRoomId, Room } from "./Room";
import { Team } from "./Team";

export type TRoomManagerConfig = {
  maxTeam: number;
  maxUserPerTeam: number;
  spreadUserAcrossTeam: boolean;
}

export class RoomManager {

  private _roomMap: Map< TRoomId, Room >;
  private _config: TRoomManagerConfig;

  constructor ( config: TRoomManagerConfig ) {
    
    this._roomMap = new Map< TRoomId, Room >();

    this._config = config;
    
  }

  addTeam( teamToBeAdded: Team ) : Room {
    const roomItr = this._roomMap.values();

    // try to add to existing room
    while ( true ) {
      const { value: room, done } = roomItr.next();
      if( done ) break;
      if ( !room.hasVacancy( teamToBeAdded.userCount ) ) continue;
      room.addTeam( teamToBeAdded );
      return room;
    }

    // will come here if we cannot add team to room
    // therefore create a new room and add the team to it
    const newRoom = new Room( this._config );
    newRoom.addTeam( teamToBeAdded );
    return newRoom;

  }
  
  getUser( userId: TRoomId) : Room | undefined {
    return this._roomMap.get( userId );
  }

  delRoom( room: Room ) : void {
    this._roomMap.delete( room.roomId );
  }
  
  delUser( room: Room ) : boolean {
    return  this._roomMap.delete( room.roomId );
  }

}

