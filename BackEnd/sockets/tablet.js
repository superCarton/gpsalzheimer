/**
 * Created by guillaume on 18/01/2016.
 */

var io = require("../core/core.js").getIO();

// Route for the smartphone socket.
var tabletSocket = io.of('/tablet');

tabletSocket.on('connect', function (socket) {
    socket.on('disconnect', disconnect);

    socket.on('error', error);

    socket.on('reconnect', reconnect);

    socket.on('reconnect_attempt', reconnectAttempt);

    socket.on('reconnecting', reconnecting);

    socket.on('reconnect_error', reconnectError);

    socket.on('reconnect_failed', reconnectFailed);
});

function disconnect () {
    console.log("Client disconnected for Root namespace : " + socket.id)
}

function error (errorData) {
    console.log("An error occurred during Client connection for Root namespace : " + socket.id);
    console.error(errorData);
}

function reconnect (attemptNumber) {
    console.log("Client Connection for Root namespace : " + socket.id + " after " + attemptNumber + " attempts.");
}

function reconnectAttempt () {
    console.log("Client reconnect attempt for Root namespace : " + socket.id);
}

function reconnecting (attemptNumber) {
    console.log("Client Reconnection for Root namespace : " + socket.id + " - Attempt number " + attemptNumber);
}

function reconnectError (errorData) {
    console.log("An error occurred during Client reconnection for Root namespace : " + socket.id);
    console.error(errorData);
}

function reconnectFailed () {
    console.log("Failed to reconnect Client for Root namespace : " + socket.id + ". No new attempt will be done.")
}

module.exports = tabletSocket;