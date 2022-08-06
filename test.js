function log( data ) {
  if ( typeof data === "object" ) console.log( "%o", data );
  else console.log( data );
  
}
const axios = require ("axios").default;
const url = "http://localhost:3001"
const api = {
  user : {
    view: async data => axios.get( url+"/user/view" ),
    add: async data => axios.post( url+"/user/add", data ),
    del: async data => axios.post( url+"/user/del", data ),
  },
  team: {
    joinTeam: async data => axios.post( url+"/team/join", data ),
    leaveTeam: async data => axios.post( url+"/team/leave", data ),
  },
  room: {
    view: async data => axios.get( url+"/room/view"  ),
    joinRoom: async data => axios.post( url+"/room/join", data ),
  }
}

const userList = [];
for ( let i=0; i<=17; ++i ) {
  userList.push({
    userId: i,
    userInfo : {
      userName: "u"+i,
    }
  })
}

async function addAllUser( ) {
  for( const user of userList ) {
    const data = (await api.user.add( user )).data;
    // log( data );
  }
}

async function delAllUser( ) {
  for( const user of userList ) {
    const data = (await api.user.del( user )).data;
    // log( data );
  }
}

async function joinUserToLobby( mainUser, userToBeJoinedList=[] ) {
  for( const user of userToBeJoinedList ) {
    const data = (await api.team.joinTeam({ joinToTeamOfUserId: mainUser.userId, userIdWhoWantsToJoin: user.userId })).data 
    log( data );
  }
}

async function joinUserToRoom( user ) {
  for( const user of userToBeJoinedList ) {
    const data = (await api.room.joinRoom({ userId: user.userId })).data 
    log( data );
  }
}

async function userView() {
  const res = ( await api.user.view() ).data;
  log( res.data );
  return res.data;
}

async function roomView() {
  const res = ( await api.room.view() ).data;
  log( res.data );
  return res.data;
}



async function run() {
  try {
    console.time("userAdd");
    const maxUser = 10e3/2;
    const pmList = []
    for( let i=0; i<maxUser; ++i ) {
      const p = api.user.add({ userId: i, userInfo : { userName: "u"+i } })
      pmList.push( p );
    }
    await Promise.all( pmList )
    console.timeEnd( "userAdd" );
    await userView();
    await roomView();
    return;

    await addAllUser();
    await delAllUser();
    await addAllUser();

    await joinUserToLobby( userList[0], userList.filter( user => [1,2,3].includes( user.userId ) ) );
    await joinUserToLobby( userList[0], userList.filter( user => [1,2,3].includes( user.userId ) ) );
    await joinUserToLobby( userList[4], userList.filter( user => [5,6,7].includes( user.userId ) ) );
    
    try {
      const data = await joinUserToLobby( userList[0], userList.filter( user => [4].includes( user.userId ) ) )
      throw data;
    } catch( err ) {
      if ( err.response?.data ) console.log( "ExpectedErr", err.response?.data );
      else console.log( "UnexpectedErr", err );
    }

    await joinUserToLobby( userList[0], userList.filter( user => [1,2,3].includes( user.userId ) ) );
    await api.room.joinRoom( { userId: userList[0].userId } )
    await api.room.joinRoom( { userId: userList[4].userId } )

    await userView();
    await roomView();

    
    
    // api.team.joinTeam({ joinToTeamOfUserId: userList[0].userId, userIdWhoWantsToJoin: user.userId } )



    // for ( const user of userList )
    //   log( (await api.user.add( user )).data );

    // await joinTeam();

    // for ( const user of userList ) {
    //   const res = await api.team.leaveTeam({leavingUserId: user.userId })
    //   log( res.data );
    // }

    // await joinTeam();
    // for ( let i=0; i<2; ++i ) {
    //   const user = userList[ i ];
    //   await api.room.joinRoom( { userId: user.userId } )
    // }
    // for ( const user of userList ) {
    //   await api.room.joinRoom( { userId: user.userId } )
    // }
    
  } catch ( err ) {
    if ( err.response?.data ) console.log( "UnexpectedErr", err.response?.data );
    else console.log( "UnexpectedErr", err );
  }


  
};

async function joinTeam() {
  for ( let i=0; i<4; ++i ) {
    const res = await api.team.joinTeam({
      joinToTeamOfUserId: 0,
      userIdWhoWantsToJoin: userList[i].userId,
    })
    console.log( res.data );
  }
  for ( let i=4; i<8; ++i ) {
    const res = await api.team.joinTeam({
      joinToTeamOfUserId: 4,
      userIdWhoWantsToJoin: userList[i].userId,
    })
    console.log( res.data );
  }
  try {
    const tryToJoinTeam = await api.team.joinTeam({
      joinToTeamOfUserId: 0,
      userIdWhoWantsToJoin: userList[8].userId,
    })
  } catch ( err ) {
    console.log( err.response.data );
  }
  try {
    const tryToJoinTeam = await api.team.joinTeam({
      joinToTeamOfUserId: 4,
      userIdWhoWantsToJoin: userList[9].userId,
    })
  } catch ( err ) {
    console.log( err.response.data );
  }

  for ( let i=8; i<=10; ++i ) {
    const res = await api.team.joinTeam({
      joinToTeamOfUserId: 8,
      userIdWhoWantsToJoin: userList[i].userId,
    })
    console.log( res.data );
  }
}

run().catch(  );
