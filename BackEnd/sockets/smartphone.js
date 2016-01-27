/**
 * Created by guillaume on 18/01/2016.
 */

var io     = require("../core/core.js").getIO(),
    handle = require('../handle/handle.js');

// Route for the smartphone socket.
//var smartphoneSocket = io.of('/gpsalzheimer/smartphone');
var smartphoneSocket = io.of('/smartphone');

smartphoneSocket.on('connect', function (socket) {
    console.log('connected');

    /////////////////////////////////            Base Socket Events                    /////////////////////////////////

    socket.on('disconnect', disconnect);

    socket.on('error', error);

    socket.on('reconnect', reconnect);

    socket.on('reconnect_attempt', reconnectAttempt);

    socket.on('reconnecting', reconnecting);

    socket.on('reconnect_error', reconnectError);

    socket.on('reconnect_failed', reconnectFailed);

    /////////////////////////////////             GPS Socket Events                    /////////////////////////////////

    socket.on('connectable', connectable);

    socket.on('disconnectable', disconnectable);

    socket.on('gpsData', gpsData);

    socket.on('frequencyData', frequencyData);

    /////////////////////////////////         Callbacks Base Socket Events             /////////////////////////////////

    function disconnect () {
        console.log("Smartphone disconnected for Root namespace");
    }

    function error (errorData) {
        console.log("An error occurred during Smartphone connection for Root namespace");
        console.error(errorData);
    }

    function reconnect (attemptNumber) {
        console.log("Smartphone Connection for Root namespace after " + attemptNumber + " attempts.");
    }

    function reconnectAttempt () {
        console.log("Smartphone reconnect attempt for Root namespace");
    }

    function reconnecting (attemptNumber) {
        console.log("Smartphone Reconnection for Root namespace - Attempt number " + attemptNumber);
    }

    function reconnectError (errorData) {
        console.log("An error occurred during Smartphone reconnection for Root namespace");
        console.error(errorData);
    }

    function reconnectFailed () {
        console.log("Failed to reconnect Smartphone for Root namespace. No new attempt will be done.")
    }

    /////////////////////////////////          Callback GPS Socket Events              /////////////////////////////////

    /**
     * This function aimed to connect a user.
     * It triggers the 'connectionAchieved' event.
     * @param params
     */
    function connectable (params) {
        console.log('connecté');
        var user = handle.addUser();
        socket.emit('connectionAchieved', {id: user.id, color: user.color});
    }

    /**
     * This function aimed to disconnect a user.
     * It triggers the 'disconnectionAchieved' event.
     * @param params
     */
    function disconnectable (params) {
        console.log('deconnecté');
        handle.removeUser(params.id, function () {
            socket.emit('disconnectionAchieved', {});
        });
    }

    /**
     * This function aimed to get the gps datas.
     * @param params
     */
    function gpsData (params) {
        handle.gpsData(params.id, params.lat, params.long);
    }

    /**
     * This function aimed to get the frequency data.
     * @param params
     */
    function frequencyData (params) {
        handle.frequencyData(params.id, params.freq);
    }

});