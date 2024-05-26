import ViewBase from "./ViewBase";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import SoundManager from "../manager/SoundManager";
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
export default class LoginView extends ViewBase {

    @property(cc. Node)
    btn_login: cc.Node = null;

    refreshView(isFristRefresh:boolean = false){

    }
    //点击点击事件 //只调用一次
    addEvent(){
        Common.addClickEvent(this.btn_login,this.onClick.bind(this));
    }
    
    onClick(tag:string){
        if(tag == "btn_login"){
            UIManager.getInstance().hideView(Define.viewLogin)
            UIManager.getInstance().showView(Define.viewMain)
        }
    }
    //只调用一次
    initView(){

    }
}
