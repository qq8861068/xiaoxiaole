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
export default class NoEnoughStarView extends ViewBase {

    @property(cc.Node)
    btn_back:cc.Node = null;

    @property(cc.Node)
    btn_start:cc.Node = null;

    refreshView(isFristRefresh:boolean = false){

  

        if(isFristRefresh){

        }

    }

    removeAllAni()
    {
        //this.fenxiangdongnode.removeAllChildren(true);
    }


    //点击点击事件 //只调用一次
    addEvent(){
        Common.addClickEvent(this.btn_back,this.onClick.bind(this));
        Common.addClickEvent(this.btn_start,this.onClick.bind(this));
    }   
    
    onClick(tag:string){
        if(tag == "btn_back"){
            UIManager.getInstance().hideView(Define.viewNoEnoughStar);
            //UIManager.getInstance().hideView(Define.viewUpgrade);
        }
        else if(tag == "btn_start"){
            Common.gameModel = Define.gameModel_Normal
            //测试代码
            UIManager.getInstance().showView(Define.viewBegin,function(){
                UIManager.getInstance().hideView(Define.viewNoEnoughStar);
                UIManager.getInstance().hideView(Define.viewUpgrade);

                //UIManager.getInstance().hideView(Define.viewPasture);
            }.bind(this));
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