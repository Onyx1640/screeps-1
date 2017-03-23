/**
 * Created by Piers on 22/07/2016.
 */
/**
 * @fileOverview Screeps module. Task harvest object.
 * @author Piers Shepperson
 */
"use strict";
var gc = require("gc");
var tasks = require("tasks");
var TaskFlexiLink = require("task.flexi.link");

/**
 * Task harvest object.
 * @module TaskLinkerDump
 */


function TaskLinkerDump (flagName) {
    this.taskType = gc.TASK_LINKER_DUMP;
    this.conflicts = gc.HARVEST;
    this.flagName = flagName;
    this.pickup = true;
    this.loop = true;
}

TaskLinkerDump.prototype.doTask = function(creep, task) {
  //  console.log("creep","taskLinkerDump");
    var flag = Game.flags[task.flagName];
    var source =  Game.getObjectById(task.flagName);
    if (!source) return TaskFlexiLink.prototype.help(creep, task);
    var resultS = creep.harvest(source);
   // console.log(creep,"taslinkerdump result",resultS, source);

    var dump = Game.getObjectById(flag.memory.mainDumpId);
    if (!dump)  {
        return TaskFlexiLink.prototype.resetState(creep, task);
    }

    var result = creep.transfer(dump, flag.memory.resourceType);
   // console.log(creep,"reault of transfer",result,dump, flag.memory.resourceType,"result of harverst",resultS);

    return gc.RESULT_UNFINISHED;
};

module.exports = TaskLinkerDump;






































