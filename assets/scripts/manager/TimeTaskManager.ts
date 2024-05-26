import TimeTask from "../common/TimeTask";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class TimeTaskManager {

    public static timeTasks:TimeTask[] = [];
    //添加时间任务
    public static addTimeTask(intervalTime:number,callBack:Function, onlyTag:string = "defualt",loopCount:number = -1){
        let task:TimeTask = new TimeTask(intervalTime,callBack,onlyTag,loopCount)
        TimeTaskManager.timeTasks.push(task);
        return task
    }
    //移除时间任务
    public static removeTimeTask(onlyTag:string){
        for (let index = 0; index < TimeTaskManager.timeTasks.length; index++) {
            if(TimeTaskManager.timeTasks[index].getOnlyTag() == onlyTag){
                TimeTaskManager.timeTasks.splice(index,1);
                break;
            }
        }
    }
    //更新时间任务
    public static updateTime(dt){
        for (let index = 0; index < TimeTaskManager.timeTasks.length; index++) {
            TimeTaskManager.timeTasks[index].updateTime(dt);
        }
    }
    //重置间隔时间
    public static resetIntervalTime(onlyTag,time){
        for (let index = 0; index < TimeTaskManager.timeTasks.length; index++) {
            if(TimeTaskManager.timeTasks[index].getOnlyTag() == onlyTag){
                TimeTaskManager.timeTasks[index].resetIntervalTime(time)
                break;
            }
        }
    }
    //检测时间任务是否存在
    public static checkIsExistByOnlyTag(onlyTag:string){
        for (let index = 0; index < TimeTaskManager.timeTasks.length; index++) {
            if(TimeTaskManager.timeTasks[index].getOnlyTag() == onlyTag){
                return true
            }
        }
        return false
    }
}
