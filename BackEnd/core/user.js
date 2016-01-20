'use strict';

/**
 * Created by guillaume on 18/01/2016.
 */

var idGenerator      = require('./id.js')(),
    colorIdGenerator = require('./color.js')(),
    Position = require('./position.js');

/**
 * This class represent a user. The one that has the watch and the smartphone.
 */
class User {

    /**
     * The default constructor of a User.
     */
    constructor () {
        this._id    = idGenerator.next().value;
        this._color = colorIdGenerator.next().value % 7;
        this._position = new Position();
        this._frequency = 0;
    }

    /**
     * Getter of the id.
     * @returns {int} The user's id.
     */
    get id () {
        return this._id;
    }

    /**
     * Getter of the color.
     * @returns {number} The color id.
     */
    get color () {
        return this._color;
    }

    /**
     * Getter of the position.
     * @returns {Position} The user's position.
     */
    get position () {
        return this._position;
    }

    /**
     * Setter of the position.
     * @param {Position} newPos - The new user's position.
     */
    set position (newPos){
        this._position = newPos;
    }

    /**
     * Getter of the frequency.
     * @returns {int} The user's frequency.
     */
    get frequency () {
        return this._frequency;
    }

    /**
     * Setter of the frequency.
     * @param {int} newFrequency - The new user's frequency.
     */
    set frequency (newFrequency){
        this._frequency = newFrequency
    }

}

module.exports = User;