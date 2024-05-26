import Define from "./common/Define";
import GuidanceMgr from "./manager/GuidanceMgr";
import BlockManager from"./manager/BlockManager";

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
export default class BlockGesture extends cc.Component {

    startPos:cc.Vec2 = cc.Vec2.ZERO
    isDown:boolean = false

    @property(cc. Label)
    text_desc: cc.Label = null;
    
    slideCallBack:Function = null;
    clickCallBack:Function = null;

    blockCol = 0;
    blockRow = 0;

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
        if(!GuidanceMgr.getInstance().isGuidBlock(this.blockRow,this.blockCol)){
            return;
        }
        
        this.isDown = true
        this.startPos = new cc.Vec2(event.getLocationX(),event.getLocationY()); 

        this.node.setSiblingIndex(this.node.getParent().childrenCount)
    }

    mouseMove (event:cc.Event.EventTouch){
        if(this.isDown){
            if(this.slideCallBack != null){
                let curX = event.getLocationX()
                let curY = event.getLocationY()
                let distance = this.startPos.sub(new cc.Vec2(curX,curY)).mag()
                let tempX = this.startPos.x - curX
                let tempY = this.startPos.y - curY
                if(distance >= 10){
                    //左右
                    if(Math.abs(tempX) > Math.abs(tempY)){
                        if(this.startPos.x > curX){
                            //console.log("left")
                            let guidDir=GuidanceMgr.getInstance().getGuidDir();
                            if(guidDir<0 || guidDir==Define.left){
                                this.slideCallBack(Define.left)
                            }
                        }else{
                            //console.log("right")
                            let guidDir=GuidanceMgr.getInstance().getGuidDir();
                            if(guidDir<0 || guidDir==Define.right){
                                this.slideCallBack(Define.right)
                            }
                        }
                    }else{
                    //前后
                        if(this.startPos.y > curY){
                            //console.log("down")
                            let guidDir=GuidanceMgr.getInstance().getGuidDir();
                            if(guidDir<0 || guidDir==Define.down){
                                this.slideCallBack(Define.down)
                            }
                        }else{
                            //console.log("up")
                            let guidDir=GuidanceMgr.getInstance().getGuidDir();
                            if(guidDir<0 || guidDir==Define.up){
                                this.slideCallBack(Define.up)
                            }
                        }
                    }
                    this.isDown = false
                }
            }
        }
    }

    mouseEnd (event:cc.Event.EventTouch){
        if(this.isDown){
            this.isDown = false  
            if(this.clickCallBack != null){
                this.clickCallBack();
            }
        }
    }
}
