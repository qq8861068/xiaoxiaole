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
import ResManager from "../manager/ResManager";
import PastureConfigMgr from "../manager/PastureConfigMgr";
import PastureDataMgr from "../manager/PastureDataMgr";



const {ccclass, property} = cc._decorator;

@ccclass
export default class FeedHuaView extends ViewBase {

    @property(cc.Node)
    btn_back:cc.Node = null;

    @property(cc.Node)
    btn_feed:cc.Node = null;

    @property(cc.Node)
    btn_video:cc.Node = null;

    @property(cc.Label)
    label_consume:cc.Label = null;

    consume=0;

    refreshView(isFristRefresh:boolean = false){

        //SoundManager.playBackGroundMusic(Define.backgroundmusic[0]);

        if(isFristRefresh){

        }
        let buildId=1;
        let grade=PastureDataMgr.data.buildGrades[buildId];
        
        this.consume=PastureConfigMgr.feedConsume[buildId][grade];
        this.label_consume.string=this.consume.toString();
        if(this.consume>UserInfo.userGold){
            this.label_consume.node.color=cc.color(255,0,0,255);
        }

        if(!WXHelper.isLoadVideoSuccessful){
            this.btn_video.active=false;
            this.btn_feed.x=360;
        }else{
            this.btn_video.active=true;
            this.btn_feed.x=265;
        }

    }

    removeAllAni()
    {
        //this.fenxiangdongnode.removeAllChildren(true);
    }


    //点击点击事件 //只调用一次
    addEvent(){
        Common.addClickEvent(this.btn_back,this.onClick.bind(this));
        Common.addClickEvent(this.btn_feed,this.onClick.bind(this));
        Common.addClickEvent(this.btn_video,this.onClick.bind(this));
    }   
    
    onClick(tag:string){
        if(tag == "btn_back"){
            UIManager.getInstance().hideView(Define.viewFeedHua);
        }else if(tag == "btn_feed"){
            if(this.consume>UserInfo.userGold){
                UIManager.getInstance().hideView(Define.viewFeedHua);
                UIManager.getInstance().showView2(Define.viewNoEnoughStar);
            }else{    
                UIManager.getInstance().hideView(Define.viewFeedHua);
                UIManager.getInstance().sendMessage(Define.viewPasture,"feed",1);//临时假设1
            }
        }else if(tag=="btn_video"){
            SoundManager.pauseBackGroundSound(true,Common.curMusicRes);
            WXHelper.showVideo(function(state){
                if(state==1){
                    UIManager.getInstance().sendMessage(Define.viewPasture,"feed_double",1);//临时假设1
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