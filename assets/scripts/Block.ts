import BlockGesture from "./BlockGesture";
import Common from "./common/Common";
import Define from "./common/Define";
import BlockManager from "./manager/BlockManager";
import UIManager from "./manager/UIManager";
import GameManager from "./manager/GameManager";
import SoundManager from "./manager/SoundManager";
import FlyEffect from "./FlyEffect";
import LDataBlock from "./datas/LDataBlock";
import LDataBlockManager from "./datas/LDataBlockManager";
import ResManager from "./manager/ResManager";

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
export default class Block extends cc.Component {

    //行列
    row:number = 0;
    col:number = 0;
    //移动目标的位置
    targetRow:number = -1
    targetPosY:number = 0
    //显示描述
    desc:cc.Label = null;

    icon:cc.Sprite = null;
    //id
    blockId:number = 1

    //是否提示状态
    isPrompt:boolean = false

    isSelected:boolean = false

    blockGesture:BlockGesture = null

    totalOnlyIndex:number = 0

    sortRow:number = -9999; //镂空状态使用

    isConverBlock:boolean = false//是否是遮挡的block

    data:LDataBlock = null;
    coverBlock:Block = null;
    //是否死亡
    isDie:boolean = false;

    //static tempIconArr:string [] = ['','button_common_blue','button_common_orange','button_common_violet','button_common_yellow']
    
    onLoad () {
        this.desc = this.node.children[0].children[0].getComponent<cc.Label>(cc.Label);
        this.desc.node.active = false;
        this.icon = this.node.children[0].getComponent<cc.Sprite>(cc.Sprite);
        this.blockGesture = this.node.addComponent<BlockGesture>(BlockGesture)      
        this.blockGesture.slideCallBack = this.gestureCallBack.bind(this)
        this.blockGesture.clickCallBack = this.clickCallBack.bind(this)
    }


    changeYidongGuai(id:number,issiwang:boolean)
    {
        //判断死亡
        // if(this.data.nextID == -9999)
        // {
        //     issiwang=true;
        // }
        //新建初始待机动画
        if(this.node.getChildByName("yidongguai")==null)
        {
            Common.playSkeletonById(Define.skeleton_yidongguai,this.node,0,0,function(effect){
                effect.name = "yidongguai"
                //console.log("道具ID："+id+"播放了小怪待机动画:"+this.getYidongName(id,true))
                effect.getComponent(sp.Skeleton).setAnimation(0, this.getYidongName(id,true), true);

                
                //console.log("小怪初始待机动画")
                this.node.getChildByName("xiangshui").active=false;
            }.bind(this),false,false)
            return;
        }

        let effect=this.node.getChildByName("yidongguai");
        //死亡动画
        if(issiwang){
            Common.isPlayAni=true;
            Common.playSkeletonById(Define.skeleton_yidongguaisiwang,Common.nodeSpineRoot,this.getScenePos().x,this.getScenePos().y,function(effect){
            }.bind(this),false,true)
            GameManager.getInstance().node.runAction(cc.sequence(cc.delayTime(1.2),cc.callFunc(function(){
                Common.isPlayAni=false;               
            }.bind(this))))
            
            //console.log("道具ID："+id+"播放了小怪死亡动画:"+this.getYidongName(id,false))
            //effect.getComponent(sp.Skeleton).setAnimation(0, this.getYidongName(id,false),false);
            effect.removeFromParent(true);
            effect.destroy() 
             
            this.node.getChildByName("xiangshui").active=true; 
            // effect.runAction(cc.sequence(cc.delayTime(1.34),cc.callFunc(function(){                
            //     effect.destroy();   
            //     this.node.getChildByName("xiangshui").active=true;             
            // }.bind(this))));
        }else{
            //受击加待机动画
            if(id<=9||id>=12)
            {
                return;
            }
            //console.log("道具ID："+id+"播放了小怪受击动画:"+this.getYidongName(id-1,false))
            effect.getComponent(sp.Skeleton).setAnimation(0, this.getYidongName(id-1,false), false);
            effect.runAction(cc.sequence(cc.delayTime(1.33),cc.callFunc(function(){ 
                //console.log("道具ID："+id+"播放小怪待机动画:"+this.getYidongName(id,true))               
                effect.getComponent(sp.Skeleton).setAnimation(0, this.getYidongName(id,true), true);                
            }.bind(this))));
        }
    }

