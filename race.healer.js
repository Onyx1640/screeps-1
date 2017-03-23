/**
 * Created by Piers on 04/08/2016.
 */
/**
 * @fileOverview Screeps module. Abstract base object containing data and
 * functions for infantry creeps.
 * @author Piers Shepperson
 */
"use strict";
/**
 * Abstract base object containing data and functions for use by my infantry
 * creeps. Infantry contain mainly "ATTACK" and "MOVE" parts.
 * @module raceHealer
 */
var raceHealer = {
    BLOCKSIZE: 250 + 50,
    BLOCKSIZE_PARTS: 2,

    body: function (heal, move) {
        var body = [];
        if (!move) move = heal;
        for (var i = 0 ; i < move ; i++) {
            body.push(MOVE);
        } // for
        for (i = 0 ; i < heal ; i++) {
            body.push(HEAL);
        } // for
        return body;
    },

    maxSize: function (room) {
        return Math.min(25, Math.floor(room.energyCapacityAvailable/this.BLOCKSIZE));
    },

    energyFromSize: function (size) {
        return size * this.BLOCKSIZE;
    },

};

module.exports = raceHealer;