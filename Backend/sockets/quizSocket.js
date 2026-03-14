export const quizSocket = (io) => {

  const rooms = {};

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    // HOST CREATES ROOM
    socket.on("createRoom", () => {

      const roomCode = Math.random().toString(36).substring(2,7).toUpperCase();

      rooms[roomCode] = {
        players: [],
        questionIndex: 0
      };

      socket.join(roomCode);

      socket.emit("roomCreated", roomCode);

      console.log("Room created:", roomCode);
    });


    // PLAYER JOINS ROOM
    socket.on("joinRoom", ({name, roomCode}) => {

      if(!rooms[roomCode]) return;

      const player = {
        id: socket.id,
        name,
        score: 0
      };

      rooms[roomCode].players.push(player);

      socket.join(roomCode);

      io.to(roomCode).emit("playersUpdated", rooms[roomCode].players);

      console.log(name,"joined",roomCode);
    });

  });

};