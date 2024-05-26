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
import PastureDataMgr from "../manager/PastureDataMgr";
import PastureConfigMgr from "../manager/PastureConfigMgr";
import LDataBiology from "../datas/LDataBiology";
import ResManager from "../manager/ResManager";

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
export default class StartView extends ViewBase {

    @property(cc.Node)
    btn_back:cc.Node = null;

    @property(cc.Sprite)
    big_icon:cc.Sprite = null;

    @property(cc.Node)
    btn_add:cc.Node = null;

    @property(cc.Node)
    btn_sub:cc.Node = null;

    @property(cc.Node)
    btn_buy:cc.Node = null;

    @property(cc.Label)
    label_title:cc.Label = null;

    @property(cc.Label)
    label_have_txt:cc.Label = null;

    @property(cc.Label)
    label_have_num:cc.Label = null;

    @property(cc.Label)
    label_price:cc.Label = null;

    @property(cc.Label)
    label_buy_num:cc.Label = null;
    
    buyNum=1;
    maxBuyNum=1;
    refreshView(isFristRefresh:boolean = false){

        if(isFristRefresh){

        }
        this.buyNum=1;
        let bioId=Common.curBuyId;
        let data=PastureConfigMgr.biologysData[bioId];
        let buildId=PastureConfigMgr.getBuidId(bioId);
        let grade=PastureDataMgr.data.buildGrades[buildId];
        let biologys=PastureDataMgr.data.biologys[buildId];
        this.label_title.string=data.name;
        ResManager.loadFrame("pasturetextures/"+data.icon,function(frame){
            this.big_icon.spriteFrame=frame;
        }.bind(this));

        let num=0;
        for(let k=0;k<biologys.length;++k){
            if(biologys[k].id==bioId){num++;}
        }
        this.label_have_num.string=""+num;
        this.label_price.string=data.price.toString();
        this.maxBuyNum=Math.floor(UserInfo.userGold/data.price);
        let leftSpace=PastureConfigMgr.maxBiologyCount[buildId][grade]-biologys.length;
        if(this.maxBuyNum>leftSpace){this.maxBuyNum=leftSpace;}
        this.label_buy_num.string=""+this.buyNum;
    }

    removeAllAni()
    {
        //this.fenxiangdongnode.removeAllChildren(true);
    }


    //点击点击事件 //只调用一次
    addEvent(){
        Common.addClickEvent(this.btn_back,this.onClick.bind(this));
        Common.addClickEvent(this.btn_buy,this.onClick.bind(this));
        Common.addClickEvent(this.btn_add,this.onClick.bind(this));
        Common.addClickEvent(this.btn_sub,this.onClick.bind(this));
    }   
    
    onClick(tag:string){
        if(tag == "btn_back"){
            UIManager.getInstance().hideView(Define.viewBuy);
            UIManager.getInstance().showView2(Define.viewShop);
        }
        else if(tag == "btn_add"){
            this.buyNum++;
            if(this.buyNum>this.maxBuyNum){
                this.buyNum=this.maxBuyNum;
            }
            this.label_buy_num.string=""+this.buyNum;
        }
        else if(tag == "btn_sub"){
            this.buyNum--;
            if(this.buyNum<1){this.buyNum=1;}
            this.label_buy_num.string=""+this.buyNum;
        }
        else if(tag == "btn_buy"){
            UIManager.getInstance().hideView(Define.viewBuy);
            UIManager.getInstance().hideView(Define.viewShop);
            let bioId=Common.curBuyId;
            let data=PastureConfigMgr.biologysData[bioId];
            for(let k=0;k<this.buyNum;++k){
                PastureDataMgr.addBiology(parseInt(data.desc),/*Common.curPastureBuildingId*/Common.curBuyId);
                UserInfo.addGold(-data.price);
            }
            PastureDataMgr.savePastureData();
            UIManager.getInstance().sendMessage(Define.viewPasture,"buy");
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