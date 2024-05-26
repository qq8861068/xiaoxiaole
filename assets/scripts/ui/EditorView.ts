import Common from "../common/Common";
import ViewBase from "./ViewBase";
import Define from "../common/Define";
import Block from "../Block";
import ResManager from "../manager/ResManager";
import LDataBlockManager from "../datas/LDataBlockManager";
import LDataBlock from "../datas/LDataBlock";

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
export default class EditorView extends ViewBase {

    blockList:Block[] = []
    @property(cc. Node)
    node_blockRoot: cc.Node = null;

    @property(cc. Node)
    btn_save: cc.Node = null;

    @property(cc. Node)
    btn_block1: cc.Node = null;

    @property(cc. Node)
    node_blocks: cc.Node = null;


    @property(cc. Node)
    node_event: cc.Node = null;

    isClickDown:boolean = false

    curClickId:number = 1;

    
    //显示
    refreshView(){


        for (let index = 1; index < LDataBlockManager.dataList.length; index++) {
            let data:LDataBlock = LDataBlockManager.GetDataById(index)
            let blockNode:cc.Node = cc.instantiate(this.btn_block1)
            blockNode.children[0].getComponent<cc.Sprite>(cc.Sprite).spriteFrame = Common.getPropSpriteFrameByRes(data.icon)
            blockNode.children[0].children[0].getComponent<cc.Label>(cc.Label).string = index.toString()
            this.node_blocks.addChild(blockNode)
            blockNode.name = "btn_block;" + index.toString()
            Common.addClickEvent(blockNode,this.onClick.bind(this));
            
        }

        if(Common.mapInfo == ""){
            // for (let i = 0; i < Define.maxRow; i++) {
            //     for (let j = 0; j < Define.maxCol ; j++) {
            //        this.createBlockById(i,j,1)
            //     }
            // }
        }else{
            //这里去加载数据
            ResManager.loadMapData(Common.mapInfo,function(info){
                console.log(info)

                let mapArr:string [] =  info.split(';')
                for (let index = 0; index < mapArr.length; index++) {
                    let arr:string [] = mapArr[index].split(',')
                    if(arr[2] != '0'){
                        this.createBlockById(parseInt(arr[0]), parseInt(arr[1]),arr[2])
                    }
                
                }
            }.bind(this))
        }
    }
    initView(){

        // if(cc.sys.platform === cc.sys.WECHAT_GAME || cc.sys.platform === cc.sys.ANDROID || cc.sys.platform === cc.sys.IPHONE){
            this.node_event.on(cc.Node.EventType.TOUCH_START, (e: cc.Event.EventTouch) => this.mouseDown(e))
            this.node_event.on(cc.Node.EventType.TOUCH_END, (e: cc.Event.EventTouch) => this.mouseEnd(e))
            this.node_event.on(cc.Node.EventType.TOUCH_CANCEL, (e: cc.Event.EventTouch) => this.mouseEnd(e))
            this.node_event.on(cc.Node.EventType.TOUCH_MOVE, (e: cc.Event.EventTouch) => this.mouseMove(e))
            
        // }else {
        //     this.node_event.on(cc.Node.EventType.MOUSE_DOWN, (e: cc.Event.EventTouch) => this.mouseDown(e))
        //     this.node_event.on(cc.Node.EventType.MOUSE_UP, (e: cc.Event.EventTouch) => this.mouseEnd(e))
        //     this.node_event.on(cc.Node.EventType.MOUSE_LEAVE, (e: cc.Event.EventTouch) => this.mouseEnd(e))
        //     this.node_event.on(cc.Node.EventType.TOUCH_MOVE, (e: cc.Event.EventTouch) => this.mouseMove(e))
        // }

    }

    //点击点击事件 //只调用一次
    addEvent(){
        Common.addClickEvent(this.btn_save,this.onClick.bind(this));

    }
    
    onClick(tag:string){
        if(tag == "btn_save"){
            //这里保存数据
            let saveInfo:string  = ""
            for (let i = 0; i < Define.maxRow; i++) {
                for (let j = 0; j < Define.maxCol ; j++) {
                    let block:Block  = this.getBlockByRowCol(i,j)
                    if(block == null){
                        saveInfo = saveInfo + i.toString() + ',' + j.toString() + ',0' + ";"
                    }else{
                        saveInfo = saveInfo + i.toString() + ',' + j.toString() + ',' + block.blockId.toString() + ";"
                    }
                }
            }
            saveInfo = saveInfo.substr(0, saveInfo.length - 1);  
            console.log(saveInfo)
        }else{
            console.log(tag)
            let id:number =  Number(tag.split(";")[1])
            this.curClickId = id
            console.log("id ============= " + id.toString())
        }
    }

    //额外的事件调用
    message(tag:string = "defualt",args: any = null){
        let block:Block = args as Block
        if(block != null){
            this.removeBlockByRowCol(block.row,block.col)
            this.isClickDown = false
        }   
    }

    mouseDown (event:cc.Event.EventTouch){
        this.isClickDown = true
    }

    mouseMove (event:cc.Event.EventTouch){

    }

    mouseEnd (event:cc.Event.EventTouch){
        if(this.isClickDown){
            console.log('event.getLocationX() = ' + event.getLocationX() + " event.getLocationY() = " + event.getLocationY())
   
            let col =  Math.floor((event.getLocationX() - 35)/Define.blockWidth)
            let row =  Math.floor((event.getLocationY() - 120)/Define.blockHeight)
    
             console.log(row,col)
    
            this.createBlockById(row,col,this.curClickId)
            this.isClickDown = false
        }
    }

      //创建一个格子
    createBlockById(row:number,col:number,blockId:number,callBack:Function = null){
        ResManager.loadBlock(blockId,function(prefab){
            let blockNode:cc.Node = cc.instantiate(prefab)
            this.node_blockRoot.addChild(blockNode)
            let block:Block = blockNode.addComponent<Block>(Block);
            this.blockList.push(block)
            block.initRowCol(row,col,blockId)
            if(callBack){
                callBack(block)
            }
        }.bind(this))
    }

    removeBlockByRowCol(row,col){
        let removeBlockId:number = 1
        for (let index = 0; index < this.blockList.length; index++) {
            let block = this.blockList[index]
            if(block.row == row && block.col == col){
                block.node.destroy()
                removeBlockId = block.blockId
                this.blockList.splice(index,1)
                break
            }
        }

        if(removeBlockId != this.curClickId){
            this.createBlockById(row,col,this.curClickId)
        }
    }

    //指定行列  获得一个block
    getBlockByRowCol(row,col):Block{
        for (let index = 0; index < this.blockList.length; index++) {
            let block = this.blockList[index]
            if(block.row == row && block.col == col){
                return block
            }
        }
        return null
    }
}
