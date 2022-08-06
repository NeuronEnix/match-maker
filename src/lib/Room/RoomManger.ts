import { Team } from "../Team/Team";
import { User } from "../User/User";
import { Room, TRoomConfig } from "./Room";

export type TRoomManagerConfig = {
  maxTeam: number;
  maxUserPerTeam: number;
  spreadUserAcrossTeam: boolean;
}

export class RoomManager {

  private _roomMap: Map< number, Room >;
  private _config: TRoomManagerConfig;
  private _room_config: TRoomConfig;

  constructor ( config: TRoomManagerConfig ) {
    
    this._roomMap = new Map< number, Room >();

    this._config = config;
    this._room_config = {
      maxTeam: this._config.maxTeam,
      maxUserPerTeam: this._config.maxUserPerTeam,
      spreadUserAcrossTeam: this._config.spreadUserAcrossTeam
    }
    
  }

  get size() {
    return this._roomMap.size;
  }

  joinRoom( lobbyTeam: Team ) : Room {
    const roomItr = this._roomMap.values();

    let roomToBeJoined: Room | null = null;

    // try to find an existing room which has enough space
    while ( true ) {
      const { value: room, done } = roomItr.next();
      if( done ) break;
      if ( room.hasVacancy( lobbyTeam.size ) ) {
        roomToBeJoined = room;
        break;
      }
    }

    // if no rooms were available, then create a new room
    if ( !roomToBeJoined ) {
      roomToBeJoined = new Room( this._room_config);
      this._roomMap.set( roomToBeJoined.roomId, roomToBeJoined );
    }
    roomToBeJoined.joinRoom( lobbyTeam );
    if ( roomToBeJoined.isFull ) { 
      // onRoomFull( roomToBeJoined, this );
      // this.delRoom( roomToBeJoined );
    }

    return roomToBeJoined;

  }

  getUser( userId: number) : Room | undefined {
    return this._roomMap.get( userId );
  }

  delRoom( room: Room ) : void {
    room.forceDrain();
    this._roomMap.delete( room.roomId );
  }
  
  delUser( room: Room ) : boolean {
    return  this._roomMap.delete( room.roomId );
  }

  // iterator
  forEach( cb: ( room: Room ) => void ) : void {
    this._roomMap.forEach( cb );
  }

  map( cb:( room: Room ) => any ): any[] {
    const arr: any[] = [];
    this._roomMap.forEach( room => arr.push( cb(room) ) )
    return arr;
  }


}

function onRoomFull( room: Room, roomManager: RoomManager ) {
  console.log( "RoomFull", { userCount: room.userCount, teamCount: room.teamCount }   );
  const userList: User[] = [];
  room.forEach( rt => rt.forEach( user => userList.push( user ) ) )

  // console.log( userList );
  setTimeout( () => {
    roomManager.delRoom( room );
  })
}
