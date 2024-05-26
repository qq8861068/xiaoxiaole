import ViewBase from "./ViewBase";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import SoundManager from "../manager/SoundManager";
import Define from "../common/Define";
import UserInfo from "../UserInfo";
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
export default class ExitView extends ViewBase {

    
    @property(cc.Node)
    replay_btn: cc.Node = null;
    @property(cc.Node)
    exit_btn: cc.Node = null;
    @property(cc.Node)
    close_btn: cc.Node = null;
    
    addEvent(){
        Common.addClickEvent(this.replay_btn,this.onClick.bind(this));
        Common.addClickEvent(this.exit_btn,this.onClick.bind(this));
        Common.addClickEvent(this.close_btn,this.onClick.bind(this));
    }
    onClick(tag:string){
        if(tag == "replay_btn"){
            //重玩时判断有没有体力
            if (UserInfo.userXin <= 0) {
                UserInfo.userXin = 0;
                console.log('无体力值');
                UIManager.getInstance().showView(Define.viewNoXin);
                return;
            }
            UserInfo.userXin -= 1;
            UIManager.getInstance().sendMessage(Define.viewMain,'clear',null)
            UIManager.getInstance().showView(Define.viewMain,function(){
                UIManager.getInstance().hideView(Define.viewExit)
                if(UIManager.getInstance().isShow(Define.viewLose)){  
                    UIManager.getInstance().hideView(Define.viewLose)
                }            
            }.bind(this))

        }else if(tag == "exit_btn"){ 
            UIManager.getInstance().showView(Define.viewStart,function(){
                UIManager.getInstance().hideView(Define.viewExit)
                UIManager.getInstance().hideView(Define.viewMain)
                if(UIManager.getInstance().isShow(Define.viewLose)){  
                    UIManager.getInstance().hideView(Define.viewLose)
                } 
            }.bind(this))    
           
        }else if(tag == "close_btn"){
            UIManager.getInstance().hideView(Define.viewExit)
        }
    }
    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
