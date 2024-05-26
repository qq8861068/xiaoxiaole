import ViewBase from "./ViewBase";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";
import GameManager from "../manager/GameManager";
import UserInfo from "../UserInfo";
import WXHelper from "../common/WXHelper";
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
export default class ChallengeLoseView extends ViewBase {

    @property(cc.Node)
    free6_btn: cc.Node = null;
    @property(cc.Node)
    shipin6_btn: cc.Node = null;
    @property(cc.Node)
    fenxiang8_btn: cc.Node = null;
    @property(cc.Node)
    replay_btn: cc.Node = null;

    @property(cc.Node)
    gold_node: cc.Node = null;
    @property(cc.Node)
    btn_close: cc.Node = null;

    @property(cc.Label)
    xinxi_lab: cc.Label = null;

    @property(cc.Node)
    replay_btn1: cc.Node = null;

    @property(cc.Node)
    gold_node1: cc.Node = null;

    @property(cc.Node)
    shipingreplay_btn:cc.Node = null;

    lastTime:number = 0;
    @property(cc.Node)
    shibu:cc.Node = null;

    @property(cc.Node)
    xiaoniu_node:cc.Node = null;

    refreshView(isFristRefresh:boolean = false){
        this.xiaoniu_node.removeAllChildren(true);
        Common.playSkeletonById(Define.skeleton_xiaoniu,this.xiaoniu_node,0,0,function(effect){                      
            effect.getComponent(sp.Skeleton).setAnimation(0,"1ruchang", false);
            effect.runAction(cc.sequence(cc.delayTime(3.65),cc.callFunc(function(){ 
            effect.getComponent(sp.Skeleton).setAnimation(0, "4shengli", true);                
            }.bind(this))));
        }.bind(this),false,false)
    }
    addEvent(){
        Common.addClickEvent(this.free6_btn,this.onClick.bind(this));
        Common.addClickEvent(this.shipin6_btn,this.onClick.bind(this));
        Common.addClickEvent(this.fenxiang8_btn,this.onClick.bind(this));
        Common.addClickEvent(this.replay_btn,this.onClick.bind(this));
        Common.addClickEvent(this.replay_btn1,this.onClick.bind(this));
        Common.addClickEvent(this.shipingreplay_btn,this.onClick.bind(this));       
        Common.addClickEvent(this.btn_close,this.onClick.bind(this));       
    }
    onClick(tag:string){
        if(tag == "btn_close"){
            //放弃   
            // UIManager.getInstance().showView(Define.viewStart,function(){
            //     UIManager.getInstance().hideView(Define.viewChallengeLose)
            //     UIManager.getInstance().hideView(Define.viewMain)                            
            // }.bind(this))  
            
            UIManager.getInstance().showView(Define.viewChallengeExit)
        }else if(tag == "free6_btn"){ 
            // 免费加6步   
            UIManager.getInstance().sendMessage(Define.viewMain,'add5',null)
            UIManager.getInstance().hideView(Define.viewChallengeLose)                    
        }else if(tag == "shipin6_btn"){ 
            // 视频加6步  
            // UIManager.getInstance().sendMessage(Define.viewMain,'add5',null)
            // UIManager.getInstance().hideView(Define.viewChallengeLose)
            // 接广告
            WXHelper.showVideo(function(state){
                if(state == 1){
                    UIManager.getInstance().sendMessage(Define.viewMain,'add5',null)
                    UIManager.getInstance().hideView(Define.viewChallengeLose)
                }else{
                    Common.showPrompt("广告未观看完!");
                }
                SoundManager.pauseBackGroundSound(false,Common.curMusicRes);
            }.bind(this))
                      
        }else if(tag == "fenxiang8_btn"){ 
            // 分享加8步   
            this.lastTime = Common.getSystemTime()
            GameManager.getInstance().wxHelper.shareAppMessage("")
        }else if(tag == "replay_btn"||tag == "replay_btn1"){ 

            // TODU消耗金币重新开始 
            
            if(UserInfo.isGoldEnoght(8888))
            {
                UserInfo.addGold(8888*-1);
                UIManager.getInstance().sendMessage(Define.viewMain,'clear',null)
                UIManager.getInstance().showView(Define.viewMain,function(){
                    UIManager.getInstance().hideView(Define.viewChallengeLose)               
                }.bind(this))
            }
            else{
                Common.showPrompt("金币不足!");
            }                            
        }else if(tag=="shipingreplay_btn"){
            //视频重来
            // 接广告
            WXHelper.showVideo(function(state){
                if(state == 1){
                    UIManager.getInstance().sendMessage(Define.viewMain,'clear',null)
                        UIManager.getInstance().showView(Define.viewMain,function(){
                        UIManager.getInstance().hideView(Define.viewChallengeLose)               
                    }.bind(this))
                }else{
                    Common.showPrompt("广告未观看完!");
                }
                SoundManager.pauseBackGroundSound(false,Common.curMusicRes)
            }.bind(this))
        }
    }

    message(tag:string = "defualt",args: any = null){
        if(tag == '1'){
            //第一次失败
            this.gold_node.active = false;

            this.gold_node1.active = false;

            
            this.xinxi_lab.string="步数用完了，但是可以\n免费增加步数。"

            this.shibu.active=true;
            this.xinxi_lab.node.active=false;

            if(WXHelper.isLoadVideoSuccessful)
            //if(false)
            {
                this.free6_btn.active=false;
                this.shipin6_btn.active=true;
            }else{
                this.free6_btn.active=true;
                this.shipin6_btn.active=false;
            }  

            this.shipingreplay_btn.active=false;        
            this.fenxiang8_btn.active=false;
            this.replay_btn.active=false; 
            this.replay_btn1.active=false;           
        }else if(tag =='2')
        {
            this.gold_node.active = false;
            this.xinxi_lab.string="步数用完了，但是可以\n免费增加步数。"
            this.free6_btn.active=false;
            this.shipin6_btn.active=true;
            this.fenxiang8_btn.active=true;
            this.replay_btn.active=false;          
        }else if(tag =='3')
        {
            //第二次失败
            if(WXHelper.isLoadVideoSuccessful)
            //if(false)
            {
                //有视频
                this.shipingreplay_btn.active=true;

                this.replay_btn.active=false;
                this.gold_node.active = false;

                this.replay_btn1.active=true;
                this.gold_node1.active = true;
                
            }else{
                //无视频
                this.shipingreplay_btn.active=false;

                this.replay_btn.active=true;
                this.gold_node.active = true;

                this.replay_btn1.active= false;
                this.gold_node1.active = false;

                // this.shipingreplay_btn.active=false;
                // this.replay_btn.active=true;
                // this.replay_btn1.active=false;
                // this.gold_node.active = true;
                // this.gold_node1.active=false
            }  
            
            this.shibu.active=false;
            this.xinxi_lab.node.active=true;

            this.xinxi_lab.string ="步数用完了，但是可以\n再次挑战哦。"
            this.free6_btn.active = false;
            this.shipin6_btn.active = false;

            this.fenxiang8_btn.active = false;
            //this.replay_btn.active = true;
        }else if(tag == 'shareFinish'){
            if(this.lastTime > 0){
                let interval:number = Common.getSystemTime() - this.lastTime;
                if(interval > 5000){
                    UIManager.getInstance().sendMessage(Define.viewMain,'shareAdd8',null);
                    UIManager.getInstance().hideView(Define.viewChallengeLose);
                }
                this.lastTime = 0;
            }
        }
    }
}