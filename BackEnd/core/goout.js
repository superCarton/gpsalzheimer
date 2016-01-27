'use strict';

/**
 * Created by guillaume on 18/01/2016.
 */

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
     * This function aimed to update the position of a user.
     * @param {int} id - The user's id.
     * @param {number} lat - The user's latitude.
     * @param {number} long - The user's longitude.
     * @returns {boolean}
     */
    gpsData (id, lat, long) {
        for (var i = 0; i < this.users.length; i++) {
            if (i.id === id) {
                i.updatePosition(lat, long);
                return true;
            }
        }
        return false;
    }

}

module.exports = GoOut;