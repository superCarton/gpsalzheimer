/**
 * Created by guillaume on 18/01/2016.
 */

var io = require("../core/core.js").getIO();

// Route for the smartphone socket.
var tabletSocket = io.of('/gpsalzheimer/tablet');

tabletSocket.on('connect', function (socket) {

    /////////////////////////////////            Base Socket Events                    /////////////////////////////////

    socket.on('disconnect', disconnect);

    socket.on('error', error);

    socket.on('reconnect', reconnect);

    socket.on('reconnect_attempt', reconnectAttempt);

    socket.on('reconnecting', reconnecting);

    socket.on('reconnect_error', reconnectError);

    socket.on('reconnect_failed', reconnectFailed);

    /////////////////////////////////             GPS Socket Events                    /////////////////////////////////

    /////////////////////////////////         Callbacks Base Socket Events             /////////////////////////////////

    function disconnect () {
        console.log("Client disconnected for Root namespace");
    }

    function error (errorData) {
        console.log("An error occurred during Client connection for Root namespace");
        console.error(errorData);
    }

    function reconnect (attemptNumber) {
        console.log("Client Connection for Root namespace after " + attemptNumber + " attempts.");
    }

    function reconnectAttempt () {
        console.log("Client reconnect attempt for Root namespace");
    }

    function reconnecting (attemptNumber) {
        console.log("Client Reconnection for Root namespace - Attempt number " + attemptNumber);
    }

    function reconnectError (errorData) {
        console.log("An error occurred during Client reconnection for Root namespace");
        console.error(errorData);
    }

    function reconnectFailed () {
        console.log("Failed to reconnect Client for Root namespace. No new attempt will be done.")
    }

    /////////////////////////////////          Callback GPS Socket Events              /////////////////////////////////

});

/**
 * This function aimed to emit the users to the tablet.
 * @param {Array} array - The user array.
 */
function updateGpsData (array) {
    tabletSocket.emit('updateGpsData', {users: array});
}

module.exports = {
    updateGpsData: updateGpsData
};