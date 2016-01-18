'use strict';

/**
 * Created by guillaume on 18/01/2016.
 */

var idGenerator      = require('./id.js')(),
    colorIdGenerator = require('./color.js')();

/**
 * This class represent a user. The one that has the watch and the smartphone.
 */
class User {

    constructor () {
        this._id    = idGenerator.next().value;
        this._color = colorIdGenerator.next().value % 7;
    }

    get id () {
        return this._id;
    }

    get color () {
        return this._color;
    }

}

module.exports = User;