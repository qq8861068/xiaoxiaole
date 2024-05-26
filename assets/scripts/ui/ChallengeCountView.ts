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
export default class ChallengeCountView extends ViewBase {


    @property(cc.Node)
    btn_zhaunjinbi: cc.Node = null;
    @property(cc.Node)
    btn_close: cc.Node = null;

    @property(cc.Label)
    text_maxcount: cc.Label = null;


   

    refreshView(isFristRefresh:boolean = false){
        this.text_maxcount.string=Common.userMaxChallengeCount.toString();
    }
    addEvent(){
        Common.addClickEvent(this.btn_zhaunjinbi,this.onClick.bind(this));
        Common.addClickEvent(this.btn_close,this.onClick.bind(this));      
    }
    onClick(tag:string){
        if(tag == "btn_zhaunjinbi"){          
            Common.gameModel = Define.gameModel_Normal
            UIManager.getInstance().showView(Define.viewBegin,function(){
                UIManager.getInstance().hideView(Define.viewChallengeCount);
                UIManager.getInstance().hideView(Define.viewChallengePrompt);
            }.bind(this))         
        }else if(tag == "btn_close"){ 
            UIManager.getInstance().hideView(Define.viewChallengeCount)                               
        }
    }



    // update (dt) {}
}
