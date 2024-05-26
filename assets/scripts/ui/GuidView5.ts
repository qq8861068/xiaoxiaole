import ViewBase from "./ViewBase";
import Define from "../common/Define";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import GuidanceMgr from "../manager/GuidanceMgr";
import SoundManager from "../manager/SoundManager";
import TimeTaskManager from "../manager/TimeTaskManager";

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
export default class GuidView5 extends ViewBase {
    

    @property(cc.Label)
    msg_label:cc.Label=null;   //转盘

    @property(cc.Node)
    handNode:cc.Node=null;


    initView(){

    }

    refreshView(isFristRefresh:boolean = false){

        let small=5;
        SoundManager.playGuidSoundById(Define.yindaoSound[small]);
        let delay=GuidanceMgr.getInstance().getDelayById(small);
        TimeTaskManager.addTimeTask(delay,function(){
            let node=this.node as cc.Node;
            let block=node.getChildByName("mask").getComponent<cc.BlockInputEvents>(cc.BlockInputEvents);
            block.destroy();
            Common.playSkeletonById(Define.skeleton_xinyindaoup,this.handNode,0,0,null,false,false);
        }.bind(this),"playGuidSound"+small,1);
       this.msg_label.string=GuidanceMgr.getInstance().getTishiById(small);
        //this.quanquan.active=true;
        
  
    
    }
    //点击点击事件 //只调用一次
    addEvent(){
        //Common.addClickEvent(this.btn_spin,this.onClick.bind(this));
        //Common.addClickEvent(this.close_btn,this.onClick.bind(this));
        
        
    }
    onClick(tag:string){
        if(tag == "btn_spin"){

        }
    }   

    //额外的事件调用
    message(tag:string = "defualt",args: any = null){
        if(tag == "victory"){
            //this.isShowByVictoryTag = true
        }else if(tag == "showPlayerInformation"){
            //刷新中奖信息
            //this.showPlayerInformation();
        }
    }
}