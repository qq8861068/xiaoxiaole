import ResManager from "./ResManager";
import Common from "../common/Common";
import Block from "../Block";
import Define from "../common/Define";
import LDataLevelsManager from "../datas/LDataLevelsManager";
import UIManager from "./UIManager";
import TimeTaskManager from "./TimeTaskManager";
import SoundManager from "../manager/SoundManager";
import GameManager from "../manager/GameManager";
import TimeTask from "../common/TimeTask";
import WXHelper from "../common/WXHelper";
import UserInfo from "../UserInfo";
import GuidanceMgr from "./GuidanceMgr";
import LDataBlockManager from "../datas/LDataBlockManager";
import LDataBlock from "../datas/LDataBlock";
import CheckCollectShape from "../CheckCollectShape";
import LDataChallengeLevels from "../datas/LDataChallengelevels";
import LDataChallengeLevelsManager from "../datas/LDataChallengelevelsManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BlockManager {

    blockList:Block[] = []
    blockCacheList:Block[] = []
    totalOnlyIndex:number = 0;
    levelInfo:any[] = new Array()
    curMoveBlock:Block = null;
    curMoveBlock2:Block = null;
    delayTimeTask:TimeTask = null;

    skeletonTimeTask:TimeTask = null;


    haveSuggest:boolean = false;

    lianXiao:number = 0;

    maxBlockCount:number = 0;
    curBlockCount:number = 0; //出现镂空的情况格子的数量

    totalChangeBlockTag:number = 0

    gameLoseTaskTime:TimeTask;

    blockBgList:cc.Node [] = []
    isGuiding = false;
    guidStep = 3;
    maxguidStep = 7;
    guidDelay:number[]=[0,0,0,2,2,2,2,2,2,2,2,2]; 

    private static instance:BlockManager = null;
    public static getInstance():BlockManager{
        if(this.instance == null){
            this.instance = new BlockManager();
            //测试用
            // (window as any).BlockManager = this.instance;
        }
        return this.instance;
    }

    //----guidance-----
    public try_show_guid(){
        if(this.guidStep>this.maxguidStep){return;}
        if(this.isGuiding){return;}
        let guid=GuidanceMgr.getInstance();
        if(guid.tryShowGuid(this.guidStep)){
            this.isGuiding=true;
        }
        this.guidStep++;
    }
    public close_guid(){
        if(this.isGuiding){
            let guid=GuidanceMgr.getInstance();
            guid.closeGuid();
            this.isGuiding=false;
            if(this.guidStep<=this.maxguidStep){
                setTimeout(function(){
                    this.try_show_guid();
                }.bind(this),this.guidDelay[this.guidStep]*1000);
            }
            
        }
    }
    public end_guid(){
        if(this.isGuiding){
            this.isGuiding=false;
        }
        let guid=GuidanceMgr.getInstance();
        guid.endGuid();
    }
    
    //-----------------
    
    //创建一个格子
    createBlockById(row:number,col:number,blockId:number,callBack:Function = null,nodeRoot:cc.Node = null,isAddTag:boolean = true,newBlockId:number = null){

        if(this.blockCacheList.length > 0){
            let block:Block = this.blockCacheList[0]
            this.blockCacheList.splice(0,1)
            nodeRoot.addChild(block.node)
            block.initRowCol(row,col,blockId)
            if(isAddTag){
                this.blockList.push(block)
            }
            if(callBack){
                callBack(block)
            }
            return
        }
        ResManager.loadBlock(blockId,function(prefab){
            let blockNode:cc.Node = cc.instantiate(prefab)
            nodeRoot.addChild(blockNode)
            let block:Block = blockNode.addComponent<Block>(Block);
            if(isAddTag){
                this.blockList.push(block)
            }

            if(newBlockId != null && newBlockId != 0){
                let newDataBlock:LDataBlock =  LDataBlockManager.GetDataById(newBlockId)
                if(newDataBlock != null ){ 
                    if(newDataBlock.whetherCover){
                        //说明是藤蔓
                        block.initRowCol(row,col,blockId)
                        block.setCoverBlock(newBlockId)

                    }else{
                        //说明是阻碍道具  或者是 收集树叶的道具
                        block.initRowCol(row,col,newBlockId)
                    }
                }
            }else{
                block.initRowCol(row,col,blockId)
            }
            if(callBack){
                callBack(block)
            }
        }.bind(this))
    }

    initLevelInfo(level:number){
        //优先加载障碍信息
        this.loadMapData("obstacle" + Common.curLevelData.obstacle.toString(),function(obstacleArr){
            console.log("ssssssssssss")
            console.log(obstacleArr[0][0])
            
            if(Common.curLevelData.mapData != -9999){

                this.loadMapData("level"+Common.curLevelData.mapData.toString(),function(infoArr){
                    for (let i = 0; i < Define.maxRow; i++) {
                        for (let j = 0; j < Define.maxCol ; j++) {
                            if(this.levelInfo[i][j] == 1){
                                BlockManager.getInstance().createBlockById(i,j,infoArr[i][j],null,Common.blockNodeRoot,true,obstacleArr[i][j])
                            }
                        }
                    }
                }.bind(this))
                
            }else{
                let infoArr:any[] = new Array()
                for (let index = 0; index < Define.maxRow; index++) {
                    infoArr.push(new Array())   
                }
                for (let i = 0; i < Define.maxRow; i++) {
                    for (let j = 0; j < Define.maxCol ; j++) {
                        if(this.levelInfo[i][j] == 1){
                            this.createBlockInfo(i,j,infoArr)
                            BlockManager.getInstance().createBlockById(i,j,infoArr[i][j],null,Common.blockNodeRoot,true,obstacleArr[i][j])
                        }
                    }
                }
            }

        }.bind(this))
    }
    //加载地图数据
    loadMapData(url:string,callBack:Function){
        let infoArr:any[] = new Array()
        for (let index = 0; index < Define.maxRow; index++) {
            infoArr.push(new Array())   
        }
        ResManager.loadMapData(url,function(info){
            console.log(info)
            let mapArr:string [] =  info.split(';')
            for (let index = 0; index < mapArr.length; index++) {
                let arr:string [] = mapArr[index].split(',')
                if(arr.length == 3){
                    let row = parseInt(arr[0])
                    let col = parseInt(arr[1])
                    let value = parseInt(arr[2])   
                    infoArr[row][col] = value
                }else{
                    console.log("loadMapData 数据错误...")
                }
            }
            callBack(infoArr)
        }.bind(this))
    }

    initAllBlocks(level:number,blockBg:cc.Node,isChall:boolean = false){

        if(isChall){
            Common.curLevelData = LDataChallengeLevelsManager.GetDataById(level)
            Common.isChallenge = true;
        }else{
            Common.curLevelData = LDataLevelsManager.GetDataById(level)
            Common.isChallenge = false;
        }
        
        if(Common.curLevelData  == null){
            console.log("关卡数据错误.....................")
            return
        }

        this.maxBlockCount = 0
        Common.curTotalStep = Common.curLevelData.step;
        UIManager.getInstance().sendMessage(Define.viewMain,"step")
        for (let index = 0; index < Define.maxRow; index++) {
            this.levelInfo.push(new Array())   
        }

        UIManager.getInstance().sendMessage(Define.viewMain,"changeMapMask",Common.curLevelData.mapType)
        //这里去加载数据
        ResManager.loadMapData('map'+Common.curLevelData.mapType.toString(),function(info){
            //console.log(info)
            let mapArr:string [] =  info.split(';')
            for (let index = 0; index < mapArr.length; index++) {
                let arr:string [] = mapArr[index].split(',')
                if(arr.length == 3){
                    let row = parseInt(arr[0])
                    let col = parseInt(arr[1])
                    let id = parseInt(arr[2])   
                    this.levelInfo[row][col] = id

                    if(id == 1){
                        this.maxBlockCount = this.maxBlockCount + 1
                    }
                    //this.createBlockBg(blockBg,row,col,this.levelInfo[row][col])
                }else{
                    console.log("数据错误...")
                }
            }
            this.try_show_guid();
            this.curBlockCount = this.maxBlockCount
            this.getMaxRowByCol(0)
            this.initLevelInfo(level)
        }.bind(this))
    }

    createBlockBg(node:cc.Node,row:number,col:number,id:number){
        if(id > 0){
            let tempNode:cc.Node = cc.instantiate(node)
            Common.blockNodeRoot.addChild(tempNode)
            tempNode.position =  Common.getBlockPosByRowCol(row,col)
            this.blockBgList.push(tempNode)
        }       
    }

    updateTime(dt){
        if(Common.isGameOver){
            return
        }
        let totalCount:number = 0
        for (let index = 0; index < this.blockList.length; index++) {
            let block:Block = this.blockList[index]
            block.updateTime(dt)
            if(block.targetRow == -1){
                totalCount = totalCount + 1
            }
        }

        
        if(this.blockList.length > 0 && totalCount == this.blockList.length && totalCount == this.curBlockCount){
            Common.isHaveBlockDroping = false
            if(!Common.isPlayAni && Common.isCanMoveBlockTag){
                if(Common.gameProgress == Define.gameCollectFinish){
                    Common.gameProgress = Define.gameFlyEffect

                    /******************************************************************************/
                    //在这里调用统计输出函数
                    Common.ShowDaoJuSum();


                    if(Common.curTotalStep > 0){
                        //胜利音效
                        Common.useTempTotalStep = Common.curTotalStep;
                        SoundManager.palySoundById(Define.victory,false);
                        Common.nodePromptRoot.getComponent<cc.Sprite>(cc.Sprite).spriteFrame = Common.atlasBlock.getSpriteFrame(Define.promptSpriteArr[3]);
                        Common.nodePromptRoot.scale = 0;
                        Common.nodePromptRoot.runAction(cc.sequence(cc.scaleTo(0.3, 1.2), cc.scaleTo(0.2, 0.8),cc.scaleTo(0.2, 1),cc.scaleTo(0.2, 0.9),cc.scaleTo(0.4, 0)));


                        //cc.audioEngine.pauseMusic();
                        SoundManager.pauseBackGroundSound(true,Common.curMusicRes)
                        //cc.audioEngine.setMusicVolume(0.1)
                        
                        SoundManager.palySoundById(Define.shengliyinxiao,false);
                        console.log("可以执行飞特效了")
                        this.selectFlyTargetBlock()
                    }else{
                        console.log("可以结算了..................")
                        //胜利音效
                        Common.isGameOver = true
                        Common.isCheckGameOver = false
                        SoundManager.palySoundById(Define.victory,false);
                        Common.nodePromptRoot.getComponent<cc.Sprite>(cc.Sprite).spriteFrame = Common.atlasBlock.getSpriteFrame(Define.promptSpriteArr[3]);
                        Common.nodePromptRoot.scale = 0;
                        TimeTaskManager.removeTimeTask("showGameOver")
                        Common.nodePromptRoot.runAction(cc.sequence(cc.scaleTo(0.3, 1.2), cc.scaleTo(0.2, 0.8),cc.scaleTo(0.2, 1),cc.scaleTo(0.2, 0.9),cc.scaleTo(0.4, 0),cc.callFunc(function(){
                            
                            if(Common.gameModel == Define.gameModel_Normal){
                                UIManager.getInstance().showView(Define.viewVictory)
                            }else if(Common.gameModel == Define.gameModel_Challenge){
                                UIManager.getInstance().showView(Define.viewChallengeVictory)
                            }
                            //UIManager.getInstance().showView(Define.viewVictory)
                        }.bind(this))))                   
                    }

                } else if(Common.gameProgress == Define.gameFlyEffectDropFinish){
                    console.log("可以结算了..................")
                    Common.isGameOver = true

                    if(Common.gameModel == Define.gameModel_Normal){
                        UIManager.getInstance().showView(Define.viewVictory)
                    }else if(Common.gameModel == Define.gameModel_Challenge){
                        UIManager.getInstance().showView(Define.viewChallengeVictory)
                    }
                    //UIManager.getInstance().showView(Define.viewVictory)
                }else if(Common.curTotalStep == 0 && Common.gameProgress == Define.gameing){

                    // if(!TimeTaskManager.checkIsExistByOnlyTag("showGameOver")){
                    //     TimeTaskManager.addTimeTask(2,function(){
                    //         UIManager.getInstance().sendMessage(Define.viewMain,'gameover',null)
                    //         Common.isGameOver = true
                    //         console.log("游戏失败.......")
                    //     }.bind(this),"showGameOver",1)
                    // }
                }
            }
        }else{
            
            Common.isHaveBlockDroping = true
        }
    }

    selectFlyTargetBlock(){
        let posList:Block [] = [] 
        

        let randomArr:number[]= [];
        let j=0;
        for(let i = 0;i<this.blockList.length;i++)
        {   
              if(this.blockList[i].data.eliminateType==1){
                randomArr[j++]=i;
              }
        }

        //这里做个优化
        let size:number = Math.min(randomArr.length,Common.curTotalStep)

        Common.RandomSort(randomArr);      
        for (let index = 0; index < size; index++) {
            posList.push(this.blockList[randomArr[index]])
        }
        UIManager.getInstance().sendMessage(Define.viewMain,"flyEffect",posList)
    }
    //移除
    removeBlockFlyEffect(posList:Block []){
        //
        SoundManager.palySoundById(Define.wuxiaoyinxiao,false);
        let totalNum:number = 0;
        for (let index = 0; index < posList.length; index++) {
            if(Common.getRandom(0,2) == 1){
                Common.isPlayAni=true;

                //横着的
                Common.playSkeletonById(Define.skeleton_hengshutishi,Common.nodeSpineRoot,posList[index].getScenePos().x,posList[index].getScenePos().y,null,false,true)
                Common.playSkeletonById(Define.skeleton_hengshuxiao,Common.nodeSpineRoot,750,posList[index].getScenePos().y,null,true,true)
                
                GameManager.getInstance().node.runAction(cc.sequence(cc.delayTime(0.8),cc.callFunc(function(){
                    this.removeBlocksByRow(posList[index].row);
                    Common.isPlayAni=false;
                    totalNum = totalNum + 1
                    if(totalNum == posList.length){
                        this.removeBlockFlyEffectFinish()
                    }
                }.bind(this))))
                
                
            }else{

                //竖着的
                Common.isPlayAni=true;
                Common.playSkeletonById(Define.skeleton_hengshutishi,Common.nodeSpineRoot,posList[index].getScenePos().x,posList[index].getScenePos().y,null,false,true)
                Common.playSkeletonById(Define.skeleton_hengshuxiao,Common.nodeSpineRoot,posList[index].getScenePos().x,200,null,false,true)
                
                GameManager.getInstance().node.runAction(cc.sequence(cc.delayTime(0.8),cc.callFunc(function(){
                    this.removeBlocksByCol(posList[index].col);
                    Common.isPlayAni=false;
                    totalNum = totalNum + 1
                    if(totalNum == posList.length){
                        this.removeBlockFlyEffectFinish()
                    }
                    
                }.bind(this))))
                
               
            }
        }
    
    }

    removeBlockFlyEffectFinish(){
        if(Common.gameProgress == Define.gameFlyEffect){
            

            //cc.audioEngine.resumeMusic();
            SoundManager.pauseBackGroundSound(false,Common.curMusicRes)
            //cc.audioEngine.setMusicVolume(0.3)
            this.handlerBlocks()
            Common.isFlyEnd = true;
            Common.gameProgress = Define.gameFlyEffectDropFinish

            //金币增加
            //UserInfo.addGold(posList.length*20);
            //UIManager.getInstance().sendMessage(Define.viewMain,'gold',cc.v2(360,640))
        }
    }

    createBlockInfo(row:number,col:number,infoArr:any[]){
        let id  = Common.getRandomBlockId()

        //检测左边
        if(col - 1 >= 0){
            let tempId = infoArr[row][col - 1] 
            if(tempId == id){
                if(col - 2 >= 0){
                    tempId = infoArr[row][col - 2] 
                    if(tempId == id){
                        //说明左边有两个相同的
                        this.createBlockInfo(row,col,infoArr)
                        return
                    }
                }
            }
        }
        //检测下边
        if(row - 1 >= 0){
            let tempId = infoArr[row - 1][col]
            if(tempId == id){
                if(row - 2 >= 0){
                    tempId = infoArr[row - 2][col]
                    if(tempId == id){
                        //说明左边有两个相同的
                        this.createBlockInfo(row,col,infoArr)
                        return
                    }
                }
            }
        }

        //检测四个相邻的情况
        let leftId = -999
        let leftDownId = -999
        let downId = -999
        //let leftId = infoArr[row][col - 1] 
        // let leftDownId = infoArr[row - 1][col-1]
        // let downId = infoArr[row - 1][col]
        if(col - 1 >= 0){
            leftId = infoArr[row][col - 1]
        }
        if(row - 1 >= 0 && col-1 >= 0){
            leftDownId = infoArr[row - 1][col-1]
        }
        if(row - 1 >= 0){
            downId = infoArr[row - 1][col]
        }

        if(id == leftId && id == leftDownId && id == downId){
            //说明出现了四消除的情况
            //console.log("出现了四消除的情况")
            this.createBlockInfo(row,col,infoArr)
            return
        }

        infoArr[row][col] = id
    }

    //交换位置
    changePosByBlockAndDir(block:Block,dir:number){
        let row:number = block.row
        let col:number = block.col

        let pos = block.getScenePos();
        let dirRotation:number = 0;
        if(dir == Define.up){
            row = row + 1;
            dirRotation=-90;
        }else if(dir == Define.down){
            row = row - 1;
            dirRotation=90;
        }else if(dir == Define.left){
            col = col - 1;
            dirRotation=180;
        }else if(dir == Define.right){
            col = col + 1;
            dirRotation=0;
        }

        this.changePosByBlockAndBlock(block,this.getBlockByRowCol(row,col),dirRotation)
    }
    //交换位置
    changePosByBlockAndBlock(block:Block,block1:Block,dirRotation:number){
        if(this.isGuiding){
            this.close_guid();
        }
        if(Common.curTotalStep <= 0){
            return
        }
        if(Common.curSelectBlock != null)
        {

            if(Common.oldSelectBlock!=null)
            {
                Common.oldSelectBlock.moveDianjiSkeleton();
            }
            //Common.oldSelectBlock.moveDianjiSkeleton();
            Common.oldSelectBlock = null;
            Common.nodeSelectedRoot.setPosition(10000,10000);
            Common.curSelectBlock.isSelected = false;
            Common.curSelectBlock = null;
        }        

        if(Common.isBlockMoving){
            console.log("移动中不可以移动.............")
            return
        }

        if(Common.isGameOver){
            return
        }
        if(block1 != null){

            if(block1.blockId == Define.blockNoneId || block.blockId ==  Define.blockNoneId){
                return
            }
            if(!block.isCanMove() || !block1.isCanMove()){
                return
            }

            //彩虹spine
            let pos = block.getScenePos();
            if(dirRotation != -1){
                Common.playSkeletonById(Define.skeleton_qiehuantishi,Common.nodeSpineRoot,pos.x,pos.y,function(effectNode:cc.Node){                                   
                    effectNode.rotation=dirRotation;
                }.bind(this),false,true)
            }

            this.totalChangeBlockTag = 0
            this.lianXiao = 0;

            Common.isBlockMoving = true;
            Common.isCanMoveBlockTag = false
            Common.isGestureMove = true;

            block1.changePosByTargetBlock(block,() => this.changeBlockPosFinish(block, block1))
            block.changePosByTargetBlock(block1,() => this.changeBlockPosFinish(block, block1))

            this.curMoveBlock = block;
            this.curMoveBlock2 = block1;
            Common.curSelectBlock = null;
            Common.oldSelectBlock = null;
        }
    }
    //改变动作完成
    changeBlockPosFinish(block: Block, block1: Block){
        this.totalChangeBlockTag = this.totalChangeBlockTag + 1
        if(this.totalChangeBlockTag == 2){
            Common.isBlockMoving = false;
            //预检查逻辑，如果两个方块互换后并没有可以消除的，再换回来且不扣步数。
            let arrAll:Block [] [] [] = []
            //行
            for (let i = 0; i < Define.maxRow; i++) {
                let arr = this.findNearBlock(i,true)
                if(arr.length > 0){
                    arrAll.push(arr)
                }
            }
            //列
            for (let i = 0; i < Define.maxCol; i++) {
                let arr = this.findNearBlock(i,false)
                if(arr.length > 0){
                    arrAll.push(arr)
                }
            }
            //检测方块消除
            let squareBlock:Block [][] =  this.findNearSquareBlock()
            if(squareBlock.length > 0){
                arrAll.push(squareBlock)
            }

            // console.log('changeBlockPosFinish', arrAll)
            if (arrAll.length > 0) {
                //交换后步数减去 1
                Common.curTotalStep = Common.curTotalStep - 1
                UIManager.getInstance().sendMessage(Define.viewMain,'step');
                //进行消除
                this.checkBlockDrop()
            } else {
                //不进行消除
                this.curMoveBlock = null;
                this.curMoveBlock2 = null;
                Common.isCanMoveBlockTag = true;
                Common.isGestureMove = false;
                //把自己换回去
                Common.isBlockMoving = true;
                block1.changePosByTargetBlock(block,() => {})
                block.changePosByTargetBlock(block1,() => {
                    Common.isBlockMoving = false;
                })
            }
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
    //获得指定列
    getBlocksByCol(col:number){
        let blocks:Block [] = []
        for (let index = 0; index < this.blockList.length; index++) {
            let block = this.blockList[index]
            if(block.col == col){
                blocks.push(block)
            }
        }
        return blocks
    }
    //获得指定行
    getBlocksByRow(row:number){
        let blocks:Block [] = []
        for (let index = 0; index < this.blockList.length; index++) {
            let block = this.blockList[index]
            if(block.row == row){
                blocks.push(block)
            }
        }
        return blocks
    }

    invalidBlock:Block [] = [];
    //移除block 
    removeBlockByRowCol(row,col,isShuye?:boolean,isCheckNear:boolean = true){
        // if(isShuye)
        // {


        //     return;
        // }
        for (let index = 0; index < this.blockList.length; index++) {
            let block:Block = this.blockList[index]
            if(block.row == row && block.col == col){

                if(block.data.ID == 0){
                    block.node.removeFromParent(false)
                    this.blockCacheList.push(block)
                    this.blockList.splice(index,1)
                    break
                }
                // if(block.data.eliminateType==5){
                //     block.node.removeFromParent(false)
                //     this.blockCacheList.push(block)
                //     this.blockList.splice(index,1)
                //     UIManager.getInstance().sendMessage(Define.viewMain,'collectshuye',block)
                //     break;
                // }

                if(block.data.eliminateType != 2 && block.data.eliminateType != 4 && isCheckNear){
                    this.checkRemoveNearBlock(block)
                }
                if(block.subHp()){

                    if(block.data.invitationAward == 4){
                        if(block.blockId==11)
                        {
                            console.log("调用死亡动画")
                            block.changeYidongGuai(block.blockId,true);
                        }
                        
                    }

                    if(block.getDropTag()){
                        this.removeNoneBlock(block)
                    }
                    //说明已经死亡

                    // if(block.data.whetherCover==true)
                    // {
                    //     console.log("收集藤蔓:::::"+block.blockId)
                    // }  
                    
                    if(block.data.invitationAward==2&&block.data.eliminateType==2)
                    {
                        
                        Common.playSkeletonById(Define.skeleton_huaxiao,Common.nodeSpineRoot,block.getScenePos().x,block.getScenePos().y,null,false,true);
                    }
                    UIManager.getInstance().sendMessage(Define.viewMain,'collect',block)
                    if(block.isPrompt==true) block.cancleGuideEffect();                    
                    UserInfo.addGold(1,false);
                    UIManager.getInstance().sendMessage(Define.viewMain,'gold',block.getScenePos()); 
                    
                    //统计道具
                    Common.DaoJuSum[block.blockId]++;

                    block.node.removeFromParent(false)
                    //console.log("index = " + index.toString())
                    this.blockCacheList.push(block)
                    this.blockList.splice(index,1)
                }
                break
            }
        }
        
        while(this.invalidBlock.length > 0){
            let tempBlock:Block = this.invalidBlock[0]
            this.invalidBlock.splice(0,1)
            this.removeBlockByRowCol(tempBlock.row,tempBlock.col)
        }
    }
    //移除方块通过行
    removeBlocksByRow(row:number){
        let blocks:Block[] = this.getBlocksByRow(row)
        for (let r1 = 0; r1 < blocks.length; r1++) {
            if(blocks[r1].data.eliminateType == 2){ //邻近的被消除这个砖块才被消除
                continue
            }
            this.removeBlockByRowCol(blocks[r1].row,blocks[r1].col)   
        }
    }
    //移除方块通过列
    removeBlocksByCol(col:number){
        let blocks:Block[] = this.getBlocksByCol(col)
        for (let r1 = 0; r1 < blocks.length; r1++) {
            if(blocks[r1].data.eliminateType == 2){ //邻近的被消除这个砖块才被消除
                continue
            }
            this.removeBlockByRowCol(blocks[r1].row,blocks[r1].col)   
        }
    }
    //检测block下落状态
    checkBlockDrop(){
        if(Common.isFlyEnd)
        {
            return;
        }
        //console.log("道具数量："+this.blockList.length);
        for (let index = 0; index < this.blockList.length; index++) {
            if(this.blockList[index].targetRow != -1){
                return
            }
        }

        //console.log("checkBlockDrop 000000000000000")
        TimeTaskManager.removeTimeTask('changePosByBlockAndBlock')
        TimeTaskManager.addTimeTask(0.1,function(){    
            //console.log("checkBlockDrop 111111111111111111")        
            this.handlerBlocks()  
            Common.isCanMoveBlockTag = true;
        }.bind(this),"changePosByBlockAndBlock",1)
        
    }
    //处理移除效果
    handlerBlocks(){
        if(Common.gameProgress == Define.gameCollectFinish){ return }
        if(Common.isBlockMoving){ return }
        if(Common.isBlockFly){ return }
        //console.log("handlerBlocks 2222222222222222222222")  
        TimeTaskManager.resetIntervalTime(2,"showGameOver")
        //console.log("交换位置完成")
        let arrAll:Block [] [] [] = []
        //行
        for (let i = 0; i < Define.maxRow; i++) {
            let arr = this.findNearBlock(i,true)
            if(arr.length > 0){
                arrAll.push(arr)
            }
        }
        //列
        for (let i = 0; i < Define.maxCol; i++) {
            let arr = this.findNearBlock(i,false)
            if(arr.length > 0){
                arrAll.push(arr)
            }
        }

        //树叶消除
        // let shuyeBlock:Block[]=this.findDownShuye()
        // if(shuyeBlock.length > 0)
        // {
        //     for(let i=0;i<shuyeBlock.length;i++)
        //     {
        //         this.removeBlockByRowCol(shuyeBlock[i].row,shuyeBlock[i].col);
        //     }           
        // }

        //检测方块消除
        let squareBlock:Block [][] =  this.findNearSquareBlock()
        if(squareBlock.length > 0){
            arrAll.push(squareBlock)
        }
        
        let moveRow:number = -1 
        let moveCol:number = -1

        let moveRow2:number = -1 
        let moveCol2:number = -1

        let blockPos = cc.Vec2.ZERO;
        let blockPos2 = cc.Vec2.ZERO;

        if(this.curMoveBlock != null){
            moveRow = this.curMoveBlock.row
            moveCol = this.curMoveBlock.col
            blockPos = cc.v2(this.getBlockByRowCol(moveRow,moveCol).getScenePos());
        }
        if(this.curMoveBlock2 != null){
            moveRow2 = this.curMoveBlock2.row
            moveCol2 = this.curMoveBlock2.col
            blockPos2 = cc.v2(this.getBlockByRowCol(moveRow2,moveCol2).getScenePos());
        }

        //Todo 这里处理执行的收集图形 这里传入图形的id  (1 - 6)
        //Todo:if()
        if(Common.collectFormID!=0){
            new CheckCollectShape().checkCollect(Common.collectFormID);
        }
        

        let showPrompt:string = ""

        let maxNum:number = arrAll.length 
        let curNum:number = 0
        if(arrAll.length > 0){
            for (let index = 0; index < arrAll.length; index++) {
                let tempArr = arrAll[index]
                for (let i = 0; i < tempArr.length; i++) {
                    let tempArr1 = tempArr[i]

                    this.lianXiao++;
                    // let duoxiao = '';
                    // switch(this.lianXiao)
                    // {
                    //     case 1:duoxiao=Define.duoxiao1; break;
                    //     case 2:duoxiao=Define.duoxiao2; break;
                    //     case 3:duoxiao=Define.duoxiao3; break;
                    //     case 4:duoxiao=Define.duoxiao4; break;
                    //     case 5:duoxiao=Define.duoxiao5; break;
                    //     case 6:duoxiao=Define.duoxiao6; break;
                    //     case 7:
                    //     default:duoxiao=Define.duoxiao7; break;           
                    // }
                    this.lianXiao = Math.min(this.lianXiao,7);

                    //console.log("播放连消音效"+this.lianXiao)
                    SoundManager.palySoundById(Define.duoxiao[this.lianXiao],false);

                    let SkeletonPos = cc.Vec2.ZERO;

                    let removeRow:number =-1;
                    let removeCol:number =-1;
                    if(tempArr1.length <= 3)
                    {
                        SoundManager.palySoundById(Define.sanxiaoyinxiao,false);

                        //三个消除 列
                        // if(tempArr1[0].col == tempArr1[1].col && tempArr1[0].col == tempArr1[2].col){
                        //     console.log("检测到三个消除列");
                        //     this.checkTBlock(tempArr1);
                        //     this.checkLBlock(tempArr1);                           
                        // }

                        for (let j = 0; j < tempArr1.length; j++) {
                            let row:number = (tempArr1[j] as Block).row
                            let col:number = (tempArr1[j] as Block).col
                            if(this.getBlockByRowCol(row,col)!=null)
                            {
                                Common.isPlayAni = true;
                                let pos = cc.v2(this.getBlockByRowCol(row,col).getScenePos());
                                Common.playSkeletonById(Define.skeleton_xiaoshi,Common.nodeSpineRoot,pos.x,pos.y,null,false,true)
                            }  
                            
                            GameManager.getInstance().node.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
                                this.removeBlockByRowCol(row,col);
                                curNum = curNum + 1
                                Common.isPlayAni = false;
                                this.createNewBlcoks(maxNum,curNum)
                            }.bind(this)))) 

                        }
                    }else if(tempArr1.length == 4){

                        SoundManager.palySoundById(Define.sixiaoyinxiao,false);
                        //UIManager.getInstance().sendMessage(Define.viewMain,'juesedonghua1')

                        WXHelper.brateShort();
                        if(showPrompt != Define.promptSpriteArr[2]){
                            showPrompt = Define.promptSpriteArr[1]
                        }
                       
                        // Common.nodePromptRoot.getComponent<cc.Sprite>(cc.Sprite).spriteFrame = Common.atlasBlock.getSpriteFrame(Define.promptSpriteArr[1]);
                        // Common.nodePromptRoot.runAction()

                        //消除 行 列
                        if(tempArr1[0].row == tempArr1[1].row && tempArr1[0].row == tempArr1[2].row){
                            //相同行
                            if(this.curMoveBlock == null && this.curMoveBlock2 == null)
                            {
                                SkeletonPos = cc.v2(tempArr1[tempArr1.length-1].getScenePos());
                            } 
                            else
                            {
                                SkeletonPos = this.curMoveBlock.row == tempArr1[0].row ? blockPos:blockPos2;
                            }                          
                            Common.isPlayAni = true;
                            removeRow = tempArr1[0].row;

                            Common.playSkeletonById(Define.skeleton_hengshutishi,Common.nodeSpineRoot,SkeletonPos.x,SkeletonPos.y,null,false,true)
                            //Common.playSkeletonById(Define.skeleton_hengshuxiao,Common.nodeSpineRoot,750,SkeletonPos.y,null,false,true)
                            Common.playSkeletonById(Define.skeleton_hengshuxiao,Common.nodeSpineRoot,750,SkeletonPos.y,null,true,true)
                            //console.log("开始播放动画....................")
                            GameManager.getInstance().node.runAction(cc.sequence(cc.delayTime(0.8),cc.callFunc(function(){
                                this.removeBlocksByRow(removeRow);
                                curNum = curNum + 1
                                Common.isPlayAni = false;
                                this.createNewBlcoks(maxNum,curNum)
                                //console.log("动画播放完成 执行移除....................")
                            }.bind(this))))
                            
                        }else if(tempArr1[0].col == tempArr1[1].col && tempArr1[0].col == tempArr1[2].col){
                            //消除相同列
                            if(this.curMoveBlock == null && this.curMoveBlock2 == null)
                            {
                                SkeletonPos = cc.v2(tempArr1[0].getScenePos());
                            }   
                            else
                            {
                                SkeletonPos = this.curMoveBlock.col == tempArr1[0].col ? blockPos:blockPos2;
                            }                         
                            Common.isPlayAni = true;
                            removeCol = tempArr1[0].col;
                            
                            Common.playSkeletonById(Define.skeleton_hengshutishi,Common.nodeSpineRoot,SkeletonPos.x,SkeletonPos.y,null,false,true)
                            //Common.playSkeletonById(Define.skeleton_hengshuxiao,Common.nodeSpineRoot,SkeletonPos.x,1334,null,true,true)
                            Common.playSkeletonById(Define.skeleton_hengshuxiao,Common.nodeSpineRoot,SkeletonPos.x,200,null,false,true)
                            //console.log("开始播放动画....................")
                            GameManager.getInstance().node.runAction(cc.sequence(cc.delayTime(0.8),cc.callFunc(function(){
                                this.removeBlocksByCol(removeCol)
                                curNum = curNum + 1
                                Common.isPlayAni = false;
                                this.createNewBlcoks(maxNum,curNum)
                                //console.log("动画播放完成 执行移除....................")
                            }.bind(this)))) 
                            
                        }else{
                           //console.log("新的四消除的方式")
                            SoundManager.palySoundById(Define.sanxiaoyinxiao,false);
                            for (let j = 0; j < tempArr1.length; j++) {
                                let row:number = (tempArr1[j] as Block).row
                                let col:number = (tempArr1[j] as Block).col
                                if(this.getBlockByRowCol(row,col)!=null)
                                {
                                    Common.isPlayAni = true;
                                    let pos = cc.v2(this.getBlockByRowCol(row,col).getScenePos());
                                    Common.playSkeletonById(Define.skeleton_xiaoshi,Common.nodeSpineRoot,pos.x,pos.y,null,false,true)
                                }  
                                //console.log("开始播放动画....................")
                                GameManager.getInstance().node.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
                                    this.removeBlockByRowCol(row,col);
                                    curNum = curNum + 1
                                    Common.isPlayAni = false;
                                    this.createNewBlcoks(maxNum,curNum)
                                    //console.log("动画播放完成 执行移除....................")
                                }.bind(this)))) 

                            }
                        }
                    }else if(tempArr1.length >= 5){
                        SoundManager.palySoundById(Define.wuxiaoyinxiao,false);   

                        //UIManager.getInstance().sendMessage(Define.viewMain,'juesedonghua1')
                        WXHelper.brateLong();        
                        showPrompt = Define.promptSpriteArr[2]             
                        //消除 十字
                        if(tempArr1[0].row == tempArr1[1].row){
                            //消除相同行
                            if(this.curMoveBlock == null && this.curMoveBlock2 == null)
                            {
                                SkeletonPos = cc.v2(tempArr1[tempArr1.length-1].getScenePos());
                                removeRow = tempArr1[tempArr1.length-1].row
                                removeCol = tempArr1[tempArr1.length-1].col
                            }
                            else
                            {
                                SkeletonPos = this.curMoveBlock.row == tempArr1[0].row ? blockPos:blockPos2;
                                removeRow = this.curMoveBlock.row == tempArr1[0].row ? moveRow:moveRow2;
                                removeCol = this.curMoveBlock.row == tempArr1[0].row ? moveCol:moveCol2;
                            }

                            Common.isPlayAni = true;
                            Common.playSkeletonById(Define.skeleton_hengliexiao,Common.nodeSpineRoot,SkeletonPos.x,SkeletonPos.y,null,false,true)                        
                            //Common.playSkeletonById(Define.skeleton_hengliexiao,Common.nodeSpineRoot,SkeletonPos.x,SkeletonPos.y,null,true,true)
                           // console.log("开始播放动画....................")
                            GameManager.getInstance().node.runAction(cc.sequence(cc.delayTime(0.8),cc.callFunc(function(){
                                this.removeBlocksByRow(removeRow)
                                this.removeBlocksByCol(removeCol)
                                curNum = curNum + 1
                                Common.isPlayAni = false;
                                this.createNewBlcoks(maxNum,curNum)
                                //console.log("动画播放完成 执行移除....................")
                            }.bind(this)))) 
                            
                        }else
                        {
                            //消除相同列
                            if(this.curMoveBlock == null && this.curMoveBlock2 == null)
                            {
                                SkeletonPos = cc.v2(tempArr1[0].getScenePos());
                                removeRow = tempArr1[0].row
                                removeCol = tempArr1[0].col
                            }
                            else
                            {
                                SkeletonPos = this.curMoveBlock.col == tempArr1[0].col ? blockPos:blockPos2;
                                removeRow = this.curMoveBlock.col == tempArr1[0].col ? moveRow:moveRow2;
                                removeCol = this.curMoveBlock.col == tempArr1[0].col ? moveCol:moveCol2;
                            }
                            Common.isPlayAni = true;
                            Common.playSkeletonById(Define.skeleton_hengliexiao,Common.nodeSpineRoot,SkeletonPos.x,SkeletonPos.y,null,false,true)                        
                            //Common.playSkeletonById(Define.skeleton_hengliexiao,Common.nodeSpineRoot,SkeletonPos.x,SkeletonPos.y,null,true,true)
                            //console.log("开始播放动画....................")
                            GameManager.getInstance().node.runAction(cc.sequence(cc.delayTime(0.8),cc.callFunc(function(){
                                this.removeBlocksByRow(removeRow)
                                this.removeBlocksByCol(removeCol)
                                curNum = curNum + 1
                                Common.isPlayAni = false;
                                this.createNewBlcoks(maxNum,curNum)
                                //console.log("动画播放完成 执行移除....................")
                            }.bind(this)))) 
                        }                        
                    }
                }                
            }
        }else{
            //this.createNewBlcoks(0,0);
            if(Common.curTotalStep == 0 && !Common.isHaveBlockDroping && Common.isCheckGameOver){
                UIManager.getInstance().sendMessage(Define.viewMain,'gameover',null)
                Common.isGameOver = true
            }else{
                if(Common.isGestureMove && !Common.isHaveBlockDroping){
                    this.handlerBlockMoveToTarget()
                }
                this.createNewBlcoks(0,0)
            }
        }

        if(showPrompt.length > 0 && this.curMoveBlock != null){
            if(showPrompt == Define.promptSpriteArr[1]){
                SoundManager.palySoundById(Define.good,false);
                UIManager.getInstance().sendMessage(Define.viewMain,'juesedonghua1')
            }else {
                SoundManager.palySoundById(Define.perfect,false);
                UIManager.getInstance().sendMessage(Define.viewMain,'juesedonghua1')
            }

            Common.nodePromptRoot.getComponent<cc.Sprite>(cc.Sprite).spriteFrame = Common.atlasBlock.getSpriteFrame(showPrompt);
            Common.nodePromptRoot.scale=0;
            Common.nodePromptRoot.runAction(cc.sequence(cc.scaleTo(0.3, 1.2), cc.scaleTo(0.2, 0.8),cc.scaleTo(0.2, 1),cc.scaleTo(0.2, 0.9),cc.scaleTo(0.4, 0)));
        }
        this.curMoveBlock = null
        this.curMoveBlock2 = null       
    }

    clearOneBlock(block: Block) {
        SoundManager.palySoundById(Define.sanxiaoyinxiao,false);
        const SkeletonPos = cc.v2(block.getScenePos());
        Common.isPlayAni = true;
        const removeRow = block.row;
        const removeCol = block.col;
        Common.playSkeletonById(Define.skeleton_xiaoshi,Common.nodeSpineRoot,SkeletonPos.x,SkeletonPos.y,null,false,true)
        //console.log("开始播放动画....................")
        GameManager.getInstance().node.runAction(cc.sequence(cc.delayTime(0.8),cc.callFunc(function(){
            this.removeBlockByRowCol(removeRow, removeCol);
            Common.isPlayAni = false;
            this.createNewBlcoks(0,1)
            //console.log("动画播放完成 执行移除....................")
        }.bind(this))))
    }

    clearOneLineHeng(block: Block) {
        SoundManager.palySoundById(Define.sixiaoyinxiao,false);
        const SkeletonPos = cc.v2(block.getScenePos());
        Common.isPlayAni = true;
        const removeRow = block.row;
        Common.playSkeletonById(Define.skeleton_hengshutishi,Common.nodeSpineRoot,SkeletonPos.x,SkeletonPos.y,null,false,true)
        //Common.playSkeletonById(Define.skeleton_hengshuxiao,Common.nodeSpineRoot,750,SkeletonPos.y,null,false,true)
        Common.playSkeletonById(Define.skeleton_hengshuxiao,Common.nodeSpineRoot,750,SkeletonPos.y,null,true,true)
        //console.log("开始播放动画....................")
        GameManager.getInstance().node.runAction(cc.sequence(cc.delayTime(0.8),cc.callFunc(function(){
            this.removeBlocksByRow(removeRow);
            Common.isPlayAni = false;
            this.createNewBlcoks(0,1)
            //console.log("动画播放完成 执行移除....................")
        }.bind(this))))
    }

    clearOneLineShu(block: Block) {
        SoundManager.palySoundById(Define.sixiaoyinxiao,false);
        const SkeletonPos = cc.v2(block.getScenePos());
        Common.isPlayAni = true;
        const removeCol = block.col;
        Common.playSkeletonById(Define.skeleton_hengshutishi,Common.nodeSpineRoot,SkeletonPos.x,SkeletonPos.y,null,false,true)
        //Common.playSkeletonById(Define.skeleton_hengshuxiao,Common.nodeSpineRoot,SkeletonPos.x,200,null,true,true)
        Common.playSkeletonById(Define.skeleton_hengshuxiao,Common.nodeSpineRoot,SkeletonPos.x,200,null,false,true)
        //console.log("开始播放动画....................")
        GameManager.getInstance().node.runAction(cc.sequence(cc.delayTime(0.8),cc.callFunc(function(){
            this.removeBlocksByCol(removeCol)
            Common.isPlayAni = false;
            this.createNewBlcoks(0,1)
            //console.log("动画播放完成 执行移除....................")
        }.bind(this)))) 
    }

    createNewBlcoks(maxNum:number,curNum){

        //console.log("maxNum "+maxNum+" curNum "+curNum);
        if(maxNum > curNum){
            return
        }
        //console.log("handlerBlocks bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb")
        this.delayTimeTask = TimeTaskManager.addTimeTask(0.5,function(){

   
            this.delayTimeTask = null
            TimeTaskManager.removeTimeTask("blockManagerDelay")
            //移除完成之后需要重新制定 block 的目标行数 使方块进行下落

            //console.log("检测创建方块......................")
            //console.log("this.blockList.length = " + this.blockList.length)

            let totalBarCount:number = 0
            for (let index = 0; index < Define.maxCol; index++) {
                let blocks:Block [] = this.getBlocksByCol(index)
                let tempMaxRow:number = this.getMaxRow(index)
                let tempCount:number = this.getCountByCol(index)
                let barBlocks:Block [] = this.getBarInfo(index)

               // console.log("col = " + index.toString()  + "  count = " + blocks.length + "    tempCount = " + tempCount)

                // for (let index = 0; index < blocks.length; index++) {
                //     console.log("row = " + blocks[index].row + " active" + blocks[index].node.active+" pos " + "  x = "+blocks[index].node.position.x+ "  y = "+blocks[index].node.position.y + "  sx =" + blocks[index].node.scaleX + "  sy =" + blocks[index].node.scaleY + "  opacity = " + blocks[index].node.opacity + "  w = " + blocks[index].node.width + "  h = " + blocks[index].node.height + "  parentName " + blocks[index].node.parent.name)
                // }
                // console.log(tempMaxRow)

                // console.log("tempCount")
                // console.log(tempCount)
      
                if(blocks.length <= tempCount){

                    if(barBlocks.length > 0){
                        //说明要处理障碍情况
                        let lastBarRow:number = 0;
       
                         for (let i = 0; i < Define.maxRow; i++) {
                            if(this.levelInfo[i][index] == 1){
                                let tempBlock:Block = this.getBlockByRowCol(i,index)
                                if(tempBlock == null){
                            
                                    if(lastBarRow <= i && lastBarRow != barBlocks[0].row){
                                        BlockManager.getInstance().createBlockById(i,index,Define.blockNoneId,function(block:Block){
                                            block.setRowCol(i,index)        
                                        }.bind(this),Common.blockNodeRoot)
                                    }
                                }else{
                                    if(tempBlock.getDropTag()){
                                        lastBarRow = tempBlock.row
                                        continue
                                    }
                                    let num:number = i
                                    while(num >= 1){
                                        let downBlock:Block = this.getBlockByRowCol(num - 1,index)
                                        if(downBlock != null && downBlock.blockId == Define.blockNoneId && !tempBlock.getDropTag()){//这里说明两个要交换位置
                                            let tempRow:number = downBlock.row
                                            downBlock.row = tempBlock.row;
                                            tempBlock.row = tempRow
                                        }else{
                                            break
                                        }
                                        num = num - 1
                                    }
                                }
                            }
                        }

                        blocks = this.getBlocksByCol(index)
                 
                        blocks.sort((a, b) => {
                            return a.row - b.row;
                        });

                        let addRow:number = 0
                        //处理镂空掉落
                        //console.log("处理镂空掉落")
                        for (let i = 0; i < Define.maxRow; i++) {
                            if(blocks[i] != null){
                                while(this.levelInfo[i+addRow][index] == 0){
                                    addRow = addRow + 1
                                }
                               // console.log('i = ' + i.toString() + " blocks[i].row = " + blocks[i].row.toString() + " i+addRow  = " + (i+addRow).toString()) 
                               if(blocks[i].blockId == Define.blockNoneId){
                                    blocks[i].setTargetRow(-1)
                                    blocks[i].node.position = Common.getBlockPosByRowCol(blocks[i].row,blocks[i].col)
                                }else{
                                    blocks[i].setTargetRow(i+addRow)
                                }
                            
                            }
                        }
                        //添加新的方块
                        //console.log("添加新的方块")
                        let size:number = blocks.length
                        let total:number = 1;
                        for(let j = size ;j < tempCount ;j++){
                            // //这里处理空的情况
                            BlockManager.getInstance().createBlockById(tempMaxRow+total,index,Common.getRandomBlockId(),function(block:Block){
                                //处理镂空掉落
                                total = total + 1
                                while(this.levelInfo[j+addRow][index] == 0){
                                    addRow = addRow + 1
                                }
                                block.setTargetRow(j+addRow)        
                            }.bind(this),Common.blockNodeRoot)
                        }

                    }else{
                        blocks.sort((a, b) => {
                            return a.row - b.row;
                        });
                        let addRow:number = 0
                        //处理镂空掉落
                        for (let i = 0; i < Define.maxRow; i++) {
                            if(blocks[i] != null){
                                while(this.levelInfo[i+addRow][index] == 0){
                                    addRow = addRow + 1
                                }
                               // console.log('i = ' + i.toString() + " blocks[i].row = " + blocks[i].row.toString() + " i+addRow  = " + (i+addRow).toString()) 
                                if(blocks[i].blockId == Define.blockNoneId){
                                    blocks[i].setTargetRow(-1)
                                    blocks[i].node.position = Common.getBlockPosByRowCol(blocks[i].row,blocks[i].col)
                                }else{
                                    blocks[i].setTargetRow(i+addRow)
                                }
                            
                            }
                        }
                        //添加新的方块
                        let size:number = blocks.length
                        let total:number = 1;
                        for(let j = size ;j < tempCount;j++){
                            // //这里处理空的情况
                            BlockManager.getInstance().createBlockById(tempMaxRow+total,index,Common.getRandomBlockId(),function(block:Block){
                                //处理镂空掉落
                                total = total + 1
                                while(this.levelInfo[j+addRow][index] == 0){
                                    addRow = addRow + 1
                                }
                                block.setTargetRow(j+addRow)        
                            }.bind(this),Common.blockNodeRoot)
                        }
                    }
                }
            }
            this.curBlockCount = this.maxBlockCount - totalBarCount
        }.bind(this),"blockManagerDelay",1)

    }

    checkTBlock(tempArr1)
    {
        //"检测到倒T字型";
        let block1 = this.getBlockByRowCol(tempArr1[0].row,tempArr1[0].col+1);
        let block2 = this.getBlockByRowCol(tempArr1[0].row,tempArr1[0].col-1);
        if(block1!=null&&block2!=null)
        {
            if(block1.blockId==tempArr1[0].blockId&&block2.blockId==tempArr1[0].blockId)
            {
                console.log("检测到倒T字型");
            }
        }
        //"检测到T字型";
        let block3 = this.getBlockByRowCol(tempArr1[2].row,tempArr1[0].col+1);
        let block4 = this.getBlockByRowCol(tempArr1[2].row,tempArr1[0].col-1);
        if(block3!=null&&block4!=null)
        {
            if(block3.blockId==tempArr1[0].blockId&&block4.blockId==tempArr1[0].blockId)
            {
                console.log("检测到T字型");
            }
        }
        //"检测左T字型";
        let block5 = this.getBlockByRowCol(tempArr1[1].row,tempArr1[0].col+1);
        let block6 = this.getBlockByRowCol(tempArr1[1].row,tempArr1[0].col+2);
        if(block5!=null&&block6!=null)
        {
            if(block5.blockId==tempArr1[0].blockId&&block6.blockId==tempArr1[0].blockId)
            {
                console.log("检测到左T字型");
            }
        }
        //"检测右T字型";
        let block7 = this.getBlockByRowCol(tempArr1[1].row,tempArr1[0].col-1);
        let block8 = this.getBlockByRowCol(tempArr1[1].row,tempArr1[0].col-2);
        if(block7!=null&&block8!=null)
        {
            if(block7.blockId==tempArr1[0].blockId&&block8.blockId==tempArr1[0].blockId)
            {
                console.log("检测到右T字型");
            }
        }


    }

    checkLBlock(tempArr1)
    {
        //"检测反L字型";
        let block11 = this.getBlockByRowCol(tempArr1[0].row,tempArr1[0].col-1);
        let block12 = this.getBlockByRowCol(tempArr1[0].row,tempArr1[0].col-2);
        if(block11!=null&&block12!=null)
        {
            if(block11.blockId==tempArr1[0].blockId&&block12.blockId==tempArr1[0].blockId)
            {
                console.log("检测到反L字型");
            }
        }

        //"检测L字型";
        let block13 = this.getBlockByRowCol(tempArr1[0].row,tempArr1[0].col+1);
        let block14 = this.getBlockByRowCol(tempArr1[0].row,tempArr1[0].col+2);
        if(block13!=null&&block14!=null)
        {
            if(block13.blockId==tempArr1[0].blockId&&block14.blockId==tempArr1[0].blockId)
            {
                console.log("检测到L字型");
            }
        }

        //"检测7字型";
        let block15 = this.getBlockByRowCol(tempArr1[2].row,tempArr1[0].col-1);
        let block16 = this.getBlockByRowCol(tempArr1[2].row,tempArr1[0].col-2);
        if(block15!=null&&block16!=null)
        {
            if(block15.blockId==tempArr1[0].blockId&&block16.blockId==tempArr1[0].blockId)
            {
                console.log("检测到7字型");
            }
        }
        //"检测反7字型";
        let block17 = this.getBlockByRowCol(tempArr1[2].row,tempArr1[0].col+1);
        let block18 = this.getBlockByRowCol(tempArr1[2].row,tempArr1[0].col+2);
        if(block17!=null&&block18!=null)
        {
            if(block17.blockId==tempArr1[0].blockId&&block18.blockId==tempArr1[0].blockId)
            {
                console.log("检测到反L字型");
            }
        }
        
    }

    //查找树叶掉落
    // findDownShuye(){
    //     let allBlock:Block[] = [] 
    //     for(let i = 0; i < Define.maxCol; i++)
    //     {
    //         if(this.getBlockByRowCol(0,i)!=null)
    //         {
    //             let block:Block =  this.getBlockByRowCol(0,i);
    //             if(block!= null&&block.data.eliminateType==5)
    //             {
    //                 allBlock.push(block);
    //             }
    //         }
    //         // else if(this.getBlockByRowCol(1,i)!=null)
    //         // {
    //         //     let block:Block =  this.getBlockByRowCol(1,i);
    //         //     if(block!= null&&block.data.eliminateType==5)
    //         //     {
    //         //         allBlock.push(block);
    //         //     }

    //         // }
            
            
    //     }
    //     return allBlock
    // }


    //查找正方形的形状
    findNearSquareBlock(){
        let allBlock:Block [][] = [] 
        for (let i = 0; i < Define.maxRow; i++) {
            for (let j = 0; j < Define.maxCol; j++) {

                let block:Block =  this.getBlockByRowCol(i,j);
                let leftBlock:Block = this.getBlockByRowCol(i,j - 1);
                let leftDownBlock = this.getBlockByRowCol(i - 1,j-1);
                let downBlock = this.getBlockByRowCol(i - 1,j);

                if(block != null && leftBlock != null && leftDownBlock != null && downBlock != null){
                    if(block.data.whetheExchange && block.blockId == leftBlock.blockId && block.blockId == leftDownBlock.blockId && block.blockId == downBlock.blockId){
                        //说明出现了四消除的情况
                        let tempList:Block [] = []
                        tempList.push(block)
                        tempList.push(leftBlock)
                        tempList.push(leftDownBlock)
                        tempList.push(downBlock)
                        allBlock.push(tempList)

                        //console.log("可以四个消除....")
                    }
                }
            }
        }
        return allBlock
    }

    //查找附近的格子 行
    findNearBlock(index:number,isRow:boolean,findCount:number = 3){ //查找的数量用于 提示 
        let lastid:number = -1
        let tempList:Block [] = []
        let allBlock:Block [][] = [] 
        let count:number = isRow?Define.maxCol:Define.maxRow
        for (let i = 0; i <= count; i++) {
            let block:Block = null
            if(isRow){
                block = this.getBlockByRowCol(index,i);
            }else{
                block = this.getBlockByRowCol(i,index);
            }
            if(block == null){
                if(tempList.length >= findCount){
                    //说明找到了三个相同的
                    let newList:Block [] = [] 
                    for (let j = 0; j < tempList.length; j++) {
                        newList.push(tempList[j])
                    }
                    if(newList[0].data.eliminateType == 1){ //消除类型为1的情况才能被3消 4消  5消
                        allBlock.push(newList)
                    }
                }
                lastid = -1
                tempList = [];
                continue
            }
            // if(isRow){
            //     console.log("row = "+index.toString() + "   col  = " + i.toString() + "  blockId = " + block.blockId.toString())
            // }else{
            //     console.log("row = "+i.toString() + "   col  = " + index.toString() + "  blockId = " + block.blockId.toString())
            // }
            
            if(lastid == block.blockId){
                tempList.push(block)
            }else{
                if(tempList.length >= findCount){
                    //说明找到了三个相同的
                    let newList:Block [] = [] 
                    for (let j = 0; j < tempList.length; j++) {
                        newList.push(tempList[j])
                    }
                    if(newList[0].data.eliminateType == 1){ //消除类型为1的情况才能被3消 4消  5消
                        allBlock.push(newList)
                    }
                   
                }
                lastid = block.blockId
                tempList = [];
                tempList.push(block)
            }
        }
        return allBlock
    }
    //获得基础数据一个最大的行
    getMaxRowByCol(col:number){
        let rowArr:number [] = []
        for (let index = 0; index < Define.maxRow; index++) {
            if(this.levelInfo[index][col] == 1){
                rowArr.push(index)
            }
        }
        rowArr.sort(function(a,b){
            return b - a
        })
        if(rowArr.length == 0){
            return 0 
        }
        return rowArr[0]
    }
    //获得障碍的信息
    getBarInfo(col:number){
        let blocks:Block [] = this.getBlocksByCol(col)
        let barArrs:Block [] = []
        for (let index = 0; index < blocks.length; index++) {
            if(blocks[index].getDropTag()){
                barArrs.push(blocks[index])
            }
        }

        barArrs.sort((a, b) => {
            return b.row - a.row;
        });
        return barArrs
    }

    //获得基础数据一个最大的行
    getCountByCol(col:number){
        let count:number = 0
        for (let index = 0; index < Define.maxRow; index++) {
            if(this.levelInfo[index][col] == 1){
                count = count + 1
            }
        }
        return count
    }
    //获取最大行
    getMaxRow(col:number){
        let rowArr:number [] = []
        for (let index = 0; index < Define.maxRow; index++) {
            if(this.levelInfo[index][col] == 1){
                rowArr.push(index)
            }
        }
        rowArr.sort((a, b) => {
            return b - a;
        });
        return  rowArr[0]
    }
    //获得最小行
    getMinRow(col:number){
        let rowArr:number [] = []
        for (let index = 0; index < Define.maxRow; index++) {
            if(this.levelInfo[index][col] == 1){
                rowArr.push(index)
            }
        }
        rowArr.sort((a, b) => {
            return a - b;
        });
        return  rowArr[0]
    }

   //查找间隔的格子 行/列
   findIntervalBlock(index:number,isRow:boolean)
   {
       //console.log("提开始显示示间隔的格子")       
       let allBlock:Block [][] = [];
       let count:number = isRow?Define.maxCol:Define.maxRow
       for (let i = 0; i <= count; i++) {
           let block:Block = null
           if(isRow){
               block = this.getBlockByRowCol(index,i);
               if(block == null) continue;
               let block1:Block = this.getBlockByRowCol(index,i-1);
               let block2:Block = this.getBlockByRowCol(index,i+1);
               if(block1 != null && block2 != null && block1.blockId == block2.blockId)
               {
                   let newList:Block [] = []
                   newList.push(block1,block2);
                   if(newList[0].data.eliminateType == 1){ //消除类型为1的情况才能被3消 4消  5消
                    allBlock.push(newList)
                }
               }
           }else{               
               block = this.getBlockByRowCol(i,index);
               if(block == null) continue;
               let block1:Block = this.getBlockByRowCol(i-1,index);
               let block2:Block = this.getBlockByRowCol(i+1,index);
               if(block1 != null && block2 != null && block1.blockId == block2.blockId)
               {
                   let newList:Block [] = []
                   newList.push(block1,block2);
                   if(newList[0].data.eliminateType == 1){ //消除类型为1的情况才能被3消 4消  5消
                    allBlock.push(newList)
                }
               }
           }
       }
       return allBlock
   }

   //消除提示
   eliminateSuggest()
   {
        if(this.haveSuggest) 
        {
           return;
        }

       let arrRow:any = new Array();
       let arrCol:any = new Array();

       let arrRowInter:any = new Array();
       let arrColInter:any = new Array();

       for (let i = 0; i < Define.maxRow; i++) {
           let arr = this.findNearBlock(i,true,2)
           if(arr.length > 0){
               arrRow.push(arr)
           }          
           arr = this.findIntervalBlock(i,true)
           if(arr.length >0){
               arrRowInter.push(arr)
           } 
       }
       for (let i = 0; i < Define.maxCol; i++) {
            let  arr = this.findNearBlock(i,false,2)
            if(arr.length > 0){
                arrCol.push(arr)
            } 
            arr = this.findIntervalBlock(i,false)
            if(arr.length >0){
                arrColInter.push(arr)
            }
       }
       
        //****************以下提示优先可调****************
        //竖着间隔2个
        if(arrColInter.length > 0){
            for (let index = 0; index < arrColInter.length; index++) {
                let tempArr = arrColInter[index]
                for (let i = 0; i < tempArr.length; i++) {                   
                    if(this.checkBlockInter(tempArr[i],false))
                    {
                        this.haveSuggest=true;
                        return;
                    }                                                       
                }                
            }
        }
        //横着间隔2个
        if(arrRowInter.length > 0){
            for (let index = 0; index < arrRowInter.length; index++) {
                let tempArr = arrRowInter[index]
                for (let i = 0; i < tempArr.length; i++) {
                    if(this.checkBlockInter(tempArr[i],true)) 
                    {
                        this.haveSuggest=true;
                        return;
                    }                 
                }                
            }
        }     
        //横着相邻2个
        if(arrRow.length > 0){
            for (let index = 0; index < arrRow.length; index++) {
                let tempArr = arrRow[index]
                for (let i = 0; i < tempArr.length; i++) {
                    if(this.checkBlock(tempArr[i],true))  
                    {
                        this.haveSuggest=true;
                        return;
                    }                 
                }                
            }
        }
        //竖着相邻2个
        if(arrCol.length > 0){
            for (let index = 0; index < arrCol.length; index++) {
                let tempArr = arrCol[index]
                for (let i = 0; i < tempArr.length; i++) {                   
                    if(this.checkBlock(tempArr[i],false))  
                    {
                        this.haveSuggest=true;
                        return;
                    }                                                       
                }                
            }
        }
        this.haveSuggest=false;


        Common.promptTaskTime.resetTotalTime();
        //Common.showPrompt("没有可用提示!");
        //console.log("没有可以提示的");

   }

   checkBlockInter(checkArr,isRow:boolean)
   {        
       let row:number = (checkArr[0] as Block).row
       let col:number = (checkArr[0] as Block).col
       let id = (checkArr[0] as Block).blockId;
       if(isRow)
       {           
           let posRow:any = new Array();           
           let r1=cc.v2(row+1,col+1)
           let r2=cc.v2(row-1,col+1)      
           if(this.getBlockByRowCol(row+1,col) != null)
           {
               if(this.getBlockByRowCol(row+1,col).data.eliminateType==1)
               {
                  posRow.push(r1,r2);
               }
           }
                         
           for(let i = 0; i < posRow.length; i++)
           {
               let block = this.getBlockByRowCol(posRow[i].x,posRow[i].y);
               if(block == null)
               {
                continue;
               }else if(block.data.eliminateType!=1) 
                {
                    continue;
                }
               
               
               if(block.blockId == id)
               {
                   //console.log("检测到了："+posRow[i].x+"，"+posRow[i].y+"，"+id);
                   checkArr.push(block);

                   let SuggestList :Block[]=[];
                   SuggestList.push(block);

                   SuggestList.push(this.getBlockByRowCol(row,col+1))
                   //添加提示效果
                   for (let i = 0; i < SuggestList.length; i++)
                   {       
                       if((SuggestList[i] as Block).data.eliminateType!=1||(SuggestList[i] as Block).coverBlock!=null||(SuggestList[i] as Block).isConverBlock)
                       {
                        return false;
                       }                
                       
                       //console.log("提示效果!!!!"+SuggestList[i].row+','+SuggestList[i].col);
                   }

                   for (let i = 0; i < SuggestList.length; i++)
                   {       
                       if((SuggestList[i] as Block).data.eliminateType==1)
                       {
                        (SuggestList[i] as Block).guideEffect();
                       }                
                       
                       //console.log("提示效果!!!!"+SuggestList[i].row+','+SuggestList[i].col);
                   }
                   return true;
               }
           }
       }
       else
       {
           //console.log("竖着相隔：："+row+"，"+col+"，"+id);
           let posCol:any = new Array();
           let r1=cc.v2(row+1,col+1)
           let r2=cc.v2(row+1,col-1) 
           
           if(this.getBlockByRowCol(row,col+1) != null){
               if(this.getBlockByRowCol(row,col+1).data.eliminateType==1)
               {
                 posCol.push(r1,r2);
               }
               
           }
                        
           for(let i = 0; i < posCol.length; i++)
           { 
               let block = this.getBlockByRowCol(posCol[i].x,posCol[i].y)
               if(block == null)
               {
                continue;
               }else if(block.data.eliminateType!=1) 
                {
                    continue;
                }
               if(block.blockId == id)
               {
                   //console.log("检测到了："+posCol[i].x+"，"+posCol[i].y+"，"+id);
                   checkArr.push(block);


                   let SuggestList :Block[]=[];
                   SuggestList.push(block);

                   SuggestList.push(this.getBlockByRowCol(row+1,col))
                //    if(block.col<col)
                //    {
                //      SuggestList.push(this.getBlockByRowCol(row,col-1))
                //    }else{
                //      SuggestList.push(this.getBlockByRowCol(row,col+1))
                //    }
                   //添加提示效果
                   for (let i = 0; i < SuggestList.length; i++)
                   {       
                       if((SuggestList[i] as Block).data.eliminateType!=1||(SuggestList[i] as Block).coverBlock!=null||(SuggestList[i] as Block).isConverBlock)
                       {
                        return false;
                       }                
                       
                       //console.log("提示效果!!!!"+SuggestList[i].row+','+SuggestList[i].col);
                   }
                   for (let i = 0; i < SuggestList.length; i++)
                   {        
                    if((SuggestList[i] as Block).data.eliminateType==1)  
                    {
                        (SuggestList[i] as Block).guideEffect();
                    }                                    
                       //console.log("提示效果!!!!"+SuggestList[i].row+','+SuggestList[i].col);
                   }                   
                   return true;
               }
           }
       }
       return false;
   }

   checkBlock(checkArr,isRow:boolean)
   {           
       let row:number = (checkArr[0] as Block).row
       let col:number = (checkArr[0] as Block).col
       let id = (checkArr[0] as Block).blockId;       
       if(isRow)
       {
           //console.log("横着相邻："+row+"，"+col+"，"+id);
           let posRow:any = new Array();                   
           let r1=cc.v2(row,col+3)
           let r2=cc.v2(row,col-2)
           let r3=cc.v2(row+1,col-1)
           let r4=cc.v2(row-1,col-1)
           let r5=cc.v2(row+1,col+2)
           let r6=cc.v2(row-1,col+2)
           if(this.getBlockByRowCol(row,col-1) != null)
           {
               if(this.getBlockByRowCol(row,col-1).data.eliminateType==1)
               {
                posRow.push(r2,r3,r4)
               }
           }           
           if(this.getBlockByRowCol(row,col+2) != null){
               if(this.getBlockByRowCol(row,col+2).data.eliminateType==1)
               {
                posRow.push(r1,r5,r6) 
               }
           }

        //    if(this.getBlockByRowCol(row,col-1)!=null&& this.getBlockByRowCol(row,col-1).data.eliminateType!=1)
        //    {
        //        if(this.getBlockByRowCol(row,col+2)!=null&&this.getBlockByRowCol(row,col+2).data.eliminateType!=1)
        //        {
        //         return false;
        //        }
            
        //    }
                          
                     
           for(let i = 0; i < posRow.length; i++)
           {
               let block = this.getBlockByRowCol(posRow[i].x,posRow[i].y);
               if(block == null)
               {
                continue;
               }else if(block.data.eliminateType!=1) 
                {
                    continue;
                }
               if(block.blockId == id)
               {
                   //console.log("检测到了："+posRow[i].x+"，"+posRow[i].y+"，"+id);
                   checkArr.push(block);
                   //添加提示效果

                   let SuggestList :Block[]=[];
                   SuggestList.push(block);

                   if(block.col<col)
                   {
                     SuggestList.push(this.getBlockByRowCol(row,col-1))
                   }else{
                     SuggestList.push(this.getBlockByRowCol(row,col+2))
                   }

                   for (let i = 0; i < SuggestList.length; i++)
                   {       
                       if((SuggestList[i] as Block).data.eliminateType!=1||(SuggestList[i] as Block).coverBlock!=null||(SuggestList[i] as Block).isConverBlock)
                       {
                        return false;
                       }                
                       
                       //console.log("提示效果!!!!"+SuggestList[i].row+','+SuggestList[i].col);
                   }

                   for (let i = 0; i < SuggestList.length; i++)
                   {             
                    if((SuggestList[i] as Block).data.eliminateType==1)  
                    {
                        (SuggestList[i] as Block).guideEffect();
                    }                               
                       //console.log("提示效果!!!!"+SuggestList[i].row+','+SuggestList[i].col);
                   }
                   return true;
               }
           }
       }
       else
       {
           //console.log("竖着相邻："+row+"，"+col+"，"+id);
           let posCol:any = new Array();
           let r1=cc.v2(row+3,col)
           let r2=cc.v2(row-2,col)
           let r3=cc.v2(row-1,col-1)
           let r4=cc.v2(row-1,col+1)
           let r5=cc.v2(row+2,col-1)
           let r6=cc.v2(row+2,col+1)
        //    if(this.getBlockByRowCol(row-1,col) != null) posCol.push(r2,r3,r4)          
        //    if(this.getBlockByRowCol(row+2,col) != null) posCol.push(r1,r5,r6)               
                
           if(this.getBlockByRowCol(row-1,col) != null)
           {
               if(this.getBlockByRowCol(row-1,col).data.eliminateType==1)
               {
                posCol.push(r2,r3,r4)
               }
           }           
           if(this.getBlockByRowCol(row+2,col) != null){
               if(this.getBlockByRowCol(row+2,col).data.eliminateType==1)
               {
                posCol.push(r1,r5,r6) 
               }
           }

        //    if(this.getBlockByRowCol(row-1,col)!=null&& this.getBlockByRowCol(row-1,col).data.eliminateType!=1)
        //    {
        //        if(this.getBlockByRowCol(row+2,col)!=null&&this.getBlockByRowCol(row+2,col).data.eliminateType!=1)
        //        {
        //         return false;
        //        }
            
        //    }
           for(let i = 0; i < posCol.length; i++)
           { 
               let block = this.getBlockByRowCol(posCol[i].x,posCol[i].y)
               if(block == null)
               {
                continue;
               }else if(block.data.eliminateType!=1) 
                {
                    continue;
                }
               if(block.blockId == id)
               {
                   //console.log("检测到了："+posCol[i].x+"，"+posCol[i].y+"，"+id);
                   checkArr.push(block);


                   let SuggestList :Block[]=[];
                   SuggestList.push(block);

                   if(block.row<row)
                   {
                     SuggestList.push(this.getBlockByRowCol(row-1,col))
                   }else{
                     SuggestList.push(this.getBlockByRowCol(row+2,col))
                   }
                   //添加提示效果

                   for (let i = 0; i < SuggestList.length; i++)
                   {       
                       if((SuggestList[i] as Block).data.eliminateType!=1||(SuggestList[i] as Block).coverBlock!=null||(SuggestList[i] as Block).isConverBlock)
                       {
                        return false;
                       }                
                       
                       //console.log("提示效果!!!!"+SuggestList[i].row+','+SuggestList[i].col);
                   }
                   for (let i = 0; i < SuggestList.length; i++)
                   {      
                    if((SuggestList[i] as Block).data.eliminateType==1)  
                    {
                        (SuggestList[i] as Block).guideEffect();
                    }                                 
                       //console.log("提示效果!!!!"+SuggestList[i].row+','+SuggestList[i].col);
                   }                   
                   return true;
               }
           }
       }
       return false;
   }
   //取消提示
   cancleEliminateSuggest(){
        if(this.haveSuggest)
        {
            for (let index = 0; index < this.blockList.length; index++) {
                if((this.blockList[index] as Block).isPrompt == true )
                {
                    (this.blockList[index] as Block).cancleGuideEffect();
                }
            }
            this.haveSuggest=false;
        }      
   }
   //清除所有数据
    clearAll(){
        for (let index = 0; index < this.blockList.length; index++) {
            this.blockList[index].node.destroy();
        }
        for (let index = 0; index < this.blockCacheList.length; index++) {
            this.blockCacheList[index].node.destroy();
        }
        for (let i = 0; i < Define.maxRow; i++) {
            for (let j = 0; j < Define.maxCol ; j++) {
                this.levelInfo[i][j] = 0
            }
        }

        this.curMoveBlock = null
        this.curMoveBlock2 = null
        this.blockList = []
        this.blockCacheList = []
        this.delayTimeTask = null
        this.haveSuggest = false
        TimeTaskManager.removeTimeTask("blockManagerDelay")
    }
    //检测消除旁边类型的道具
    checkRemoveNearBlock(block:Block){
        let upBlock:Block = this.getBlockByRowCol(block.row + 1,block.col)
        let downBlock:Block = this.getBlockByRowCol(block.row - 1,block.col)
        let leftBlock:Block = this.getBlockByRowCol(block.row,block.col - 1)
        let rightBlock:Block = this.getBlockByRowCol(block.row,block.col + 1)
        if(upBlock != null && (upBlock.data.eliminateType == 2 || upBlock.data.eliminateType == 4)){
            //this.removeBlockByRowCol(upBlock.row,upBlock.col)
            this.invalidBlock.push(upBlock)
        }

        if(downBlock != null && (downBlock.data.eliminateType == 2 || downBlock.data.eliminateType == 4)){
            //this.removeBlockByRowCol(downBlock.row,downBlock.col)
            this.invalidBlock.push(downBlock)
        }

        if(leftBlock != null && (leftBlock.data.eliminateType == 2 || leftBlock.data.eliminateType == 4)){
            //this.removeBlockByRowCol(leftBlock.row,leftBlock.col)
            this.invalidBlock.push(leftBlock)
        }

        if(rightBlock != null && (rightBlock.data.eliminateType == 2 || rightBlock.data.eliminateType == 4)){
            //this.removeBlockByRowCol(rightBlock.row,rightBlock.col)
            this.invalidBlock.push(rightBlock)
        }
        return false
    }
    //移除阻止掉落
    removeNoneBlock(block:Block){
        let nextRow:number = block.row - 1
        while(nextRow >= 0){
            let tempBlock:Block = this.getBlockByRowCol(nextRow,block.col)
            if(tempBlock != null && tempBlock.data.ID == 0){
                this.invalidBlock.push(tempBlock)
                //this.removeBlockByRowCol(nextRow,block.col)
                nextRow = nextRow - 1
            }else{

                if(this.levelInfo[nextRow][block.col] == 0){
                    nextRow = nextRow - 1
                    continue
                }
                break
            }
        }
    }
    //方块移动到其它的位置
    handlerBlockMoveToTarget(){
        let targetBlocks:Block [] = []
        let moveBlocks:Block [] = []
        for (let index = 0; index < this.blockList.length; index++) {
            if(this.blockList[index].data.whetheExchange){
                //说明是普通的道具
                targetBlocks.push(this.blockList[index])
            }else if(this.blockList[index].data.invitationAward == 4 && this.blockList[index].isCanMoveTo){
                //说明方块下落完成之后需要移动的方块
                moveBlocks.push(this.blockList[index])
            }
        }

        // for (let index = 0; index < 8; index++) {
        //     targetBlocks.push(this.getBlockByRowCol(7,index))
        // }

        // targetBlocks.splice(0,1)
        // targetBlocks.splice(0,1)
        // targetBlocks.push(this.getBlockByRowCol(7,3))
        // targetBlocks.push(this.getBlockByRowCol(6,3))

        if(moveBlocks.length > 0){
            Common.isBlockFly = true
            Common.isGestureMove = false
        }
        //设置移动方块的位置信息
        let totalCount:number = 0;
        for (let index = 0; index < moveBlocks.length; index++) {
            let i:number = Common.getRandom(0,targetBlocks.length-1)
            let targetBock:Block = targetBlocks[i]
            targetBlocks.splice(i,1)
            moveBlocks[index].moveToRowCol(targetBock,function(){
                totalCount = totalCount + 1
                if(totalCount ==  moveBlocks.length){
                    //说明移动完成
                    for (let i = 0; i < moveBlocks.length; i++) {
                        moveBlocks[i].moveToFinished();
                    }
                    console.log("移动完成")

                    TimeTaskManager.addTimeTask(0.05,function(){
                        Common.isBlockFly = false
                        BlockManager.getInstance().handlerBlocks();
                    }.bind(this),"temp000",1)
                 
                }

            }.bind(this))
        }
    }
    //收集指定图形回调
    collectShape(blocks:Block[]){
        for(let i=0;i<blocks.length;i++)
        {
            Common.playSkeletonById(Define.skeleton_xingzhuang,Common.nodeSpineRoot,blocks[i].getScenePos().x,blocks[i].getScenePos().y,null,false,true)


        }
        //Todo:收集指定图形完成.............
        UIManager.getInstance().sendMessage(Define.viewMain,'collectForm',Common.collectFormID)
    }
    
}