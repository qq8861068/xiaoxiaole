import FrameAnimation from "./FrameAnimation";

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
export default class FrameAnimations extends cc.Component {

    private curPlayIndex:number = 0;
    animaCount:number = 0;
    init () {
        this.animaCount = this.node.childrenCount
        for (let index = 0; index < this.animaCount; index++) {
            let anima:FrameAnimation =  this.node.children[index].getComponent<FrameAnimation>(FrameAnimation)
            if(anima == null){
                anima = this.node.children[index].addComponent<FrameAnimation>(FrameAnimation)
            }
            anima.init()
        }
    }
    
    Play(index:number,speed:number = 24,loopCount:number = -1,startFrame:number = 0,callBack:Function = null){

        let lastAnima = this.node.children[this.curPlayIndex].getComponent<FrameAnimation>(FrameAnimation);
        lastAnima.stop();
        
        this.curPlayIndex = index;
        let curAnima = this.node.children[this.curPlayIndex].getComponent<FrameAnimation>(FrameAnimation);
        curAnima.Play(speed,loopCount,startFrame,callBack);
    }

    setPlaySpeed(speed:number = 24){
        let curAnima = this.node.children[this.curPlayIndex].getComponent<FrameAnimation>(FrameAnimation);
        curAnima.setPlaySpeed(speed)
    }

    stop(){
        let curAnima = this.node.children[this.curPlayIndex].getComponent<FrameAnimation>(FrameAnimation);
        curAnima.stop();
    }
    
    resume(){
        let curAnima = this.node.children[this.curPlayIndex].getComponent<FrameAnimation>(FrameAnimation);
        curAnima.resume();
    }

    setFrameCallBack(callBack:Function){
        let curAnima = this.node.children[this.curPlayIndex].getComponent<FrameAnimation>(FrameAnimation);
        curAnima.setFrameCallBack(callBack)
    }

    setFinishCallBack(callBack:Function){
        let curAnima = this.node.children[this.curPlayIndex].getComponent<FrameAnimation>(FrameAnimation);
        curAnima.setFrameCallBack(callBack)

    }
}
