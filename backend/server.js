
//user functions for socket.io
const { addUser, removeUser, getUser } = require("./handlers/users");

//brings in app module
const app = require("./app")

//socket.io setup
const socketio = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketio(server);

//getting mongodb connection
const mongoDBConnection = require("./configuration/database");

//connecting to db
mongoDBConnection();

//port number
const Port = 5000;


//socket.io code integration at server side
io.on("connect", (socket) => {
  socket.on("join", ({ name, profile }, callback) => {

    if (name === null || profile === null) {
      return;
    }
//returns callback error
    const { error, user } = addUser({ id: socket.id, name, profile });

    if (error) return callback(error);

    callback();
  });

  //sends the message from sender to receiver
  socket.on("sendMessage", (chat) => {
    const message = {
      createdAt: Date.now(),
      text: chat.message,
      sender: chat.sender,
      receiver: chat.receiver,
    };
    let receiver = getUser(chat.receiver);
    console.log("Receiver", receiver);
    if (receiver) {
      const receiverSocket = receiver.id;

      io.to(`${receiverSocket}`).emit("message", message);
    }
    io.to(`${socket.id}`).emit("message", message);
  });

  //disconnects the socket.io
  socket.on("disconnect", () => {
    console.log(socket.id);
    const user = removeUser(socket.id);
  });
});

//runs server on port 5000
const serverRunning = server.listen(Port, () => {
  console.log(`Server Is Running On Port ${Port}`);
});
//handles any unhandled promisses
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
//closes server if error
  serverRunning.close(() => process.exit(1));
});
