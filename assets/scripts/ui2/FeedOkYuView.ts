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
export default class FeedOkYuView extends ViewBase {

    @property(cc.Node)
    btn_ok:cc.Node = null;

    @property(cc.Label)
    label_perm:cc.Label = null;

    
    refreshView(isFristRefresh:boolean = false){

        if(isFristRefresh){

        }

        let buildId=Common.curPastureBuildingId;
        let grade=PastureDataMgr.data.buildGrades[buildId];
        let biologys=PastureDataMgr.data.biologys[buildId];
        let pro=PastureDataMgr.getPerMinute(buildId);
        this.label_perm.string=pro.toString();

    }

    removeAllAni()
    {
        //this.fenxiangdongnode.removeAllChildren(true);
    }


    //点击点击事件 //只调用一次
    addEvent(){
        Common.addClickEvent(this.btn_ok,this.onClick.bind(this));
    }   
    
    onClick(tag:string){
        if(tag == "btn_ok"){
            UIManager.getInstance().hideView(Define.viewFeedOkYu);
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