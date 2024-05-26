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



const {ccclass, property} = cc._decorator;

@ccclass
export default class StartView extends ViewBase {

    @property(cc.Sprite)
    item_spt:cc.Sprite = null;

    @property(cc.Node)
    item_node:cc.Node = null;


    

    refreshView(isFristRefresh:boolean = false){


        if(isFristRefresh){

        }

    }

    removeAllAni()
    {
    }


    //点击点击事件 //只调用一次
    addEvent(){
        Common.addClickEvent(this.item_node,this.onClick.bind(this));
    }   
    
    onClick(tag:string){
        if(tag == "item_node"){

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