
var gc = require("gc");
var TaskMoveXY = require("task.move.xy");
var TaskStorageLinkerMiner = require("task.storage,linker.miner");
 

var roleLinkerMinerStorage = {

    getTaskList: function(undefined, x,y,storageId, storageLinkId, mineralId, resourceMined) {
        var taskList = [];
        var moveToPosition = new TaskMoveXY(x,y,0);
        var linking = new TaskStorageLinkerMiner(storageId, storageLinkId, mineralId, resourceMined);
                                 
        taskList.push(moveToPosition);
        taskList.push(linking);
        return taskList;
    },

};

module.exports = roleLinkerMinerStorage;
/**
 * Created by Piers on 07/07/2016.
 */