    //获得动画名字
    getYidongName(id:number,isloop:boolean)
    {
        if(id<9||id>11)
        {
            //console.log("道具ID："+id+"***************************在找不存在的动画***********************************");
            return "daiji1"
        }
        if(isloop){
            return "daiji"+(id-8).toString();
        }else{
            if(id==11)
            {
                return "siwang";
            }else{
                return "shouji"+(id-8).toString();
            }            
        }       
    }

    initRowCol(row:number,col:number,id:number){
        this.setRowCol(row,col)
        this.blockGesture.blockRow=this.row;
        this.blockGesture.blockCol=this.col;
        this.blockId = id
        this.data = LDataBlockManager.GetDataById(id)
        this.targetRow = -1
        this.desc.string = this.row.toString() + "," + this.col.toString() + "," + id.toString()
        if(this.isConverBlock){
            this.node.position = cc.Vec2.ZERO
        }else{
            this.node.position =  Common.getBlockPosByRowCol(row,col)
        }
        this.icon.spriteFrame = Common.getPropSpriteFrameByRes(this.data.icon)
        this.isDie = false

        //移动障碍物动画专用逻辑
        if(this.data.invitationAward==4)
        {
            if(this.blockId>=9&&this.blockId<=11)
            {
                //console.log("调用动画，初始化下一个动画")
                this.changeYidongGuai(this.blockId,false);
            }
            // Common.playSkeletonById(Define.skeleton_yidongguai,this.node,0,0,function(effect){
            //     effect.name = "yidongguai"
            //     effect.getComponent(sp.Skeleton).setAnimation(0, this.getYidongName(this.blockId,true), true);
            //     console.log("播放了小怪待机动画")
            //     this.node.getChildByName("xiangshui").active=false;
            // }.bind(this),false,false)
        }

        this.icon.sizeMode = cc.Sprite.SizeMode.TRIMMED
        this.node.active = true
        this.isCanMoveTo = false
        if(this.blockId == Define.blockNoneId){
            //this.node.active = false;
            this.node.opacity = 0
            //this.node.setSiblingIndex(this.node.getParent().childrenCount)
        }else{
           // this.node.active = true
            this.node.opacity = 255
        }
        //console.log(this.icon.spriteFrame.getRect()) 
    }


    initFlyRowCol(row:number,col:number,id:number){
        this.setRowCol(row,col)
        this.blockGesture.blockRow=this.row;
        this.blockGesture.blockCol=this.col;
        this.blockId = id
        this.data = LDataBlockManager.GetDataById(id)
        this.targetRow = -1
        this.desc.string = this.row.toString() + "," + this.col.toString() + "," + id.toString()
        if(this.isConverBlock){
            this.node.position = cc.Vec2.ZERO
        }else{
            this.node.position =  Common.getBlockPosByRowCol(row,col)
        }
        this.icon.spriteFrame = Common.getPropSpriteFrameByRes(this.data.icon)


        // //移动障碍物动画专用逻辑
        // if(this.data.invitationAward==4)
        // {
        //     if(this.blockId>=9&&this.blockId<=11)
        //     {
        //         console.log("调用动画，初始化下一个动画")
        //         this.changeYidongGuai(this.blockId,false);
        //     }
        //     // Common.playSkeletonById(Define.skeleton_yidongguai,this.node,0,0,function(effect){
        //     //     effect.name = "yidongguai"
        //     //     effect.getComponent(sp.Skeleton).setAnimation(0, this.getYidongName(this.blockId,true), true);
        //     //     console.log("播放了小怪待机动画")
        //     //     this.node.getChildByName("xiangshui").active=false;
        //     // }.bind(this),false,false)
        // }

        this.icon.sizeMode = cc.Sprite.SizeMode.TRIMMED
        this.node.active = true
        this.isCanMoveTo = false
        if(this.blockId == Define.blockNoneId){
            //this.node.active = false;
            this.node.opacity = 0
            //this.node.setSiblingIndex(this.node.getParent().childrenCount)
        }else{
           // this.node.active = true
            this.node.opacity = 255
        }
        //console.log(this.icon.spriteFrame.getRect()) 
    }

