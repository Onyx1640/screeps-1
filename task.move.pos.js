/**
 * Created by Piers on 06/07/2016.
 */
/**
 * Created by Piers on 05/07/2016.
 */
/**
 * @fileOverview Screeps module. Task move object.
 * @author Piers Shepperson
 */
"use strict";
var gc = require("gc");
var TaskMoveXY = require("task.move.xy");
var TaskMoveRoom = require("task.move.room");
/**
 * Task move object. Used when we need to find the object to move to.
 * @module tasksHarvest
 */

function TaskMovePos (roomPos, range, pathOps, customMoveToFunction, functionModule, finsihCondition, finishModule) {
    this.taskType = gc.TASK_MOVE_POS;
    this.conflicts = gc.MOVE;
    this.roomPos = roomPos;
    if (range === undefined) {
        this.range = 0;
    } else {
        this.range =range;
    }
    this.pathOps = pathOps;
    this.customMoveToFunction = customMoveToFunction;
    this.functionModule = functionModule;
    this.finsihCondition = finsihCondition;
    this.finishModule = finishModule;
    this.heal = true;
    this.loop = true;
    this.pickup = true;
}

TaskMovePos.prototype.doTask = function(creep, task) {
    if (task.finsihCondition) {
        var module = require(task.finishModule);
        var rtv = module[task.finsihCondition](creep);
        if (rtv) return rtv;
    }
    if (task.startRoom === undefined) { //First call to function. Initialise data.
        task.startRoom = creep.room.name;
        if (undefined === task.roomPos) {
            console.log(creep,"position undefined in TaskMovePos");
            return gc.RESULT_FINISHED;
        }
        task.roomName = task.roomPos.roomName; // ToDP error
        task.x = task.roomPos.x;
        task.y = task.roomPos.y;
        task.pathIndex = 0;
    }
    if (undefined == task.roomPos)
        return gc.RESULT_FINISHED;
    task.roomName = task.roomPos.roomName;
    if (creep.room.name == task.roomPos.roomName
        && !TaskMoveRoom.prototype.atBorder(creep.pos.x,creep.pos.y)) {
        return TaskMoveXY.prototype.doTask(creep, task);
    }
    TaskMoveRoom.prototype.doTask(creep, task, task.customMoveToFunction, task.functionModule);
    return  gc.RESULT_UNFINISHED;
}



module.exports = TaskMovePos;




























