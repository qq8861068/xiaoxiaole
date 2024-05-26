import ViewBase from "./ViewBase";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NoXinView extends ViewBase {

    @property(cc.Node) xin_btn_cancel: cc.Node = null;
    @property(cc.Node) xin_btn_go_xinrenwu: cc.Node = null;

    refreshView(isFristRefresh:boolean = false){

    }


    addEvent(){
        Common.addClickEvent(this.xin_btn_cancel,this.onClick.bind(this));
        Common.addClickEvent(this.xin_btn_go_xinrenwu,this.onClick.bind(this));
    }
    // LIFE-CYCLE CALLBACKS:

    onClick(tag:string){

        if (tag == "xin_btn_cancel"){
            UIManager.getInstance().hideView(Define.viewNoXin);
            if(UIManager.getInstance().isShow(Define.viewBegin)){
                UIManager.getInstance().hideView(Define.viewBegin)
            }  
        } else if (tag == "xin_btn_go_xinrenwu") {
            UIManager.getInstance().showView(Define.viewRenWu);
        }
    }

    start () {

    }

    // update (dt) {}
}