    setRowCol(row:number,col:number){
        this.row = row
        this.col = col
        this.blockGesture.blockRow=this.row;
        this.blockGesture.blockCol=this.col;
        this.desc.string = this.row.toString() + "," + this.col.toString() + "," + this.blockId.toString()
    }

    gestureCallBack(dir:number){
        
        // console.log("Common.isCanMoveBlockTag = " + Common.isCanMoveBlockTag)
        // console.log("Common.isHaveBlockDroping = " + Common.isHaveBlockDroping)
        // console.log("Common.isPlayAni = " + Common.isPlayAni)
        // console.log("Common.gameProgress = " + Common.gameProgress)
        // console.log("Define.gameing      = " + Define.gameing)
        if(!Common.isCanMoveBlockTag ||Common.isHaveBlockDroping||Common.isPlayAni || Common.gameProgress != Define.gameing || Common.isBlockFly){
            return
        }

        //Common.promptTaskTime.resetTotalTime();
        //GameManager.getInstance().closeMask();
        BlockManager.getInstance().cancleEliminateSuggest();
        SoundManager.palySoundById(Define.xuanzhongdianjiyinxiao,false);
        BlockManager.getInstance().changePosByBlockAndDir(this,dir)
    }

    clickCallBack(){

        if(Common.isEditor){
            UIManager.getInstance().sendMessage(Define.viewEditor,"1",this)
            return
        }
        if(!Common.isCanMoveBlockTag ||Common.isHaveBlockDroping||Common.isPlayAni || Common.gameProgress != Define.gameing){
            return
        }
        if(this.data.eliminateType!=1||this.coverBlock!=null||this.isConverBlock)
        {
            return
        }

        BlockManager.getInstance().cancleEliminateSuggest();
        SoundManager.palySoundById(Define.xuanzhongdianjiyinxiao,false);
        
        if(Common.curSelectBlock  == this){

            
            if(this.isSelected)
            {        
                Common.curSelectBlock = null;   
                if(Common.oldSelectBlock!=null)
                {
                    Common.oldSelectBlock.moveDianjiSkeleton();
                }
                //this.moveDianjiSkeleton();
                Common.oldSelectBlock = null;
                Common.nodeSelectedRoot.setPosition(10000,10000);
                this.isSelected = false;
            }else{

                if(Common.oldSelectBlock!=null)
                {
                    Common.oldSelectBlock.moveDianjiSkeleton();
                } 
                this.playDianjiSkeleton();
                Common.oldSelectBlock = this;
                Common.nodeSelectedRoot.setPosition(this.getScenePos());
                this.isSelected = true;
            }
            
        }else if(Common.curSelectBlock == null){

            //选中一个道具            
            Common.curSelectBlock = this

            if(Common.oldSelectBlock!=null)
            {
                Common.oldSelectBlock.moveDianjiSkeleton();
            }            
            this.playDianjiSkeleton();

            Common.oldSelectBlock = this;
            Common.nodeSelectedRoot.setPosition(this.getScenePos());
            this.isSelected = true;

            
        }else{
            //Common.curSelectBlock!=this && Common.curSelectBlock!=null
            if(Common.checkIsNearByRowCol(Common.curSelectBlock.row,Common.curSelectBlock.col,this.row,this.col)){
    
                BlockManager.getInstance().changePosByBlockAndBlock(Common.curSelectBlock,this,-1)  

            }else{
                
                Common.curSelectBlock.isSelected = false;
                Common.curSelectBlock = this

                if(Common.oldSelectBlock!=null)
                {
                    Common.oldSelectBlock.moveDianjiSkeleton();
                } 
                this.playDianjiSkeleton();
                Common.oldSelectBlock = this;
                Common.nodeSelectedRoot.setPosition(this.getScenePos());
                this.isSelected = true;
            }
        }
    }

