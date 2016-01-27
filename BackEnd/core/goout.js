'use strict';

/**
 * Created by guillaume on 18/01/2016.
 */

/**
 * This class contains all we need when people go out.
 */
class GoOut {

    constructor (){
        this._users = [];
    }

    get users (){
        return this._users;
    }

    addUser (user){
        this.users.push(user);
    }

}

module.exports = GoOut;