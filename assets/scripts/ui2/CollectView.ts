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
import ResManager from "../manager/ResManager";
import PastureDataMgr from "../manager/PastureDataMgr";
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
export default class CollectView extends ViewBase {

    @property(cc.Node)
    btn_ok:cc.Node = null;

    @property(cc.Node)
    btn_video:cc.Node = null;

    @property(cc.Label)
    label_pro:cc.Label = null;

    
    refreshView(isFristRefresh:boolean = false){

        if(isFristRefresh){
            let ms=Common.getCurTime();
            this.label_pro.string=""+PastureDataMgr.getTotalPro(ms).toString();
            TimeTaskManager.addTimeTask(1,function(){
                let ms=Common.getCurTime();
                this.label_pro.string=""+PastureDataMgr.getTotalPro(ms).toString();
            }.bind(this),"collect_view",-1);
        }

        if(!WXHelper.isLoadVideoSuccessful){
            this.btn_video.active=false;
            this.btn_ok.x=360;
        }else{
            this.btn_video.active=true;
            this.btn_ok.x=265;
        }
    }

    removeAllAni()
    {
        //this.fenxiangdongnode.removeAllChildren(true);
    }


    //点击点击事件 //只调用一次
    addEvent(){
        Common.addClickEvent(this.btn_ok,this.onClick.bind(this));
        Common.addClickEvent(this.btn_video,this.onClick.bind(this));
    }   
    
    onClick(tag:string){
        if(tag == "btn_ok"){
            UIManager.getInstance().hideView(Define.viewCollect);
            UIManager.getInstance().sendMessage(Define.viewPasture,"start_collect");
        }else if(tag == "btn_video"){
            SoundManager.pauseBackGroundSound(true,Common.curMusicRes);
            WXHelper.showVideo(function(state){
                if(state==1){
                    UIManager.getInstance().sendMessage(Define.viewPasture,"start_collect_3times");//临时假设1
                    UIManager.getInstance().hideView(Define.viewCollect);
                }else{//广告没看完
                    Common.showPrompt("广告没看完");
                }
                SoundManager.pauseBackGroundSound(false,Common.curMusicRes);
            }.bind(this));
        }
    }
    //只调用一次
    initView(){
    }

    //额外的事件调用
    message(tag:string = "defualt",args: any = null){
        if(tag == "refreshInfo"){
            
        }
    }
}