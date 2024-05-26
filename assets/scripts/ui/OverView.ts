import ViewBase from "./ViewBase";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";
import SoundManager from "../manager/SoundManager";
import LDataLevelsManager from "../datas/LDataLevelsManager";
import UserInfo from "../UserInfo";
import GameManager from "../manager/GameManager";
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

class CollectIn{
    node:cc.Node;
    blockId:number;
    curCount:number;
    maxCount:number;
    constructor(node:cc.Node,blockId:number,curCount:number,maxCount:number){
        this.node = node;
        this.blockId = blockId;
        this.curCount = curCount;
        this.maxCount = maxCount;
    }
}
@ccclass
export default class OverView extends ViewBase {

    @property(cc.Node)
    replay_btn: cc.Node = null;
   
    @property(cc.Node)
    close_btn: cc.Node = null;

    @property(cc.Node)
    node_items: cc.Node = null;

    @property(cc.Node)
    node_item: cc.Node = null;

    @property(cc.Label)
    text_level: cc.Label = null;

    @property(cc.Label)
    gold_lab: cc.Label = null;

    collectInfo:CollectIn [] = []

    collectPos:cc.Vec2 [] = []

    refreshView(isFristRefresh:boolean = false){

        
        //在这里调用统计输出函数
        Common.ShowDaoJuSum();
        // this.text_level.string="第"+UserInfo.userLevel.toString()+"关";
        console.log("失败界面初始化关卡数据");
        this.gold_lab.string=(UserInfo.userGold-Common.userGetgold).toString();

        this.text_level.string=UserInfo.userLevel.toString();
        this.text_level.node.active = false
        this.text_level.node.active = true
        //以关卡为

        //this.showLevelInfo(null);
    }

    hideView(){
        super.hideView();
        this.node_items.removeAllChildren(true)
    }
    showLevelInfo(args){

        
        Common.curLevelData = LDataLevelsManager.GetDataById(Common.mapLevel);
        //BlockManager.getInstance().initAllBlocks(null,null);
        console.log("开始界面初始化关卡数据");
        this.collectInfo = []
        this.collectPos = []   
        let infoArr:string [] = Common.curLevelData.collectInfo.split(';')
        for (let index = 0; index < infoArr.length; index++) {
            let arr:string [] = infoArr[index].split(',')
            let tempNode:cc.Node = cc.instantiate(this.node_item)
            this.collectInfo.push(new CollectIn(tempNode,Number(arr[0]),0,Number(arr[1])))
        }        
        

        for (let index = 0; index < this.collectInfo.length; index++) {
            let info:CollectIn = this.collectInfo[index]

            
            info.node.position = cc.Vec2.ZERO
            let tempNode = info.node.children[1]
            let spriteNode=info.node.children[2]
            tempNode.children[2].getComponent<cc.Label>(cc.Label).string = args[index].curCount.toString()+'/'+info.maxCount.toString()

            //显示对插
            if(args[index].curCount<info.maxCount)
            {
                tempNode.children[2].color=cc.color(255,0,0,255);
                spriteNode.getComponent<cc.Sprite>(cc.Sprite).spriteFrame=Common.atlasBlock.getSpriteFrame("shezhi_cuo1")
            }else{
                tempNode.children[2].color=cc.color(0,255,0,255);
                spriteNode.getComponent<cc.Sprite>(cc.Sprite).spriteFrame=Common.atlasBlock.getSpriteFrame("shezhi_dui1")
            }            
            if(info.blockId<18)
            {
                tempNode.children[0].getComponent<cc.Sprite>(cc.Sprite).spriteFrame = Common.atlasBlock.getSpriteFrame(Define.blockIconArr[info.blockId])
            }else if(info.blockId>=18&&info.blockId<24){
                tempNode.children[0].getComponent<cc.Sprite>(cc.Sprite).spriteFrame = Common.getFormSpriteFrame(info.blockId);
            }
            this.node_items.addChild(info.node)
        }

        this.node_items.getComponent<cc.Layout>(cc.Layout).updateLayout()
        for (let index = 0; index < this.collectInfo.length; index++) {
            let info:CollectIn = this.collectInfo[index]
            this.collectPos[info.blockId] = info.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        }
        // this.collectPos[info.blockId] = info.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        console.log(this.collectPos)

        //this.node_itemBg.width = this.collectInfo.length * 85
    }

    message(eventTag:string = "defualt",args:any = null){
        if(eventTag == "update"){
            this.showLevelInfo(args);
        }
    }

    addEvent(){
        Common.addClickEvent(this.replay_btn,this.onClick.bind(this));
        Common.addClickEvent(this.close_btn,this.onClick.bind(this));
    }
    onClick(tag:string){
        if(tag == "replay_btn"){

            UIManager.getInstance().showView(Define.viewStart,function(){
                UIManager.getInstance().showView(Define.viewBegin)
                UIManager.getInstance().hideView(Define.viewOver)
                UIManager.getInstance().hideView(Define.viewMain)                          
            }.bind(this))
            // UIManager.getInstance().sendMessage(Define.viewMain,'clear',null)
            // UIManager.getInstance().showView(Define.viewMain,function(){
            //     UIManager.getInstance().hideView(Define.viewOver)               
            // }.bind(this))

        }else if(tag == "close_btn"){   
            
            UIManager.getInstance().showView(Define.viewStart,function(){
                UIManager.getInstance().hideView(Define.viewOver) 
                UIManager.getInstance().hideView(Define.viewMain)                          
            }.bind(this))            
        }
    }

    start () {

    }
    // update (dt) {}
}