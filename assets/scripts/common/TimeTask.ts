import TimeTaskManager from "../manager/TimeTaskManager";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class TimeTask {

    private intervalTime:number = 1;
    private totalTime:number = 0;
    private onlyTag:string = "defualt";
    private callBack:Function = null;
    private loopCount:number = -1; //无限循环
    private isPuase:boolean = true;
    isGood:boolean = true;

    constructor(intervalTime:number,callBack:Function, onlyTag:string = "defualt",loopCount:number = -1)
    {
        this.intervalTime = intervalTime;
        this.callBack = callBack;
        this.onlyTag = onlyTag;
        this.loopCount = loopCount;
        this.isPuase = false;
    }

    updateTime(dt){
        if(this.isPuase){
            return;
        }
        this.totalTime =  this.totalTime + dt;
        if(this.totalTime >= this.intervalTime){
            this.totalTime = 0
            if(this.callBack != null)
            {
                if(this.loopCount > 0){
                    this.loopCount--;
                    if(this.loopCount == 0){
                        TimeTaskManager.removeTimeTask(this.onlyTag);
                    }
                }
                this.callBack(this.onlyTag);
            }
        }
    }
    //暂停
    setPause(isPuase:boolean){
        this.isPuase = isPuase
    }
    //重新设置间隔时间
    resetIntervalTime(intervalTime:number){
        this.intervalTime = intervalTime;
    }
    //重新试试统计时间
    resetTotalTime(){
        this.totalTime = 0;
    }

    //获得唯一标识
    getOnlyTag():string{
        return this.onlyTag;
    }
}
