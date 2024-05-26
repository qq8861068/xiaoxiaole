import ViewBase from "./ViewBase";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";
import SoundManager from "../manager/SoundManager";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShowRewardView extends ViewBase {
     
    @property(cc.Node)
    btn_close: cc.Node = null;

    @property(cc.Node)
    node_items: cc.Node = null;

    @property(cc.Node)
    node_bg: cc.Node = null;

    @property(cc.Node)
    aninood: cc.Node = null;


    effectNode:cc.Node = null

    refreshView(isFristRefresh:boolean = false){
        SoundManager.palySoundById(Define.zhongjiang,false);
    }

    //点击点击事件 //只调用一次
    addEvent(){
        Common.addClickEvent(this.btn_close,this.onClick.bind(this));
    }    
    onClick(tag:string){
        if(tag == "btn_close"){
            UIManager.getInstance().removeView(Define.viewShowReward)
            UIManager.getInstance().sendMessage(Define.viewTurntable,"showPlayerInformation")
        }
    }
    //只调用一次
    initView(){

    }

    //额外的事件调用
    message(tag:string = "defualt",args: any = null){
        let arr:string [] = args.split(";")
        for (let index = 0; index < this.node_items.childrenCount; index++) {
            this.node_items.children[index].active = false
        }
        this.node_items.getComponent<cc.Layout>(cc.Layout).updateLayout()

        let row = Math.ceil(arr.length/4)
        let tempArrSize:number[] = [0,200,350,450,600,750]
        this.node_bg.height = tempArrSize[row]

        for (let index = 0; index < arr.length; index++) {
            let info:string[] = arr[index].split(",")
            let id:number = Number(info[0])
            let count:number = Number(info[1])
            if(this.node_items.children[index] != null){
                this.node_items.children[index].children[0].getComponent<cc.Sprite>(cc.Sprite).spriteFrame = Common.getPropSpriteFrame(id)
                this.node_items.children[index].children[1].getComponent<cc.Label>(cc.Label).string = "x" + count.toString()
                this.node_items.children[index].active = true
            }else{
                console.log("奖励界面展示错误  最多可以展示16个奖励")
            }
        }

   
        console.log(this.aninood.position)

        if(this.effectNode != null){
            this.effectNode.destroy()
            this.effectNode = null
        }
        
        //Common.playSkeletonById()
        Common.playSkeletonById(Define.skeleton_gongxihuode,this.aninood,0,0,function(effectNode:cc.Node){
            this.effectNode = effectNode
            effectNode.runAction(cc.sequence(cc.delayTime(0.6),cc.callFunc(function(){
                SoundManager.pauseBackGroundSound(false,Common.curMusicRes);                                  
            }.bind(this))))                                       
        }.bind(this),false,false);  
    }
}
