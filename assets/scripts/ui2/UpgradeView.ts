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
import PastureView from "./PastureView";
import Building from "./Building";



const {ccclass, property} = cc._decorator;

@ccclass
export default class UpgradeView extends ViewBase {

    @property(cc.Node)
    btn_back:cc.Node = null;

    @property(cc.Node)
    btn_upgrade:cc.Node = null;

    @property(cc.Node)
    btn_shop:cc.Node = null;

    @property(cc.Node)
    scontent:cc.Node = null;

    @property(cc.Label)
    label_max:cc.Label = null;

    @property(cc.Label)
    label_consume:cc.Label = null;

    @property(cc.Label)
    label_curGrade:cc.Label = null;

    @property(cc.Sprite)
    build_icon:cc.Sprite = null;

    @property(cc.SpriteFrame)
    disabledUpgradeFrame:cc.SpriteFrame=null;

    @property(cc.SpriteFrame)
    enabledUpgradeFrame:cc.SpriteFrame=null;

    @property(cc.Node)
    node_fullGrade:cc.Node=null;

    @property(cc.Node)
    node_xingxing:cc.Node=null;

    bio_nodes:cc.Node[]=[];
    consume=0;
    isFullGrade=false;

    refreshView(isFristRefresh:boolean = false){

        //SoundManager.playBackGroundMusic(Define.backgroundmusic[0]);
        this.isFullGrade=false;
        if(isFristRefresh){

        }
        let buildId=Common.curPastureBuildingId;
        let grade=PastureDataMgr.data.buildGrades[buildId];
        // ResManager.loadFrame("pasturetextures/"+PastureConfigMgr.icons[buildId][grade],function(frame){
        //     this.build_icon.spriteFrame=frame;
        // }.bind(this));
        this.build_icon.node.removeAllChildren();
        let node:cc.Node=cc.instantiate(Common.pastureView.pastureRes["building"+buildId+"Prefab"][grade]);
        let building=node.getComponent<Building>(Building);
        building.buildId=buildId;
        building.asShow();
        node.removeComponent(Building);
        this.build_icon.node.addChild(node);
        

        this.label_curGrade.string="等级："+grade;
        this.label_max.string=""+PastureConfigMgr.maxBiologyCount[buildId][grade];

        
        this.consume=PastureConfigMgr.upgradeConsume[buildId][grade];
        this.label_consume.string=this.consume.toString();
        if(this.consume>UserInfo.userGold){
            this.label_consume.node.color=cc.color(255,0,0,255);
        }

        let biologyIds=PastureConfigMgr.biologyTotalHave[buildId][grade];
        let icon_dis=120;
        let startx=60;
        let posy=0;
        for(let k=0;k<this.bio_nodes.length;++k){
            this.bio_nodes[k].destroy();
        }
        this.bio_nodes.length=0;
        for(let k=0;k<biologyIds.length;++k){
            let bioData=PastureConfigMgr.biologysData[biologyIds[k]];
            ResManager.loadFrame("pasturetextures/"+bioData.icon,function(frame){
                let node=new cc.Node("bio_icon");
                let spt=node.addComponent(cc.Sprite);
                spt.spriteFrame=frame;
                this.scontent.addChild(node);
                node.x=startx+k*icon_dis;
                node.y=posy;
                this.bio_nodes.push(node);
            }.bind(this));
        }
        if(grade>=PastureConfigMgr.maxGrade[buildId]){//满级提示
            let spt=this.btn_upgrade.getComponent<cc.Sprite>(cc.Sprite);
            spt.spriteFrame=this.disabledUpgradeFrame;
            this.node_xingxing.active=false;
            this.label_consume.node.active=false;
            this.node_fullGrade.active=true;
            this.isFullGrade=true;
        }else{
            let spt=this.btn_upgrade.getComponent<cc.Sprite>(cc.Sprite);
            spt.spriteFrame=this.enabledUpgradeFrame;
            this.node_xingxing.active=true;
            this.label_consume.node.active=true;
            this.node_fullGrade.active=false;
            this.isFullGrade=false;
        }

    }

    removeAllAni()
    {
        //this.fenxiangdongnode.removeAllChildren(true);
    }


    //点击点击事件 //只调用一次
    addEvent(){
        Common.addClickEvent(this.btn_back,this.onClick.bind(this));
        Common.addClickEvent(this.btn_shop,this.onClick.bind(this));
        Common.addClickEvent(this.btn_upgrade,this.onClick.bind(this));
    }   
    
    onClick(tag:string){
        if(tag == "btn_back"){
            UIManager.getInstance().hideView(Define.viewUpgrade);
        }else if(tag == "btn_shop"){
            UIManager.getInstance().hideView(Define.viewUpgrade);
            UIManager.getInstance().showView2(Define.viewShop,function(){
                UIManager.getInstance().sendMessage(Define.viewShop,"tap",this.buildId);
            }.bind(this));
        }else if(tag == "btn_upgrade"){
            if(this.isFullGrade){return;}
            if(this.consume>UserInfo.userGold){
                UIManager.getInstance().hideView(Define.viewUpgrade);
                UIManager.getInstance().showView2(Define.viewNoEnoughStar);
            }else{
                UserInfo.addGold(-this.consume);
                let buildId=Common.curPastureBuildingId;
                PastureDataMgr.data.buildGrades[buildId]+=1;
                PastureDataMgr.savePastureData();
                UIManager.getInstance().hideView(Define.viewUpgrade);
                UIManager.getInstance().sendMessage(Define.viewPasture,"play_upgrade",buildId);
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