import ViewBase from "../ui/ViewBase";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";
import GameManager from "../manager/GameManager";
import UserInfo from "../UserInfo";
import SoundManager from "../manager/SoundManager";
import WXHelper from "../common/WXHelper";
import HttpManager from "../manager/HttpManager";
import LDataConsume from "../datas/LDataConsume";
import LDataConsumeManager from "../datas/LDataConsumeManager";
import GuidanceMgr from "../manager/GuidanceMgr";
import PastureConfigMgr from "../manager/PastureConfigMgr";
import PastureDataMgr from "../manager/PastureDataMgr";

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
export default class Building extends cc.Component {

    @property(cc.Node)
    btn_root:cc.Node = null;

    @property(cc.Node)
    btn_feed:cc.Node = null;

    @property(cc.Node)
    root_node:cc.Node = null;

    buildId=0;//从pastureView传入

    onLoad(){
        this.btn_root.on(cc.Node.EventType.TOUCH_END, (e: cc.Event.EventTouch) => this.onClickUpgrade(e))
        let grade=PastureDataMgr.data.buildGrades[this.buildId];
        let bios=PastureDataMgr.data.biologys[this.buildId];
        this.btn_feed.active=false;
        if(grade>0){
            if(bios.length>0){
                this.btn_feed.on(cc.Node.EventType.TOUCH_END, (e: cc.Event.EventTouch) => this.onClickFeed(e))
                if(this.buildId==0){
                    UIManager.getInstance().sendMessage(Define.viewPasture,"showjiaohua");
                }else if(this.buildId==1)
                {
                    UIManager.getInstance().sendMessage(Define.viewPasture,"showweiyu");
                }else if(this.buildId==2){
                    UIManager.getInstance().sendMessage(Define.viewPasture,"showweiniu");
                }
                
                this.btn_feed.active=false;
            }
        }
    }
    onClickUpgrade (event:cc.Event.EventTouch){
        Common.curPastureBuildingId=this.buildId;
        UIManager.getInstance().showView2(Define.viewUpgrade);
    }
    onClickFeed (event:cc.Event.EventTouch){
        if(this.buildId==0){
            UIManager.getInstance().showView2(Define.viewFeedYu);

        }else if(this.buildId==1){
            UIManager.getInstance().showView2(Define.viewFeedHua);

        }else if(this.buildId==2){
            UIManager.getInstance().showView2(Define.viewFeedNiu);

        }
    }
    playFeed(buildId:number,grade:number,callBack:Function){

        let animName=this.getSpineName(buildId,grade,1);
        
        let spine=this.root_node.children[0].getComponent<sp.Skeleton>(sp.Skeleton);
        spine.setAnimation(0,animName,false);
        spine.setCompleteListener(trackEntry => {
            let animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if(animationName==animName){
                callBack();
                this.playIdle();
                spine.setCompleteListener(null);
            }
        });
    }
    playUpgrade(buildId:number,grade:number,callBack:Function){
        //let animName="1feed";

        //播放升级音效
        SoundManager.palySoundById(Define.jianzushengji,false);
            Common.playSkeletonById(Define.skeleton_update_guang,this.node.children[1],0,-30,null,false,true);
        let animName=this.getSpineName(buildId,grade,3);

        let spine=this.root_node.children[0].getComponent<sp.Skeleton>(sp.Skeleton);
        spine.setAnimation(0,animName,false);
        spine.setCompleteListener(trackEntry => {
            let animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if(animationName==animName){
                callBack();
                this.playIdle();
                spine.setCompleteListener(null);
            }
        });
    }
    playIdle(){
        let grade=PastureDataMgr.data.buildGrades[this.buildId];
        //let animName="1idle";

        let animName=this.getSpineName(this.buildId,grade,2);
        
        let spine=this.root_node.children[0].getComponent<sp.Skeleton>(sp.Skeleton);
        spine.setAnimation(0,animName,true);
    }
    getSpineName(buildId:number,grade:number,state:number){
        if(true){
            if(state==1){
                return "feed";
            }else if(state==2){
                return "idle";
            }else if(state==3){
                return "upgrade";
            }
        }else{
            //其他建筑动画
            return "idle";            
        }       
    }
    asShow(){
        
        this.btn_feed.active=false;
    }
}