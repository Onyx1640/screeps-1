/**
 * Created by Piers on 11/08/2016.
 */
/**
 * Created by Piers on 02/08/2016.
 */
/**
 * Created by Piers on 17/07/2016.
 */
/**
 * Created by Piers on 12/07/2016.
 */
/**
 * @fileOverview Screeps module. Task move object.
 * @author Piers Shepperson
 */
"use strict";
var gc = require("gc");
var stats = require("stats");
var roleBase = require("role.base");
var raceWorker = require("race.worker");
/**
 * Task move object. Used when we need to find the object to move to.
 * @module RouteMiner
 */

function RouteMiner (roomName, mineId, resourceId, minePos, respawnRate, size, fast, defensive, healParts) {
    this.type = gc.ROUTE_MINER;
    this.role = gc.ROLE_MINER;
    this.roomName = roomName;
    this.mineId = mineId;
    this.resourceId = resourceId;
    this.minePos = minePos ? minePos : Game.getObjectById(mineId).pos;
    this.respawnRate = respawnRate ? respawnRate : CREEP_LIFE_TIME;
    this.fast = fast ? fast : (roomName != this.minePos.roomName);
    this.size = size ? size : raceWorker.maxSizeRoom(Game.rooms[roomName], this.fast);
    this.body = raceWorker.body(--this.size, this.fast);
    this.defensive = defensive ? defensive :  (roomName != this.minePos.roomName);
    this.healParts = healParts ? healParts : 0;
    //this.boostActions = [gc.HARVEST, gc.CAPACITY,gc.FATIGUE];
    this.due = 0;
}

RouteMiner.prototype.spawn = function (build, spawn) {
    //console.log("RouteMiner spawn", spawn, JSON.stringify(build));
    for ( var i = 0 ; i < build.healParts ; i++ ) {
        build.body.push(HEAL);
        build.body.unshift(MOVE);
    }
    var name = stats.createCreep(spawn, build.body, undefined, undefined);
    console.log(spawn,spawn.room,"try to build miner result",name)
    if (_.isString(name)) {
        console.log("Spawning miner",name);
        roleBase.switchRoles(
            Game.creeps[name],
            gc.ROLE_MINER,
            build.roomName,
            build.mineId,
            build.resourceId,
            build.minePos,
            build.defensive
        );
        Game.creeps[name].memory.buildReference = build.mineId;
    }
    return name;
};

RouteMiner.prototype.roleParameters  = function (build) {
    var parameters = [];
    parameters.push(build.roomName);
    parameters.push(build.mineId);
    parameters.push(build.resourceId);
    parameters.push(build.minePos);
    parameters.push(build.defensive);
    return  parameters;
};

RouteMiner.prototype.energyCost = function(build) {
    return raceWorker.energyFromSize(build.size, build.fast);
};

RouteMiner.prototype.parts = function(build) {
    if (build.body)
        return build.body.length;
    else
        return build.size * 2;
};

module.exports = RouteMiner;





















