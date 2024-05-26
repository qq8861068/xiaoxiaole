import ViewBase from "./ViewBase";
import ScollHelper from "../common/ScollHelper";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";
import WXHelper from "../common/WXHelper";
import GameManager from "../manager/GameManager";
import SoundManager from "../manager/SoundManager";

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
export default class RankingView extends ViewBase {

    @property(ScollHelper)
    scrollHelper:ScollHelper = null;

    @property(cc.Node)
    btn_close: cc.Node = null;

    @property(cc.Node)
    btn_share: cc.Node = null;

    @property(cc.Label)
    text_version: cc.Label = null;

    refreshView(isFristRefresh:boolean = false){

        console.log(this.text_version)
        console.log(Define.version)
        this.text_version.string = Define.version
        GameManager.getInstance().wxHelper.showView('Ranking')
    }

    //点击点击事件 //只调用一次
    addEvent(){
        Common.addClickEvent(this.btn_close,this.onClick.bind(this));
        Common.addClickEvent(this.btn_share,this.onClick.bind(this));
    }
    
    //隐藏
    hideView(){
        super.hideView()
        GameManager.getInstance().wxHelper.hideView('Ranking')
    }

    onClick(tag:string){
        if(tag == "btn_close"){
            UIManager.getInstance().hideView(Define.viewRanking)
        }else if(tag == "btn_share"){
            GameManager.getInstance().wxHelper.shareAppMessage("")
        }
    }
    //只调用一次
    initView(){
       
        // this.scrollHelper.initItems(1,5,function(idx:number, objIdx:number, obj:cc.Node){
        //     obj.children[4].getComponent<cc.Label>(cc.Label).string = idx.toString()
        // }.bind(this),false)
    }

}
