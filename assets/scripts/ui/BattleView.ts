import ViewBase from "./ViewBase";
import Common from "../common/Common";
import DragBlock from "../DragBlock";

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


class Block{
    node:cc.Node;
    distance:number = 0;
    blockIndex:number = 0;
    dragBlock:DragBlock = null;
}

@ccclass
export default class BattleView extends ViewBase {

    @property(cc. Node)
    btn_back: cc.Node = null;

    @property(cc. Node)
    btn_add: cc.Node = null;
    
    @property(cc. Node)
    node_block: cc.Node = null;

    @property(cc. Node)
    node_drag: cc.Node = null;

    blockList:Block[] = [];

    dragBlockList:DragBlock [] = [];

    refreshView(isFristRefresh:boolean = false){

    }
  
    addEvent(){
        Common.addClickEvent(this.btn_back,this.onClick.bind(this)); 
        Common.addClickEvent(this.btn_add,this.onClick.bind(this)); 
    }

    onClick(tag:string){
        if(tag == "btn_back"){
            // UIManager.getInstance().showView(Define.viewMain,function(){
            //     UIManager.getInstance().hideView(Define.viewBattle)
            // }.bind(this))
        }else if(tag == "btn_add"){
            let block = this.getFreeBlock()
            if(block != null){
                this.createDragBlock(block)
            }else{
                console.log("已经铺满了位置")
            }
        }
    }

    initView(){
        for(let i = 0 ; i < 15 ; i++){
            let block = new Block();
            block.node = cc.instantiate(this.node_block)
            let row = Math.floor(i/5)
            let col = Math.floor(i%5)
            block.node.position = new cc.Vec2(100 + 105*col,500 - row*105)
            block.node.children[1].getComponent<cc.Label>(cc.Label).string = i.toString()
            block.blockIndex = i;
            this.node.addChild(block.node)
            this.blockList.push(block)
        }
    }

    //额外的事件调用
    message(eventTag:string = "defualt",args:any = null){
        if(eventTag == "DragEffect"){
            let dragBlock:DragBlock = args;
            let tempCollisionList:Block [] = []
            for (let index = 0; index < this.blockList.length; index++) {
                let temp1 = this.blockList[index].node
                let temp0 = dragBlock.node
                if(Common.isCollisionWithRect(temp0.position.x,temp0.position.y,temp0.width,temp0.height,temp1.position.x,temp1.position.y,temp1.width,temp1.height)){
                    tempCollisionList.push(this.blockList[index])
                }
            }
            if(tempCollisionList.length == 0){
                console.log("归位")
                dragBlock.gotoInitPos()
            }else{
                for(let i = 0 ; i < tempCollisionList.length ; i++){
                    let distance = dragBlock.node.position.sub(tempCollisionList[i].node.position).mag();
                    tempCollisionList[i].distance = distance
                }

                tempCollisionList.sort(function (a, b) {
                    return a.distance - b.distance
                });

                let tempBlock = tempCollisionList[0].dragBlock
                if(tempBlock == null){
                    this.blockList[dragBlock.blockIndex].dragBlock = null
                    dragBlock.node.position = tempCollisionList[0].node.position //说明该位置是空的可以直接放上去
                    dragBlock.blockIndex = tempCollisionList[0].blockIndex
                    tempCollisionList[0].dragBlock = dragBlock
                }else{
                    if(tempBlock == dragBlock){
                        //回到自己原来的位置
                        console.log("归位 0")
                        dragBlock.gotoInitPos()
                    }else{
                        //说明两个物体的索引相同 //需要拖动的删除   然后目标位置的block 进行升级
                        if(tempBlock.blockId == dragBlock.blockId){
                            console.log("需要进行升级")
                            tempBlock.upgradeDragBlock()
                            this.blockList[dragBlock.blockIndex].dragBlock = null
                            this.removeDragBlockByBlockIndex(dragBlock.blockIndex)
                        }else{

                            console.log("归位 1")
    
                            console.log("需要进行交换位置")
                            let pos1 = tempBlock.node.position
                            let pos2 = dragBlock.getInitPos()
                            dragBlock.changeDragBlockPos(pos1)
                            tempBlock.changeDragBlockPos(pos2)

                            this.blockList[tempBlock.blockIndex].dragBlock = dragBlock
                            this.blockList[dragBlock.blockIndex].dragBlock = tempBlock

                            let tempIndex:number  = tempBlock.blockIndex
                            tempBlock.blockIndex = dragBlock.blockIndex
                            dragBlock.blockIndex = tempIndex

                            
                        }
                    }
                }
            }
        }
    }
    //创建一个可以拖动的方块
    createDragBlock(targetBlock:Block,block:number = 0){
        let dragBlock:DragBlock = cc.instantiate(this.node_drag).getComponent<DragBlock>(DragBlock)
        this.node.addChild(dragBlock.node)
        dragBlock.node.position = targetBlock.node.position;
        dragBlock.blockIndex = targetBlock.blockIndex
        targetBlock.dragBlock = dragBlock;
        this.dragBlockList.push(dragBlock)
    }
    //获得一个空闲的空的位置
    getFreeBlock(){
        for(let i = 0 ; i < 15 ; i++){
            if(this.blockList[i].dragBlock == null){
                return  this.blockList[i] 
            }           
        }
        return null
    }

    //移除一个指定的block
    removeDragBlockByBlockIndex(blockIndex:number){
        for (let index = 0; index < this.dragBlockList.length; index++) {
            if(this.dragBlockList[index].blockIndex == blockIndex){
                this.dragBlockList[index].node.destroy();
                this.dragBlockList.splice(index,1)
                break
            }
        }
    }
    
}
