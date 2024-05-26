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
export default class UpgradeHouseView extends ViewBase {

    @property(cc.Node)
    btn_back:cc.Node = null;

    @property(cc.Node)
    btn_upgrade:cc.Node = null;

    @property(cc.Label)
    label_max:cc.Label = null;

    @property(cc.Label)
    label_consume:cc.Label = null;

    @property(cc.Label)
    label_curGrade:cc.Label = null;

    @property(cc.Sprite)
    build_icon:cc.Sprite = null;

    consume=0;

    refreshView(isFristRefresh:boolean = false){

        //SoundManager.playBackGroundMusic(Define.backgroundmusic[0]);

        if(isFristRefresh){

        }
        let buildId=Common.curPastureBuildingId;
        let grade=PastureDataMgr.data.buildGrades[buildId];
        ResManager.loadFrame("pasturetextures/"+PastureConfigMgr.icons[buildId][grade],function(frame){
            this.build_icon.spriteFrame=frame;
        }.bind(this));
        this.label_curGrade.string=""+grade;
        this.label_max.string=""+PastureConfigMgr.maxBiologyCount[buildId][grade];

        
        this.consume=PastureConfigMgr.upgradeConsume[buildId][grade];
        this.label_consume.string=this.consume.toString();
        if(this.consume>UserInfo.userGold){
            this.label_consume.node.color=cc.color(255,0,0,255);
        }

    }

    removeAllAni()
    {
        //this.fenxiangdongnode.removeAllChildren(true);
    }


    //点击点击事件 //只调用一次
    addEvent(){
        Common.addClickEvent(this.btn_back,this.onClick.bind(this));
        Common.addClickEvent(this.btn_upgrade,this.onClick.bind(this));
    }   
    
    onClick(tag:string){
        if(tag == "btn_back"){
            UIManager.getInstance().hideView(Define.viewUpgrade);
        }else if(tag == "btn_upgrade"){
            if(this.consume>UserInfo.userGold){
                UIManager.getInstance().showView2(Define.viewNoEnoughStar);
            }else{
                UserInfo.addGold(-this.consume);
                let buildId=Common.curPastureBuildingId;
                PastureDataMgr.data.buildGrades[buildId]+=1;
                UIManager.getInstance().showView2(Define.viewUpgradeOk);
            }
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