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
    root_node:cc.Node = null;

    buildId=0;//从pastureView传入

    onLoad(){

        if(Common.curPastureBuildgrade<=PastureConfigMgr.maxGrade[this.buildId]){
            this.btn_root.on(cc.Node.EventType.TOUCH_END, (e: cc.Event.EventTouch) => this.onClick(e))
        }
    }
    onClick (event:cc.Event.EventTouch){
        Common.curPastureBuildingId=this.buildId;
        UIManager.getInstance().showView2(Define.viewUpgrade);
    }
}