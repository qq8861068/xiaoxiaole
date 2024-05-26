import ViewBase from "./ViewBase";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";

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
export default class PuzzleView extends ViewBase {

    @property(cc.Node)
    btn_close: cc.Node = null;

    refreshView(isFristRefresh:boolean = false){

    }


    addEvent(){
        Common.addClickEvent(this.btn_close,this.onClick.bind(this));
    }
    // LIFE-CYCLE CALLBACKS:

    onClick(tag:string){

        if(tag == "btn_close"){
            UIManager.getInstance().hideView(Define.viewPuzzle);
        }
    }

    start () {

    }

    // update (dt) {}
}
