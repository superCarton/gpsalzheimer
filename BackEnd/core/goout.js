'use strict';

/**
 * Created by guillaume on 18/01/2016.
 */

var Position = require('./position.js'),
    User     = require('./user.js');

/**
 * This class contains all we need when people go out.
 */
class GoOut {

    /**
     * Ths default constructor of the Goout class.
     */
    constructor () {
        this._users = [];
    }

    /**
     * Getter of the user array.
     * @returns {Array} The user array.
     */
    get users () {
        return this._users;
    }

    /**
     * This function aimed to add an user.
     * @param {User} user - The user to add.
     */
    addUser (user) {
        this.users.push(user);
    }

    /**
     * This function aimed to remove an user.
     * @param {int} id - The user's id.
     * @param {function} callback - The callback function to be triggered when the user has been removed.
     * @param {function} callback2 - The callback function to be triggered when there are no users anymore.
     */
    removeUser (id, callback, callback2) {
        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].id === id) {
                this.users.splice(i, 1);
                callback();
            }
        }
        if (this.users.length === 0) {
            callback2();
        }
    }

    /**
     * This function aimed to update the user's position.
     * @param {int} id - The user's id.
     * @param {number} lat - The user's latitude.
     * @param {number} long - The user's longitude.
     * @returns {boolean} True if the position has been updated, else false.
     */
    gpsData (id, lat, long) {
        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].id === id) {
                this.users[i].position = new Position(lat, long);
                return true;
            }
        }
        return false;
    }

    /**
     * This function aimed to update the user's frequency.
     * @param {int} id - The user's id.
     * @param {int} freq - The user's frequency.
     * @returns {boolean} True if the frequency has been updated, else false.
     */
    frequencyData (id, freq) {
        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].id === id) {
                this.users[i].frequency = freq;
                return true;
            }
        }
        return false;
    }

}

module.exports = GoOut;