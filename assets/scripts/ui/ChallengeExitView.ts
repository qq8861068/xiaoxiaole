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
export default class ChallengeExitView extends ViewBase {

    @property(cc. Node)
    btn_continue: cc.Node = null;

    @property(cc. Node)
    btn_exit: cc.Node = null;

    @property(cc. Node)
    btn_close: cc.Node = null;

    refreshView(isFristRefresh:boolean = false){

        

    }

    //点击点击事件 //只调用一次
    addEvent(){
        Common.addClickEvent(this.btn_exit,this.onClick.bind(this));
        Common.addClickEvent(this.btn_continue,this.onClick.bind(this));
        Common.addClickEvent(this.btn_close,this.onClick.bind(this));
    }
    
    onClick(tag:string){
        if(tag == "btn_continue" || tag == "btn_close"){
            UIManager.getInstance().hideView(Define.viewChallengeExit)
        }else if(tag == "btn_exit"){
     
            UIManager.getInstance().showView(Define.viewStart,function(){
                UIManager.getInstance().hideView(Define.viewChallengeExit)
                if(UIManager.getInstance().isShow(Define.viewChallengeVictory)){
                    console.log("**********关闭了挑战赛胜利界面**********")
                    UIManager.getInstance().hideView(Define.viewChallengeVictory)
                }else if(UIManager.getInstance().isShow(Define.viewChallengeLose))
                {
                    console.log("**********关闭了挑战赛失败界面**********")
                    UIManager.getInstance().hideView(Define.viewChallengeLose)
                }
                UIManager.getInstance().hideView(Define.viewMain)
            }.bind(this))    
        }
    }
}