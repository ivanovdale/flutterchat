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

// --------------------------------------------- USER MESSAGES ---------------------------------------------


/**
 * Client emits this to validate the user.
 *
 * inData
 *   { userName : "", password : "" }
 *
 * Callback
 *   { status : "ok|fail|created" }
 * Broadcast (only if status=created)
 *   newUser <the users collection>
 */
io.on("validate", (inData, inCallback) => {

    console.log("\n\nMSG: validate");

    console.log(`inData = ${JSON.stringify(inData)}`);

    const user = users[inData.userName];
    console.log(`user = ${JSON.stringify(user)}`);
    if (user) {
        if (user.password === inData.password) {
            console.log("User logged in");
            inCallback({ status: "ok" });
        } else {
            console.log("Password incorrect");
            inCallback({ status: "fail" });
        }
    } else {
        console.log("User created");
        console.log(`users = ${JSON.stringify(users)}`);
        users[inData.userName] = inData;
        console.log(`users = ${JSON.stringify(users)}`);
        // noinspection JSUnresolvedVariable
        io.broadcast.emit("newUser", users);
        inCallback({ status: "created" });
    }

}); /* End validate handler. */


// --------------------------------------------- ROOM MESSAGES ---------------------------------------------


/**
 * Client emits this to get a list of rooms.
 *
 * inData
 *   { }
 *
 * Callback
 *   <the rooms collection>
 */
io.on("listRooms", (inData, inCallback) => {

    console.log("\n\nMSG: listRooms", rooms);

    console.log("Returning: " + JSON.stringify(rooms));
    inCallback(rooms);

}); /* End listRooms handler. */

/**
 * Client emits this to create a room.
 *
 * inData
 *   { roomName : "", description : "", maxPeople : 99, private : true|false, creator : "" }
 *
 * If roomName not already in use:
 *   Broadcast
 *     created <the rooms collection>
 *   Callback
 *     { status : "created", rooms : <the rooms collection> }
 *
 * If room name is already in use:
 *   Callback
 *     { status : "exists" }
 *
 */
io.on("create", (inData, inCallback) => {

    console.log("\n\nMSG: create", inData);

    // noinspection JSUnresolvedVariable
    if (rooms[inData.roomName]) {
        console.log("Room already exists");
        inCallback({ status: "exists" });
    } else {
        console.log("Creating room");
        inData.users = {};
        console.log(`inData: ${JSON.stringify(inData)}`);
        console.log(`rooms = ${JSON.stringify(rooms)}`);
        rooms[inData.roomName] = inData;
        console.log(`rooms = ${JSON.stringify(rooms)}`);
        // noinspection JSUnresolvedVariable
        io.broadcast.emit("created", rooms);
        inCallback({ status: "created", rooms: rooms });
    }

}); /* End create handler. */