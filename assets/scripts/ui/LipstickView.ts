import ViewBase from "./ViewBase";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";
import GuidanceMgr from "../manager/GuidanceMgr";

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
export default class LipstickView extends ViewBase {


    @property(cc.Node)
    close_btn: cc.Node = null;

    addEvent(){
        Common.addClickEvent(this.close_btn,this.onClick.bind(this));
        this.onClick("close_btn");
    }

    onClick(tag:string){
        if(tag == "close_btn"){
            UIManager.getInstance().hideView(Define.viewLipstick,function(){
                GuidanceMgr.getInstance().tryShowGuid(1);
            });
        }
    }


    start () {

    }

}
