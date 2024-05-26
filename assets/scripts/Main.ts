import UIManager from "./manager/UIManager";
import Define from "./common/Define";
import SoundManager from "./manager/SoundManager";
import BlockManager from "./manager/BlockManager";
import Common from "./common/Common";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    isHide:boolean = false
    onLoad() {
        console.log("开始游戏");
        /*
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;*/        
        // cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().gravity = cc.v2(0,-100);       
        //cc.PhysicsManager.DrawBits = 0        
        //cc.director.getPhysicsManager().debugDrawFlags = 1       
        cc.game.on(cc.game.EVENT_HIDE,this.gameEventHide.bind(this));
        cc.game.on(cc.game.EVENT_SHOW,this.gameEventShow.bind(this));
        cc.game.on(cc.game.EVENT_ENGINE_INITED,this.gameEventShow.bind(this));
    }
    
    gameEventHide(){
        console.log("gameEventHide")
        this.isHide = true
        console.log("游戏暂停了")
        cc.director.pause();
    }

    gameEventShow(){
        console.log("gameEventShow")
        if(cc.director.isPaused()){
            console.log("游戏恢复了");
            cc.director.resume();
            console.log("测试苹果手机问题，调用下落检测");
            if(Common.gameProgress == Define.gameing&&UIManager.getInstance().isShow(Define.viewMain))
            {
                BlockManager.getInstance().handlerBlocks();
            }                      
        }
        // if(cc.director.isPaused()){
        //    cc.director.resume();
        //    console.log("恢复音效")
        //    SoundManager.resumeBackGroundSound();
        // }
        if(this.isHide){
            SoundManager.resumeBackGroundSound();
            UIManager.getInstance().sendMessage(Define.viewLose,"shareFinish")
            UIManager.getInstance().sendMessage(Define.viewLose,"viewChallengeLose")
        }
    }
}
