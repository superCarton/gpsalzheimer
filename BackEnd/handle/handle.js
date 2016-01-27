/**
 * Created by guillaume on 27/01/2016.
 */

var Goout  = require('../core/core.js'),
    User   = require('../core/user.js'),
    tablet = require('../sockets/tablet.js');

var goout = new Goout();

/**
 * This function get the variable goout.
 * @returns {Goout} The goout variable.
 */
var getGoout = function () {
    return goout;
};

/**
 * This function add a user.
 * @returns {User} The added user.
 */
var addUser = function () {
    var user = new User();
    getGoout().addUser(user);
    return user;
};

/**
 * This function updates the gps data of a user.
 * @param {int} id - The user's id.
 * @param {number} lat - The user's latitude.
 * @param {number} long - The user's longitude.
 */
var gpsData = function (id, lat, long) {
    if (getGoout().gpsData(id, lat, long)) {
        console.log('data updated');
        tablet.updateGpsData(getGoout().users);
    }
    else {
        console.error('An error occured');
    }
};

module.exports = {
    addUser: addUser,
    gpsData: gpsData
};