    updateTime(dt){
        //有目标的时候才会执行移动的操作
        if(this.blockId == Define.blockNoneId){
            return
        }
        if(this.targetRow >= 0){    
            let tempY = this.node.position.y - Define.blockDropSpeed*dt
            if(tempY < this.targetPosY){
                tempY = this.targetPosY
                this.row = this.targetRow
                this.blockGesture.blockRow=this.row;
                this.targetRow = -1
                this.playScaleYAni();
                this.desc.string = this.row.toString() + "," + this.col.toString() + "," + this.blockId.toString()

                if(this.row == BlockManager.getInstance().getMinRow(this.col) && this.data.eliminateType == 5){
                    this.isDie = true
                    BlockManager.getInstance().removeBlockByRowCol(this.row,this.col)
                    BlockManager.getInstance().createNewBlcoks(0,0)
                }
                BlockManager.getInstance().checkBlockDrop()
            }
            this.node.position = new cc.Vec2(this.node.position.x,tempY)

   
            //更新行列
            //this.col =  Math.ceil((this.node.position.x - 40)/Define.blockWidth)
            //this.row =  Math.ceil((this.node.position.y + 760)/Define.blockHeight)
            //this.desc.string = this.row.toString() + "," + this.col.toString()
        }
    }
    //设置目标行
    setTargetRow(row:number){
        this.targetPosY = Common.getBlockPosByRowCol(row,this.col).y
        if(row == this.row && Math.floor(this.node.position.y) <= this.targetPosY){
            return
        }
        // if(row == this.row){
        //     return
        // }

        if(this.data.invitationAward == 4){
            let temp = 100;
            return
        }
        this.targetRow = row;

        // if(row == 8){
        //     let tt = 100;
        // }

    }
    //改变位置
    changePosByTargetBlock(targetBlock:Block,callBack:Function = null){
        let row = targetBlock.row
        let col = targetBlock.col

        //Common.isCanMoveBlockTag = false
        //console.log("******************************开始道具交换动画****************************** " + this.desc.string + "this.targetRow = " + this.targetRow)
     
        this.node.runAction(cc.sequence(cc.moveTo(0.18,Common.getBlockPosByRowCol(row,col)),cc.callFunc(function(){
            this.initRowCol(row,col,this.blockId)   
            
            //console.log("******************************交换位置******************************")
            if(callBack != null){
                callBack();
                //console.log("******************************交换动画播放完毕******************************" + this.desc.string + "this.targetRow = " + this.targetRow)
                //Common.isCanMoveBlockTag = true                
            }           
        }.bind(this))))
    }

    guideEffect(){
        if(this.isPrompt==false)
        {

            Common.playSkeletonById(FlyEffect.effectIdList2[this.blockId],this.node,0,0,function(effect){
                effect.name = "kuangtishi"
                effect.getComponent(sp.Skeleton).setAnimation(0, '3tishi', true);
                //console.log("播放了提示动画");
                this.node.getChildByName("xiangshui").active=false;

            }.bind(this),false,false)
            this.isPrompt = true;
        }                  
    }
    cancleGuideEffect(){
        if(this.isPrompt==true)
        {
            Common.isPromptTag = false
            this.node.getChildByName("xiangshui").active=true;
            this.node.getChildByName("kuangtishi").destroy();       
            this.isPrompt = false; 
        }              
    }

    //移动到指定位置(+移除效果)
    flyEffect(sPos:cc.Vec2,ePoS:cc.Vec2)
    {
        this.node.position = sPos
        let spawn = cc.spawn(cc.moveTo(0.5,ePoS), cc.scaleTo(0.5,0.2));
        //this.node.setScale(0.7,0.7)
        this.node.runAction(cc.sequence(spawn,cc.callFunc(function(){
            this.node.removeFromParent(false)
            let self:Block = this;
            UIManager.getInstance().sendMessage(Define.viewMain,"recycle",self)
            //this.node.destroy();
        }.bind(this))));
        
    }

