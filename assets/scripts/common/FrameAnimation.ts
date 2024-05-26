// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class FrameAnimation extends cc.Component {

 
    //最大帧数
    private maxFrame:number = 0;
    //当前帧数
    private curFrame:number = 0;
    //开始的帧数
    private startFrame:number = 0;
    //当前播放的速度
    private playSpeed:number = 200; //越小 越快
    //统计时间
    private totalTime:number = 0;
    //是否暂停播放
    private isPause:boolean = true;
    //播放完成回调
    private callBackFinish:Function = null;
    //循环次数
    private loopCount:number = -1;

    private frameCallBack:Function = null;

    init(){
        this.maxFrame = this.node.children.length;
        for (let index = 0; index < this.maxFrame; index++) {
            this.node.children[index].active = false
        }
    }

    update (dt) {
        if(this.isPause) return;
        this.totalTime = this.totalTime + 1000*dt;
        if(this.totalTime >= this.playSpeed)
        {
            this.nextFrame();
            this.totalTime = 0;
        }
    }

    nextFrame(){
        this.curFrame = this.curFrame + 1;
        if(this.frameCallBack != null){
            this.frameCallBack(this.curFrame)
        }
        if(this.curFrame >= this.maxFrame)
        {
            this.curFrame = this.startFrame

            if(this.loopCount != -1)
            {
                this.loopCount--;
                if(this.loopCount<=0)
                {
                    this.isPause = true;
                    if(this.callBackFinish != null)
                    {
                       this.callBackFinish();
                    } 
                }
            }
        }

        for (let index = 0; index <this.node.children.length; index++) {
            if(this.curFrame == index)
            {
                this.node.children[index].active = true;
            } else{
                this.node.children[index].active = false;
            }
        }
    }

    Play(speed:number = 20,loopCount:number = -1,startFrame:number = 0,callBack:Function = null){

        this.playSpeed = speed;
        this.loopCount = loopCount;
        this.startFrame = startFrame;
        this.curFrame = startFrame;
        this.callBackFinish = callBack;
        this.isPause = false;
        if(this.node.childrenCount > 0){
            this.node.children[this.curFrame].active = true;
        }
        this.node.active = true;
        if(this.frameCallBack != null){
            this.frameCallBack(this.curFrame)
        }
    }

    setPlaySpeed(speed:number = 20){
        this.playSpeed = speed;
    }
    

    stop(){
        this.isPause = true
        this.node.active = false;
    }

    resume(){
        this.node.active = true;
    }

    tempCallBack(){

    }

    setFrameCallBack(callBack:Function){
        this.frameCallBack = callBack;
    }

    setFinishCallBack(callBack:Function){
        this.callBackFinish = callBack;
    }
}
