import UIManager from "./manager/UIManager";
import Define from "./common/Define";
import DragBlock from "./DragBlock";

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
export default class DragEffect extends cc.Component {

    startPos:cc.Vec2 = cc.Vec2.ZERO
    initPos:cc.Vec2 = cc.Vec2.ZERO
    isDown:boolean = false

    @property(cc. Label)
    text_desc: cc.Label = null;
    start () {
        // if(cc.sys.platform === cc.sys.WECHAT_GAME || cc.sys.platform === cc.sys.ANDROID || cc.sys.platform === cc.sys.IPHONE){
            this.node.on(cc.Node.EventType.TOUCH_START, (e: cc.Event.EventTouch) => this.mouseDown(e))
            this.node.on(cc.Node.EventType.TOUCH_END, (e: cc.Event.EventTouch) => this.mouseEnd(e))
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, (e: cc.Event.EventTouch) => this.mouseEnd(e))
            this.node.on(cc.Node.EventType.TOUCH_MOVE, (e: cc.Event.EventTouch) => this.mouseMove(e))
            
        // }else {
        //     this.node.on(cc.Node.EventType.MOUSE_DOWN, (e: cc.Event.EventTouch) => this.mouseDown(e))
        //     this.node.on(cc.Node.EventType.MOUSE_UP, (e: cc.Event.EventTouch) => this.mouseEnd(e))
        //     this.node.on(cc.Node.EventType.MOUSE_LEAVE, (e: cc.Event.EventTouch) => this.mouseEnd(e))
        //     this.node.on(cc.Node.EventType.TOUCH_MOVE, (e: cc.Event.EventTouch) => this.mouseMove(e))
        // }
    }
    
    mouseDown (event:cc.Event.EventTouch){
        this.isDown = true
        this.initPos = this.node.position
        this.startPos = new cc.Vec2(event.getLocationX(),event.getLocationY()); 

        this.node.setSiblingIndex(this.node.getParent().childrenCount)
    }

    mouseMove (event:cc.Event.EventTouch){
        if(this.isDown){
            this.node.position = new cc.Vec2(this.initPos.x + event.getLocationX() - this.startPos.x,this.initPos.y + event.getLocationY() - this.startPos.y)
        }
       
    }

    mouseEnd (event:cc.Event.EventTouch){
        if(this.isDown){
            this.isDown = false
            UIManager.getInstance().sendMessage(Define.viewBattle,"DragEffect",this.node.getComponent<DragBlock>(DragBlock))
        }
    }
}
