
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import SoundManager from "../manager/SoundManager";
import Define from "./Define";
const {ccclass, property} = cc._decorator;

@ccclass
export default class ButtonEffect extends cc.Component {

    clickCallBack:Function;
    clickLongCallBack:Function;
    clickDoublebCallBack:Function;
    pressCallBack:Function;
    isCanPlaySound:boolean = true;
    isClickEffect:boolean = true;
    isDown:boolean = false;
    isCanCall:boolean = true;
    isLongClick:boolean = true;

    timeIntervalTime:number = 0.2
    timeTotal:number = 0;

    startTouchPos:cc.Vec2;

    countTotal:number = 0;

    lastClickTime:number = -1

    onLoad () {
        // if(cc.sys.platform === cc.sys.WECHAT_GAME || cc.sys.platform === cc.sys.ANDROID || cc.sys.platform === cc.sys.IPHONE){
        //     this.node.on(cc.Node.EventType.TOUCH_START, (e: cc.Event.EventTouch) => this.mouseDown(e))
        //     this.node.on(cc.Node.EventType.TOUCH_END, (e: cc.Event.EventTouch) => this.mouseEnd(e))
        //     //this.node.on(cc.Node.EventType.TOUCH_CANCEL, (e: cc.Event.EventTouch) => this.mouseEnd(e))
        //     this.node.on(cc.Node.EventType.TOUCH_MOVE, (e: cc.Event.EventTouch) => this.mouseMove(e))
            
        // }else {
            this.node.on(cc.Node.EventType.TOUCH_START, this.mouseDown,this);
            this.node.on(cc.Node.EventType.MOUSE_UP, this.mouseEnd,this)
            this.node.on(cc.Node.EventType.TOUCH_END, this.mouseEnd,this)
            this.node.on(cc.Node.EventType.TOUCH_MOVE,  this.mouseMove,this)
        // }
    }
    
    mouseDown (event:cc.Event.EventTouch){
        this.isDown = true
        this.isCanCall = true
        this.timeIntervalTime = 0.2
        this.timeTotal = 0
        this.countTotal = 0
        this.startTouchPos = event.getLocation();

        if(this.clickDoublebCallBack != null){
            if(this.lastClickTime != -1 && new Date().getTime() - this.lastClickTime  < 200){
                this.isCanCall = false
                this.clickDoublebCallBack(this.node.name);
            }
            this.lastClickTime = new Date().getTime()
        }

        if(this.isClickEffect){
            this.node.runAction(cc.scaleTo(0.1,0.9));
        }
        if(this.isCanPlaySound){
            SoundManager.palySoundById(Define.UIyinxiao,false);
         }

        if(this.pressCallBack != null && this.isCanCall){
            this.pressCallBack(this.node.name,true);
        }
    }

    mouseMove (event:cc.Event.EventTouch){
        if(this.isDown){
            if(this.startTouchPos.sub(event.getLocation()).mag() >= 10){
                this.isCanCall = false
            }
        }
    }
    
    mouseEnd (event:cc.Event.EventTouch){
        if(this.node == null){
            return
        }
        if(!this.isCanCall){
            this.node.scale = 1
            this.isDown = false;
        }
        if(this.isDown){
            this.isDown = false;       
            if(this.isClickEffect){
                this.node.stopAllActions();
                this.node.scale = 1
            }   
            if(this.clickCallBack != null){
                this.clickCallBack(this.node.name);
            }
            if(this.pressCallBack != null){
                this.pressCallBack(this.node.name,false);
            }
        }
        this.isDown = false;
        this.isCanCall = true;

        //console.log("mouseEnd  = " + this.node.name)
    }
    
    setClickCallBack(callBack:Function,isClickEffect:boolean = false,isCanPlaySound:boolean = true,longCallBack:Function = null,pressCallBack:Function = null,clickDoublebCallBack:Function = null){
        this.clickCallBack = callBack;
        this.isClickEffect = isClickEffect;
        this.isCanPlaySound = isCanPlaySound;
        this.pressCallBack = pressCallBack;
        this.clickDoublebCallBack = clickDoublebCallBack;
        this.clickLongCallBack = longCallBack
        if(longCallBack != null){
            this.isLongClick = true
        }else{
            this.isLongClick = false
        }
    }

    update(dt){
        //
        if(this.isLongClick && this.isDown && this.isCanCall){
            this.timeTotal = this.timeTotal + dt;
            if(this.timeTotal >= this.timeIntervalTime){
                this.clickLongCallBack(this.node.name)
                if(this.countTotal >= 20){
                    this.timeIntervalTime = 0.02
                }else if(this.countTotal >= 10){
                    this.timeIntervalTime = 0.05
                }else if(this.countTotal >= 0){
                    this.timeIntervalTime = 0.1
                }
                this.timeTotal = 0
                this.countTotal++
            }
        }
    }
}
