// The collection of user descriptors currently known to the server, keyed by name.  Each element is:
//   userName : { userName : "", password : "" }
// noinspection JSUnusedLocalSymbols
const users = {};

// The collection of room descriptors of the current rooms on the server, keyed by name.  Each element is:
//   roomName : { roomName : "", description : "", maxPeople : 99, private : true|false,
//     creator : "",
//     users : [
//       userName : { userName : "" },
//       ...
//     ]
//   }
// noinspection JSUnusedLocalSymbols
const rooms = {};

// construct an HTTP server, wrapped in an Socket.IO server, and start it up.
const io = require("socket.io")(require("http").createServer(function () { }).listen(80));

// noinspection JSUnresolvedFunction
/**
 * Handle the socket connection event.  All other events must be hooked up inside this.
 */
io.on("connection", io => {


    console.log("\n\nConnection established with a client");
});