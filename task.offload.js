/**
 * Created by Piers on 05/07/2016.
 */
/**
 * @fileOverview Screeps module. Task offload object.
 * @author Piers Shepperson
 */
var gc = require("gc");

var stats = require("stats");

/**
 * Task base object.
 * @module tasksHarvest
 */

function TaskOffload (offloadMethod, resource,  amount, canUseAlternative, targetId) {
    this.taskType = gc.TASK_OFFLOAD;
    this.conflicts = offloadMethod;
    this.offloadMethod = offloadMethod;
    if (offloadMethod == TaskOffload.Build
        || offloadMethod == TaskOffload.Repair
        || offloadMethod == TaskOffload.Upgrade)
    {
        this.resource = RESOURCE_ENERGY;
        this.amount = undefined;
    } else {
        this.resource = resource ? resource : RESOURCE_ENERGY;
        this.amount = amount;
    }
    this.loop = true;
    this.pickup = true;
    this.targetId = targetId;
    this.canUseAlternative = canUseAlternative;
    this.dropOnFull = undefined;
}

TaskOffload.prototype.offloadMethod = {
    Build: "build",
    Drop: "drop",
    Repair: "repair",
    Transfer: "transfer",
    Upgrade: "upgrade"
};

TaskOffload.prototype.doTask = function(creep, task) {
    if (!task.resource) task.resource = RESOURCE_ENERGY;
    if (this.offloadMethod == this.offloadMethod.Drop) {
        creep.drop(task.resource);
        return gc.RESULT_FINISHED;
    }

    var tasks = require("tasks");
    //console.log(creep,"In task Offload target id", tasks.getTargetId(creep), "canuselagtenatives",JSON.stringify(task));

    if (creep.carry[task.resource] == 0 || !creep.carry[task.resource]) {
       // console.log("tried Offloading witih no enrgy");
        tasks.setTargetId(creep, undefined);
        return tasks.Result.Finished;
    }
    var target;
    if (task.targetId) {
        target = Game.getObjectById(task.targetId);
    } else {
        target = Game.getObjectById(tasks.getTargetId(creep));
    }
    if (!target) {
        //console.log(creep,"Offload, No target Id found",task.offloadMethod, "carryenergy",creep.carry.energy );
        tasks.setTargetId(creep, undefined);
        //if (creep.carry.energy == 0) {
        if (creep.carry[task.resource] == 0) {
           // console.log(creep,"return finished no caryy energy");
            return gc.RESULT_FINISHED;
        } else {
            switch (task.offloadMethod) {
                case gc.BUILD:
                case gc.REPAIR:
                case gc.TRANSFER:
                    if (task.canUseAlternative) {
                       // console.log(creep,"no target id return rollback uselaterantive true",task.canUseAlternative)
                        return gc.RESULT_ROLLBACK;
                    } else {
                      //  console.log(creep,"no target id return finished uselaterantive false",task.canUseAlternative)
                        return gc.RESULT_FINISHED;
                    }
                case gc.UPGRADE_CONTROLLER:
                case gc.DROP:
                default:
                    return gc.RESULT_FINISHED;
            }
        }
    }
    var result = stats[task.offloadMethod](creep, target, task.resource, task.amount);
   // console.log(creep,"Task Offload result", result, "target",target,
  //     "method", JSON.stringify(task.offloadMethod));
    switch (result ) {
        case OK:
            if (creep.carry[task.resource] == 0
                || task.offloadMethod == gc.DROP
                || task.offloadMethod == gc.TRANSFER ) {

               // console.log(creep,"offloaded all energy - FINSIHED",task.offloadMethod);
              //  creep.say("empty");
                tasks.setTargetId(creep, undefined);
                if (creep.carry[task.resource] == 0)
                {
                    return gc.RESULT_FINISHED;
                } else {
                    if (task.canUseAlternative) {
                        tasks.setTargetId(creep, undefined);
                        return gc.RESULT_ROLLBACK;
                    }
                    return gc.RESULT_FINISHED;
                }
            }
            else { // creep.carry.energy != 0
                switch (task.offloadMethod) {
                    case gc.BUILD:
                        if (Game.getObjectById(target.id)) {
                            //creep.say("build same");
                            //console.log(creep, "Build object still three, result unfinished");
                            return gc.RESULT_UNFINISHED;                          
                        }
                        break;
                    case gc.REPAIR:
                        //return gc.RESULT_ROLLBACK;
                        if ( target.hitsMax - target.hits < 100) {
                            tasks.setTargetId(creep, undefined);
                            return gc.RESULT_FINISHED;
                        } else {
                            return gc.RESULT_UNFINISHED;
                        }
                    case gc.TRANSFER:
                        tasks.setTargetId(creep, undefined);
                       // creep.say("next target");
                       // console.log("Transfer");
                        return gc.RESULT_ROLLBACK;
                    case gc.UPGRADE_CONTROLLER:
                       // creep.say("upgrade");
                        return gc.RESULT_UNFINISHED;
                    case gc.DROP:
                    default:
                        tasks.setTargetId(creep, undefined);
                        return gc.RESULT_FINISHED;
                }
            }
            break;
        case ERR_FULL:
        case ERR_INVALID_TARGET:
            tasks.setTargetId(creep, undefined);
            if (task.dropOnFull)
                creep.drop(task.resource);

            if (creep.carry[task.resource] == 0)     {
                return gc.RESULT_FINISHED;
            } else {
                if (task.canUseAlternative) {
                    tasks.setTargetId(creep, undefined);
                }
                //console.log(creep,"invalid target abou to return finished")
                return gc.RESULT_FINISHED;
            }
        case ERR_NOT_IN_RANGE:
        case ERR_NOT_OWNER:
        case ERR_BUSY:
        case ERR_NOT_ENOUGH_RESOURCES:
        case ERR_NO_BODYPART:
        case ERR_RCL_NOT_ENOUGH:
        case ERR_INVALID_ARGS:
            tasks.setTargetId(creep, undefined);
            return gc.RESULT_FINISHED;
    }
};

TaskOffload.prototype.offloadTargetId = function (creep)
{
    var energyDumps = creep.room.find(FIND_STRUCTURES, {
        filter: function(object) {
            return (object.structureType == STRUCTURE_CONTAINER
            || object.structureType == STRUCTURE_STORAGE
            || object.structureType == STRUCTURE_LINK
            || object.structureType == STRUCTURE_EXTENSION) ;
        }
    });
    //console.log(creep,"offloadTargetId list of possable new offload targets",energyDumps.length)
    energyDumps.sort(function (a, b) {
        var spaceA,spaceB;
        if (a.structureType == STRUCTURE_CONTAINER || a.structureType == STRUCTURE_STORAGE ) {
            spaceA = a.storeCapacity - _.sum(a.store);
        } else {
            spaceA = a.energyCapacity - a.energy;
        }
        if (b.structureType == STRUCTURE_CONTAINER || b.structureType == STRUCTURE_STORAGE ) {
            spaceB = b.storeCapacity - _.sum(b.store);
        } else {
            spaceB = b.energyCapacity - b.energy;
        }
        return spaceB - spaceA;
    });
    creep.say(energyDumps[0].structureType);
    //console.log(creep,"offloadTargetId mover to dump",energyDumps[0].id,energyDumps[0].structureType);
    return energyDumps[0].id;
};




module.exports = TaskOffload;
/**
 * Created by Piers on 05/07/2016.
 */
