    getScenePos(){
        return this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
    }

    //一次压扁动画
    playXiaLuoSkeleton()
    {
        if(this.node.getChildByName("xialuo")==null)
        {
            
            Common.playSkeletonById(FlyEffect.effectIdList2[this.blockId],this.node,0,0,function(effect){
                effect.name = "xialuo"
                this.node.getChildByName("xiangshui").active=false;
                effect.getComponent(sp.Skeleton).setAnimation(0, '1xialuo', false);
                //console.log("播放了下落动画");
                effect.runAction(cc.sequence(cc.delayTime(1.34),cc.callFunc(function(){
                    this.node.getChildByName("xiangshui").active=true;

                    this.node.getChildByName("xialuo").destroy();
                }.bind(this))));
            }.bind(this),false,false)
        }       
    }

    playDianjiSkeleton()
    {
        if(this.node.getChildByName("dianji")==null)
        {
            
            Common.playSkeletonById(FlyEffect.effectIdList2[this.blockId],this.node,0,0,function(effect){
            effect.name = "dianji"
            this.node.getChildByName("xiangshui").active=false;
            effect.getComponent(sp.Skeleton).setAnimation(0, '2danji', true);
            //console.log("播放了点击动画");
            }.bind(this),false,false)
        }
    }
    moveDianjiSkeleton()
    {
        this.node.getChildByName("xiangshui").active=true;
        if(this.node.getChildByName("dianji")!=null)
        {
            this.node.getChildByName("dianji").destroy();
        }       
    }
    //一次压扁效果
    playScaleYAni()
    {
        let ani=cc.spawn(cc.scaleTo(0.15, 1, 0.85),cc.moveBy(0.15,0,-5));
        let ani1=cc.spawn(cc.scaleTo(0.2, 1, 1),cc.moveBy(0.2,0,5));
        let ani2=cc.spawn(cc.scaleTo(0.1, 1, 0.92),cc.moveBy(0.1,0,-3));
        let ani3=cc.spawn(cc.scaleTo(0.15, 1, 1),cc.moveBy(0.15,0,3));
        //let seq = cc.sequence(cc.spawn(cc.scaleTo(0.15, 1, 0.85),cc.moveBy(0.15,0,-5)),cc.spawn(cc.scaleTo(0.2, 1, 1),cc.moveBy(0.2,0,5)) );

        let seq = cc.sequence(ani,ani1,ani2,ani3);
        this.icon.node.runAction(seq);
    }
    //永久摇摆
    playRotateAni()
    {
        let seq = cc.repeatForever(cc.sequence(cc.rotateTo(0.1, 30), cc.rotateTo(0.1, -30)));
        this.icon.node.runAction(seq);
    }
    //永久抖动
    playShakeAni()
    {
        let seq = cc.repeatForever(cc.sequence(cc.moveBy(0.05,0,5), cc.moveBy(0.05,-5,0),cc.moveBy(0.05,0,-5),cc.moveBy(0.05,5,0)));
        this.icon.node.runAction(seq);       
    }
    //永久闪烁
    playGlintAni()
    {
        let seq = cc.repeatForever(cc.sequence(cc.fadeIn(0.3), cc.fadeOut(0.3)));
        this.icon.node.runAction(seq);
    }
    //获得道具是否可以下落
    getDropTag(){
        if(this.data.invitationAward == 2 || this.data.invitationAward == 4 || this.coverBlock != null){
            return true
        }
        return false
    }
    //block 是否可以移动 特殊方块是不能移动
    isCanMove(){
        if(this.data.invitationAward == 2 || this.data.invitationAward == 4 || this.coverBlock != null || this.data.invitationAward == 3){
            return false
        }
        return true
    }

