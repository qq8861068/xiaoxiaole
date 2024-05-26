
import ButtonEffect from "./ButtonEffect";
import Define from "./Define";
import Block from "../Block";
import LDataLevels from "../datas/LDataLevels";
import ResManager from "../manager/ResManager";
import TimeTask from "./TimeTask";
import PromptView from "../ui/PromptView";
import UIManager from "../manager/UIManager";
import LChallengeLevels from "../datas/LDataChallengelevels";
import LDataChallengelevels from "../datas/LDataChallengelevels";
import LDataBannerManager from "../datas/LDataBannerManager";
import LDataBanner from "../datas/LDataBanner";
import WXHelper from "./WXHelper";
import PastureView from "../ui2/PastureView";
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default  class  Common {
 
    public static gameId = "215328";
    public static nodeMap:cc.Node;
    public static nodeSoundRoot:cc.Node;
    public static nodeSpineRoot:cc.Node;
    public static nodePromptRoot:cc.Node;
    public static nodeSelectedRoot:cc.Node;

    public static nodeMask:cc.Node;


    public static nodeUiRoot:cc.Node;
    public static nodeGameRoot:cc.Node;
  
    public static isGamePause:boolean = false;
    public static isGameOver:boolean = false;
    public static isCanRelive:boolean = true;
    
    public static blockNodeRoot:cc.Node = null

    public static atlasBlock:cc.SpriteAtlas = null;
    public static atlasBlock1:cc.SpriteAtlas = null;

    public static isCanMoveBlockTag:boolean = true; //是否可以移动方块的标识
    public static isBlockMoving:boolean = false;//道具在移动
    public static isHaveBlockDroping:boolean = false; //是否有方块掉落
    public static isPlayAni:boolean = false;//是否播放消除动画

    public static curSelectBlock:Block = null; //当前点击的block
    public static oldSelectBlock:Block = null; //上一个点击提示效果的block


    public static collectFormID:number = 0;//收集形状id;

    //按下的状态
    public static pressState:number = 0; //没有按压 1 left 2 right
    //是否是编辑模式
    public static isEditor:boolean = false;
    
    public static mapInfo:string = ""

    //道具统计(废弃)
    public static DaoJuSum:number[]=[];
    

    public static curLevelData:LDataLevels|LDataChallengelevels = null;
    public static curTotalStep:number = 0;//关卡当前步数
    public static useTempTotalStep:number = 0;//关卡胜利后结算临时保存变量
    public static isChallenge:boolean = false;

    public static maxLevel:number = 0; //最大关卡

    public static mapLevel:number = 0;//

    public static isPromptTag:boolean = false //是否在提示中
    public static promptTaskTime:TimeTask = null;

    public static isMaskTag:boolean = false //是否在变暗中
    public static maskTaskTime:TimeTask = null;

    public static isJueseTag:boolean = false //是否在动画中

    public static gameModel:number = 0;//游戏模式


    public static musicid:number = 1;//xunhuun




    public static isFlyEnd:boolean = false;//是否是结算后掉落（不消除）

    public static isAdd5ed:boolean = false;//当前关卡是否领取过加5步奖励

    public static curMusicRes:string = "";

    public static userIsLoginTag:boolean = false


    public static isItemShow:boolean = false

    //用户今日已经抽奖的次数
    public static userLotteryCount:number = 0;
    //用户抽奖剩余次数
    public static userLotteryResidueCount:number = 0;
    //用户通关奖励关卡次数
    public static userPassChallengeCount:number = 0
    //用户最多通关奖励关卡次数
    public static userMaxChallengeCount:number = 0
    //挑战关卡的关数
    public static challengeLevel:number = 1

    public static userGetgold:number = 0;

    //是否通过手势移动
    public static isGestureMove:boolean = false
    //怪物方块是否在飞行
    public static isBlockFly:boolean = false
    
    public static changeBannerTaskTime:TimeTask = null;

    public static changeMusicTaskTime:TimeTask = null;

    //游戏进展
    public static gameProgress:number = 0; 
    //邀请你的玩家游戏id
    public static friendOpenId:string = ""

    public static isCheckGameOver:boolean = false

    public static curPastureBuildingId:number=0;
    public static curPastureBuildgrade:number=0;
    public static curBuyId=0;
    public static pastureFeedFactor=1;
    public static pastureView:PastureView=null;

    public static resetDatas(){
        this.isGamePause = false;
        this.isGameOver = false;
        this.isCanMoveBlockTag = true;
        this.isHaveBlockDroping = false;
        this.isPlayAni = false;
        this.isCanRelive = false;
        this.curTotalStep = 0;
        this.curLevelData = null;
        this.gameProgress = Define.gameing;
        this.isPromptTag = false
        this.isMaskTag = false
        this.isFlyEnd = false
        this.isAdd5ed = false;
        this.isJueseTag = false;
        this.isCheckGameOver = true
        this.isItemShow = false;
        this.isGestureMove = false
        this.isBlockFly = false

        this.musicid=1;
        //当前关卡获得金币
        //this.userGetgold =0;
     }

    //添加点击事件
    public static addClickEvent(node:cc.Node,call:Function,isClickEffect:boolean = true,longCall:Function = null,isPlaySound:boolean = true,pressCallBack:Function = null,clickDoublebCallBack:Function = null){
        let effect:ButtonEffect = node.getComponent<ButtonEffect>(ButtonEffect)
        if(effect != null){
            return
        }
        effect = node.addComponent(ButtonEffect);
        effect.setClickCallBack(call,isClickEffect,isPlaySound,longCall,pressCallBack,clickDoublebCallBack);
        return effect
    }
    //移除点击按键
    public static removeClickEvent(node:cc.Node){
        let effect:ButtonEffect = node.getComponent<ButtonEffect>(ButtonEffect)
        if(effect != null){
            effect.destroy();
            effect = null;
        }
    }

    public static getRandom(min:number,maxr:number):number{ // 0 2  返回 0 1

        return Math.floor(Math.random() *(maxr - min)  + min);
    }
    //检测一个值是不是已经存在
    public static isExistValue(arr:number[],value:number){
        for (let index = 0; index < arr.length; index++) {
           if(arr[index] == value){
               return true
           }
        }
        return false
    }

    //快速排序
    public static quickSort(arr:number[]):number[]{
        if(arr.length <= 1){
            return arr;
        }
        var pivotIndex = Math.floor(arr.length/2);
        var pivot = arr.splice(pivotIndex,1)[0];
        var left = [] as number[];
        var right = [] as number[];
    
        for(var i =0;i<arr.length;i++){
            if (arr[i] < pivot) {
                left.push(arr[i]);
            } else {
                right.push(arr[i]);
            }
        }
        return this.quickSort(left).concat([pivot], this.quickSort(right));
    }
    //左右移动的动作
    public static actionLeftRightRotate(node:cc.Node,time:number = 0.2,range:number = 5,delayTime:number = 2){
        let actionLeftRotate = cc.rotateTo(time,range)
        let actionRightRotate = cc.rotateTo(time,range*-1)
        let actionCenterRotate = cc.rotateTo(time,0)
        
        node.runAction( cc.repeatForever(
            cc.sequence(
                actionLeftRotate,
                actionRightRotate,
                actionLeftRotate,
                actionRightRotate,
                actionCenterRotate,
                cc.delayTime(delayTime),
            ))
        );
    }
    //动作闪烁红色 白色 用于游戏结束
    public static actionTinkColor(node:cc.Node,callBack:Function = null,count:number = 5,tinkSpeed:number = 0.1){
        let action = cc.sequence(cc.tintTo(tinkSpeed,255,0,0),cc.tintTo(tinkSpeed,255,255,255))
        node.runAction(cc.sequence(cc.repeat(action,count),cc.callFunc(function(){
            if(callBack != null){
                callBack();
            }
        }.bind(this))));
    }
    //大小缩放
    public static actionBigSmall(node:cc.Node,scale1:number,scale2:number,time1:number = 1.2,time2:number = 1){
        node.stopAllActions();
        let  action = cc.sequence(cc.scaleTo(time1,scale1),cc.scaleTo(time2,scale2))
        node.runAction(cc.repeatForever(action));
    }

    //判断当前日期为当月第几周
    public static getMonthWeek(a, b, c):number{
        //a = d = 当前日期
        //b = 6 - w = 当前周的还有几天过完(不算今天)
        //a + b 的和在除以7 就是当天是当前月份的第几周
        var date = new Date(a, parseInt(b) - 1, c), w = date.getDay(), d = date.getDate();
        return Math.ceil((d + 6 - w) / 7);
    }
    //判断当前日期为当年第几周
    public static getYearWeek(a, b, c):number{
        //date1是当前日期
        //date2是当年第一天
        //d是当前日期是今年第多少天
        //用d + 当前年的第一天的周差距的和在除以7就是本年第几周
        var date1 = new Date(a, parseInt(b) - 1, c), date2 = new Date(a, 0, 1),
            d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
        return Math.ceil((d + ((date2.getDay() + 1) - 1)) / 7);
    }
    //得到当前时间（毫秒）
    public static getCurTime():number{
        let dt=new Date();
        return dt.getTime();
    }

    public static addZero(num){
        if(parseInt(num) < 10){
            num = '0'+num;
        }
        return num;
    }
    public static getDateTime(str) {
        let oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth()+1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        //oTime = this.addZero(oHour) +':'+this.addZero(oMin)
        //oSen = oDate.getSeconds(),
        oTime = oYear +'年'+ this.addZero(oMonth) +'月'+ this.addZero(oDay) +'日 '+ this.addZero(oHour) +':'+
        this.addZero(oMin);
        return oTime;
    }

        

    //消除统计功能
    public static ShowDaoJuSum(){
        console.log("***************************以下为本关道具消除统计结果*************************************")
        console.log("步数："+Common.DaoJuSum[0]);
        let sum:number=0;
        for(let i=1;i<Common.DaoJuSum.length;i++){
            console.log("道具"+i+":"+Common.DaoJuSum[i])
            sum+=Common.DaoJuSum[i];
        }
        console.log("消除道具总数："+sum);
        console.log("****************************************************************************************")
    }

    static compile(code):string{    
        var str =String.fromCharCode(code.charCodeAt(0)+code.length);  
        for(var i=1;i<code.length;i++){  
            str+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));  
        }  
        return str;
    }  

    static uncompile(code):string{  
        var c=String.fromCharCode(code.charCodeAt(0)-code.length);  
        for(var i=1;i<code.length;i++){  
            c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));  
        }  
        return c;  
    }  

    static getVectorRadians( x1,  y1,  x2,  y2)
    {
        let len_y = y2 - y1;
        let len_x = x2 - x1;
        let tan_yx = Math.abs(len_y)/Math.abs(len_x);
        let angle = 0;
        if(len_y > 0 && len_x < 0) {
            angle = Math.atan(tan_yx)*180/Math.PI - 90;
        } else if (len_y > 0 && len_x > 0) {
            angle = 90 - Math.atan(tan_yx)*180/Math.PI;
        } else if(len_y < 0 && len_x < 0) {
            angle = -Math.atan(tan_yx)*180/Math.PI - 90;
        } else if(len_y < 0 && len_x > 0) {
            angle = Math.atan(tan_yx)*180/Math.PI + 90;
        }
        return angle;
    }
    //获得显示的数字
    static getShowNumber(num:number):string{
        if(num > 1000){
            let index:number = -1
            let tempNum = num*0.001
            let count:number = 0
            while(tempNum > 1){
                index++
                tempNum = tempNum*0.001
                count++
            }
            let value:number = 0 
            let integer = num/Math.pow(1000,count)
            if(integer >= 100){
                value = Math.floor(integer)
            }else if(integer >= 10){
                value = Number(integer.toFixed(1));  //Math.floor(integer*10)*0.1 
            }else{
                value = Number(integer.toFixed(2));  //Math.floor(integer*100)*0.01
            }
            if(index > 25){
                index = 25
            }
            return value.toString() 
        }
        return num.toString();
    }
    //获得时间显示
    static getShowTime(num:number):string{

        let m = Math.floor(num/60)
        let s = num%60
        let strS:string = ""
        if(s < 10){
            strS = "0" + s.toString();
        }else{
            strS = s.toString();
        }
        return m.toString()+":"+strS
    }

    public static setShowGold(goldInfoNode:cc.Node,gold:number){
        goldInfoNode.children[0].children[0].getComponent<cc.Label>(cc.Label).string = gold.toString();
        let size = gold.toString().length
        goldInfoNode.width = 110 + (size - 1) * 18
    }
    //检测矩形碰撞
    public static isCollisionWithRect( x1:number,  y1:number,  w1:number,  h1:number,  x2:number, y2:number,  w2:number,  h2:number) {  
        if (x1 >= x2 && x1 >= x2 + w2) {  
            return false;  
        } else if (x1 <= x2 && x1 + w1 <= x2) {  
            return false;  
        } else if (y1 >= y2 && y1 >= y2 + h2) {  
            return false;  
        } else if (y1 <= y2 && y1 + h1 <= y2) {  
            return false;  
        }  
        return true;  
    } 
    //检测点的碰撞
    public static isCollisionWithPoint( x1:number,  y1:number,  x2:number,  y2:number,  w:number,  h:number) {  
        if (x1 >= x2 && x1 <= x2 + w && y1 >= y2 && y1 <= y2 + h) {  
            return true;  
        }   
        return false;  
    }  

    // 40 -- 760
    public static getBlockPosByRowCol(row:number,col:number){
        return new cc.Vec2(col*Define.blockWidth + 48,row*Define.blockHeight - 788)
    }

    public static getRowColByBlockPos(x:number,y:number){
        const col = Math.floor((x - 48 + Define.blockWidth / 2) / Define.blockWidth);
        const row = Math.floor((y + 788 + Define.blockHeight / 2) / Define.blockHeight);
        return [row, col];
    }

    //检测两个格子是否相邻
    public static checkIsNearByRowCol(row:number,col:number,row1:number,col1:number){
        
        let r = Math.abs(row - row1)
        let c = Math.abs(col - col1)

        if(r + c == 1){
            console.log("相邻")
        }else{
            console.log('不相邻')
        }

        return r + c == 1
    }
    //刷新关卡信息
    public static updateLevelInfo(blockId:number){

    }
    //获得系统毫秒数
    public static getSystemTime(){
        return new Date().getTime()
    }

    //随机打乱数组
    public static RandomSort(list:any):void {
        list.sort(function () {
            return Math.random() - 0.5;
        });
    }


    /**
     * 播放动画
     *
     * @param	id	动画id
     * @param	rootNode	根节点
     * @param	x	坐标
     * @param	y	坐标
     * @param   callBack 回调
     * @param   isCol 是否竖着
     * @param   isAutoRemove 是否自动删除
     */
    public static playSkeletonById(id:number,rootNode,x,y,callBack,isCol,isAutoRemove){
        let path = Define.skeletonInfo[id]
        let tempNode:cc.Node = null;
        ResManager.loadSpine(path,function(prefab){
            tempNode = cc.instantiate(prefab)
            tempNode.active = true
            rootNode.addChild(tempNode)
            tempNode.position = cc.v2(x,y);
            
            if(callBack){
                callBack(tempNode)
            }
            if(isCol) 
            {
                tempNode.rotation = -90;
                tempNode.scaleY = 1;
            }            
            if(isAutoRemove)
            {
                // tempNode.getComponent(sp.Skeleton).setEndListener(trackEntry => {
                //     var animationName = trackEntry.animation ? trackEntry.animation.name : "";
                //     cc.log("[track %s][animation %s] end.", trackEntry.trackIndex, animationName);
                //     tempNode.destroy();
                // });
                tempNode.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(function(){
                    tempNode.destroy();
                }.bind(this))))
            }
        }.bind(this))
        return tempNode;
    }
    //获得一个id
    public static getRandomBlockId(){
        //Common.curLevelData
        if(Common.curLevelData == null){
            return
        }
        let strArr:string [] = Common.curLevelData.propInfo.split(';');
        let weightArr:string[]=Common.curLevelData.weight.split(";");
        if(strArr.length!==weightArr.length){
            console.log("挑战level表配置错误！strArr.length!==weightArr.length");
        }
        let weightNums=weightArr.map(Number);
        let totalR=weightNums.reduce((a,b)=>{return a+b;});
        let rnum=Math.random()*totalR;
        let curNum=0;
        let k=0;
        for(;k<weightNums.length;++k){
            curNum+=weightNums[k];
            if(curNum>rnum){break;}
        }
        if(k>=weightNums.length){
            console.log("权重随机错误k>=weightNums.length");
        }
        let index:number = k;
        //console.log("random:k="+k+"id="+strArr[index]);
        return Number(strArr[index])
    }
    //显示提示
    public static showPrompt(desc:string){
        ResManager.loadPrefab("prefabs/ui/PromptView",function(prefab){
            let viewNode:cc.Node = cc.instantiate(prefab);
            viewNode.getComponent<PromptView>(PromptView).showPrompt(desc)
        }.bind(this));
    }
    //显示奖励界面 rewardInfo = "1,2;3,100;101,1000;4,1;4,1;4,1;4,1;4,1;4,1;4,1;4,1;4,1;4,1;4,1"
    public static showRewardView(rewardInfo:string){
        if(rewardInfo.length == 0){
            console.log("showRewardView 奖励信息错误")
            return
        }
        UIManager.getInstance().showView(Define.viewShowReward,function(){
            UIManager.getInstance().sendMessage(Define.viewShowReward,"showReward",rewardInfo)
        }.bind(this))
    }

    //获得道具,金币，星星的spriteFrame
    public static getPropSpriteFrame(id:number):cc.SpriteFrame{
        if(id > 0 && id < 100){
            return Common.atlasBlock.getSpriteFrame(Define.blockIconArr[id])
        }else if(id == Define.prop_gold){
            return Common.atlasBlock.getSpriteFrame("zhuanpan_xiaoduijinbi")
        }else if(id == Define.prop_star){
            return Common.atlasBlock.getSpriteFrame("daoju_xingxing")
        }
    }

    public static getMoneyName(id:number):string{
        if(id == Define.prop_gold)
        {
            return "金币";
        }else if(id == Define.prop_star){
            return "星星";
        }       
    }

    //获得特殊形状的spriteFrame
    public static getFormSpriteFrame(id:number):cc.SpriteFrame{
        if(id > 17 && id < 24){
            return Common.atlasBlock1.getSpriteFrame(Define.formIconArr[id-17]);
        }
    }

    //获得道具的spriteFrame
    public static getPropSpriteFrameByRes(res:string):cc.SpriteFrame{
        return Common.atlasBlock.getSpriteFrame(res)
    }

    //获得奖励信息 通过奖励ids nums
    public static getRewardInfoByIdsAndNums(ids:string[],nums:string[]):string{
        if(ids.length != nums.length){
            console.log("装盘奖励的数据是错误的........")
            return ""
        }else{
            let rewardInfo:string = ""
            for (let index = 0; index < ids.length; index++) {
                let id = ids[index]
                let num = nums[index]
                rewardInfo = rewardInfo + id+","+num+";"
            }
            rewardInfo=rewardInfo.substring(0,rewardInfo.length-1)
            return rewardInfo
        }
    }

    //其它游戏的icon 的动作效果
    public static actionOtherGameIconEffect(node:cc.Node,delayTime:number){
        node.runAction(cc.sequence(cc.delayTime(delayTime),cc.callFunc(function(){

            let actionLeftRotate = cc.rotateTo(0.15,10)
            let actionRightRotate = cc.rotateTo(0.15,10*-1)
            let actionCenterRotate = cc.rotateTo(0.15,0)

            node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(5),
                actionLeftRotate,
                actionRightRotate,
                actionCenterRotate,
                actionLeftRotate,
                actionRightRotate,
                actionCenterRotate,
            )))

        }.bind(this))))
    }
    //wx显示banner 广告
    public static showBanner(isShow:boolean,viewId:number){
        let data:LDataBanner = LDataBannerManager.GetDataById(viewId)
        if(data != null){
            if(!data.isShowBanner){
                return
            }
            WXHelper.showBannder(isShow)
        }
    }
}