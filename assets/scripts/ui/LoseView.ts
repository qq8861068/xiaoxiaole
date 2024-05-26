import ViewBase from "./ViewBase";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";
import GameManager from "../manager/GameManager";
import SoundManager from "../manager/SoundManager";
import WXHelper from "../common/WXHelper";
import UserInfo from "../UserInfo";
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
export default class LoseView extends ViewBase {

    @property(cc.Node)
    playAgain_btn: cc.Node = null;
    @property(cc.Node)
    shareAdd5_btn: cc.Node = null;

    @property(cc.Node)
    shipingAdd5_btn: cc.Node = null;

    @property(cc.Node)
    close_btn: cc.Node = null;

    @property(cc.Node)
    xiaoniu_node:cc.Node = null;

    lastTime:number = 0;



    refreshView(isFristRefresh:boolean = false){

        this.xiaoniu_node.removeAllChildren(true);
        Common.playSkeletonById(Define.skeleton_xiaoniu,this.xiaoniu_node,0,0,function(effect){                      
            effect.getComponent(sp.Skeleton).setAnimation(0,"1ruchang", false);
            effect.runAction(cc.sequence(cc.delayTime(3.65),cc.callFunc(function(){ 
            effect.getComponent(sp.Skeleton).setAnimation(0, "4shengli", true);                
            }.bind(this))));
        }.bind(this),false,false)
        // 界面能否显示广告按钮
        // WXHelper.isLoadVideoSuccessful

        if(WXHelper.isLoadVideoSuccessful)
        //if(false)
        {
            this.shareAdd5_btn.active=false;
            this.shipingAdd5_btn.active=true;
        }else 
        {
            this.shareAdd5_btn.active=true;
            this.shipingAdd5_btn.active=false;
        }
        // 接广告
        // WXHelper.showVideo(function(state){
        //     if(state == 1){

        //     }
        // }.bind(this))
    }
    
    addEvent(){
        Common.addClickEvent(this.playAgain_btn,this.onClick.bind(this));
        Common.addClickEvent(this.shareAdd5_btn,this.onClick.bind(this));
        Common.addClickEvent(this.close_btn,this.onClick.bind(this));
        Common.addClickEvent(this.shipingAdd5_btn,this.onClick.bind(this));
        
    }
    onClick(tag:string){
        if(tag == "playAgain_btn"){
            //重玩时判断有没有体力
            if (UserInfo.userXin <= 0) {
                UserInfo.userXin = 0;
                console.log('无体力值');
                UIManager.getInstance().showView(Define.viewNoXin);
                return;
            }
            UserInfo.userXin -= 1;
            UIManager.getInstance().sendMessage(Define.viewMain,'clear',null)
            UIManager.getInstance().showView(Define.viewMain,function(){
                UIManager.getInstance().hideView(Define.viewLose)               
            }.bind(this))        
        }else if(tag == "shareAdd5_btn"){

            UIManager.getInstance().sendMessage(Define.viewMain,'add5',null)
            UIManager.getInstance().hideView(Define.viewLose)
            
            //this.lastTime = Common.getSystemTime()

            
            //GameManager.getInstance().wxHelper.shareAppMessage("")
            //
            //
            //
            //完成分享加5步
            // UIManager.getInstance().sendMessage(Define.viewMain,'add5',null)
            // UIManager.getInstance().hideView(Define.viewLose)
           
        }else if(tag == "close_btn"){

            UIManager.getInstance().showView(Define.viewExit)
            // UIManager.getInstance().showView(Define.viewStart,function(){
            //     UIManager.getInstance().hideView(Define.viewLose)
            //     UIManager.getInstance().hideView(Define.viewMain)                            
            // }.bind(this))                  
        }else if(tag == "shipingAdd5_btn")
        {

            // 接广告
        WXHelper.showVideo(function(state){
            if(state == 1){
                UIManager.getInstance().sendMessage(Define.viewMain,'add5',null)
                UIManager.getInstance().hideView(Define.viewLose)
            }else{
                Common.showPrompt("广告未观看完!");
            }
            SoundManager.pauseBackGroundSound(false,Common.curMusicRes);
        }.bind(this))


        }
    }
    //额外的事件调用
    message(tag:string = "defualt",args: any = null){
        if(tag == 'shareFinish'){
            if(this.lastTime > 0){
                let interval:number = Common.getSystemTime() - this.lastTime
                if(interval > 5000){
                    UIManager.getInstance().sendMessage(Define.viewMain,'add5',null)
                    UIManager.getInstance().hideView(Define.viewLose)
                }
                this.lastTime = 0
            }
        }
    }
    // //只调用一次
    // initView(){
    //     this.showActionType = Define.left
    // }
}