    //消除道具减血
    subHp(){ //true 可以直接干掉
        //console.log("this.data.eliminateType = " + this.data.eliminateType)
        if(this.data.eliminateType == 6) { //不可以消除
            return false
        }else if(this.data.eliminateType == 5){
            return this.isDie
        }
        else if(this.coverBlock != null){
            //这里处理藤蔓
            if(this.coverBlock.subHp()){
             

                Common.playSkeletonById(Define.skeleton_tengxiao,Common.nodeSpineRoot,this.coverBlock.getScenePos().x,this.coverBlock.getScenePos().y,null,false,true);

                UIManager.getInstance().sendMessage(Define.viewMain,'collect',this.coverBlock)

                //统计道具
                Common.DaoJuSum[this.coverBlock.blockId]++;

                this.coverBlock.node.destroy()
                this.coverBlock = null
                BlockManager.getInstance().removeNoneBlock(this)
            }
            return false
        }else{
            if(this.data.eliminateType==5)
            {
                return false
            }else{
                if(this.data.nextID == -9999){
                    return true
                }else{

                    if(this.data.invitationAward==2&&this.data.eliminateType==2)
                    {
                        Common.playSkeletonById(Define.skeleton_huaxiao,Common.nodeSpineRoot,this.getScenePos().x,this.getScenePos().y,null,false,true);
                    }
                    //console.log("检测到道具掉血，初始化下一个动画")
                    this.initRowCol(this.row,this.col,this.data.nextID)
                    if(this.data.invitationAward == 4){
                        this.isCanMoveTo = true
                    }
                    return false
                }
            }            
        }
    }
    //设置遮挡的block
    setCoverBlock(coverBlockId:number){
        ResManager.loadBlock(coverBlockId,function(prefab){
            let blockNode:cc.Node = cc.instantiate(prefab)
            this.node.addChild(blockNode)
            this.coverBlock = blockNode.addComponent<Block>(Block);
            this.coverBlock.initRowCol(0,0,coverBlockId)
            this.coverBlock.isConverBlock = true
            blockNode.position = cc.Vec2.ZERO
        }.bind(this))
    }

    moveTargetRow:number = -9999
    moveTargetCol:number = -9999
    isCanMoveTo:boolean = false
    //特殊方块移动
    //移动到指定的行列
    moveToRowCol(targetBock,callBack:Function){
        if(!this.isCanMoveTo){
            return
        }
        let row = targetBock.row
        let col = targetBock.col
        this.moveTargetRow = row
        this.moveTargetCol = col
        this.isCanMoveTo = false
        this.targetRow = -1
        this.node.setSiblingIndex(this.node.getParent().childrenCount)
        let targetPos:cc.Vec2 = targetBock.node.position //Common.getBlockPosByRowCol(row,col) 
        //console.log("this.row ============= " + this.row  + "   this.col ==================== " + this.col)  
        //console.log("row = " + row.toString() + "   col = " + col.toString())
        //BlockManager.getInstance().removeBlockByRowCol(row,col,false,false)
        this.node.runAction(cc.sequence(cc.moveTo(0.4,targetPos),cc.callFunc(function(){
            this.node.runAction(cc.sequence(cc.delayTime(0.2),cc.callFunc(function(){
                // BlockManager.getInstance().removeNoneBlock(this)
                // this.setRowCol(row,col)
                // console.log("0000000000000000000000000 row = " + row.toString() + "   col = " + col.toString())
                callBack();
            }.bind(this))))
        }.bind(this))))
    }
    //移动完成
    moveToFinished(){
        // BlockManager.getInstance().removeNoneBlock(this)
        // console.log("this.moveTargetRow = " + this.moveTargetRow.toString() + "   this.moveTargetCol = " + this.moveTargetCol.toString())
        // console.log("this.row =========== " + this.row  + "   this.col ============== " + this.col)
        // console.log("this.targetRow=========== " + this.targetRow );
        this.targetRow = -1
        BlockManager.getInstance().removeNoneBlock(this);
        BlockManager.getInstance().removeBlockByRowCol(this.moveTargetRow,this.moveTargetCol,false,false)
        this.node.position = Common.getBlockPosByRowCol(this.moveTargetRow,this.moveTargetCol) 
        this.setRowCol(this.moveTargetRow,this.moveTargetCol)
        if(this.data.invitationAward == 4){
            let temp = 100;
        }
    }
}