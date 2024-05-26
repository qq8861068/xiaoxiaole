import Define from "./common/Define";
import TimeTask from "./common/TimeTask";
import Common from "./common/Common";
import WXHelper from "./common/WXHelper";
import UIManager from "./manager/UIManager";
import GameManager from "./manager/GameManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UserInfo  {

    //玩家头像
    public static avatarUrl:string = "";
    //玩家的名字
    public static nickName:string = "";
    //玩家的openId
    public static openid:string = "";
    //开启震动
    public static openBrateTag = 0;
    //开启音效
    public static openSoundTag = 0;
    //开启背景音乐
    public static openMusicTag = 0;
    
    public static userLevel:number = 1;

    public static userGold:number = 0;
    //体力是外层设置传入的
    public static userXin: number = 0;

    public static userStarArr: number[] = [0, 0];

    public static gameTools: number[] = [0, 0, 0];

    public static getItem1:number = 0;
    public static getItem2:number = 0;
    public static getItem3:number = 0;
    public static getItem4:number = 0;


    public static musicID:number=0; //音乐播放器状态0：关闭;5循环播放；1-4对应音乐名

    public static isLoop:number=0;



    public static getUserInfo(){
        var obj = {nickName:UserInfo.nickName,avator:UserInfo.avatarUrl,realy:0};
        return JSON.stringify(obj);
    }

    //获得请求信息
    public static getRequestInfo(){
        return "gameId="+Define.gameId+"&open_id="+UserInfo.openid
    }

    //读取一个数据
    public static getItem(key:string,isNumber:boolean){
        let value = cc.sys.localStorage.getItem(key);
        if(value != null && value != ""){
            if(isNumber){
                return Number(value);
            }else{
                return value
            }
        }else{
            if(isNumber){
                return 0;
            }else{
                return "";
            }
        }
    }
    //保存数据
    public static setItem(key:string,value:any){
        cc.sys.localStorage.setItem(key,value);
    }

    public static loadAllData(){
        //用户的钱
        this.userGold = this.getItem(Define.dataKeyGold,true) as number
        //用户的体力 先默认给 3
        this.userXin = 3;
        const starArrStr = this.getItem(Define.dataKeyStarArr,false) as string
        if (starArrStr) {
            this.userStarArr = JSON.parse(starArrStr)
        } else {
            this.saveStar(1, 0);
        }
        //每个关卡获取星星总数
        // this.userStarArr.reduce((p, c) => p + c, 0)

        this.userLevel = this.getItem(Define.datakeyLevel,true) as number

        const gameToolsStr = this.getItem(Define.dataKeyGameTools,false) as string
        if (gameToolsStr) {
            this.gameTools = JSON.parse(gameToolsStr)
            //防止缓存错误数据
            if (this.gameTools.length !== 3) {
                this.saveGameTools(0, 5);
                this.saveGameTools(1, 3);
                this.saveGameTools(2, 3);
            }
        } else {
            //0锤子，1横，2竖 默认先给几个
            this.saveGameTools(0, 5);
            this.saveGameTools(1, 3);
            this.saveGameTools(2, 3);
        }

        this.openMusicTag = this.getItem(Define.datakeyMusic,true) as number
        this.openSoundTag = this.getItem(Define.datakeySound,true) as number
        this.openBrateTag = this.getItem(Define.datakeyBrate,true) as number


        // this.getItem1 = this.getItem(Define.dataKeyGetItem1,true) as number
        // this.getItem2 = this.getItem(Define.dataKeyGetItem2,true) as number
        // this.getItem3 = this.getItem(Define.dataKeyGetItem3,true) as number
        // this.getItem4 = this.getItem(Define.dataKeyGetItem4,true) as number

        this.musicID = this.getItem(Define.dataKeyMusicID,true) as number

        this.isLoop=this.getItem(Define.dataKeyIsLoop,true) as number

        if(this.userLevel <= 0){
            this.userLevel = 1;
            this.setItem(Define.datakeyLevel,this.userLevel);
        }
    }
    //改变登录状态
    public static changeLoginState(){
        this.setItem(Define.datakeyFirstLogin,1)
    }
    //是否是第一次登录
    public static isFirstLogin(){
       return this.getItem(Define.datakeyFirstLogin,true) as number == 0
    }

    // public static isCanGet()
    // {
    //     return this.getItem(Define.datakeyGetNum,true) as number < 3
    // }

    // public static addGetNum(){
    //     this.setItem(Define.datakeyGetNum,Common.getDailyRewardNum)
    // }
    // //每日清空
    // public static clearGetNum(){
    //     Common.getDailyRewardNum = 0;
    //     this.setItem(Define.datakeyGetNum,0);
    // }

    //获得每日领奖次数
    public static getDayRewardCount():number{
        let testDate = new Date()
        let key = testDate.getFullYear() + "_" + testDate.getMonth() + "_" + + testDate.getDate()
        return this.getItem(key,true)
    }
    //添加每日领取奖励的次数
    public static addDayRewardCount(){
        let testDate = new Date()
        let key = testDate.getFullYear() + "_" + testDate.getMonth() + "_" + + testDate.getDate()
        let count:number = this.getItem(key,true)
        count = count + 1
        this.setItem(key,count)
    }

    
    //保存游戏的设置状态
    public static saveSetUpState(){
        this.setItem(Define.datakeyMusic,this.openMusicTag)
        this.setItem(Define.datakeySound,this.openSoundTag)
        this.setItem(Define.datakeyBrate,this.openBrateTag)
    }

    //保存好友助力奖励领取状态
    public static saveGetItemState(){
        //0说明不能领取  1未领取可以领取  2已经领取
        // this.setItem(Define.dataKeyGetItem1,this.getItem1)
        // this.setItem(Define.dataKeyGetItem2,this.getItem2)
        // this.setItem(Define.dataKeyGetItem3,this.getItem3)
        // this.setItem(Define.dataKeyGetItem4,this.getItem4)
    }


    
    //添加 减少金币
    public static setMusicID(id:number,iswrite:boolean = true){
        this.musicID = id;
        if(iswrite){
            this.setItem(Define.dataKeyMusicID,this.musicID)
        }
    }

    //添加 减少金币
    public static setisLoop(id:number,iswrite:boolean = true){
        this.isLoop = id;
        if(iswrite){
            this.setItem(Define.dataKeyIsLoop,this.isLoop)
        }
    }
    

    //添加 减少金币
    public static addGold(gold:number,iswrite:boolean = true){
        this.userGold = this.userGold + gold
        if(iswrite){
            this.setItem(Define.dataKeyGold,this.userGold)
        }
    }
    //添加 减少星星
    // public static addStar(star:number,iswrite:boolean = true){
    //     this.userStar = this.userStar + star
    //     if(iswrite){
    //         this.setItem(Define.dataKeyStar,this.userStar)
    //     }
    // }
    //根据数据保存星星, 第几关，获得了多少星星
    public static saveStar(level: number, count: number) {
        //如果已经是有星星了，还没超过，不保存
        if (this.userStarArr[level] && this.userStarArr[level] > count) {
            return;
        }
        this.userStarArr[level] = count;
        this.setItem(Define.dataKeyStarArr, JSON.stringify(this.userStarArr))
    }
    public static saveGameTools(toolIndex: number, count: number) {
        this.gameTools[toolIndex] = count;
        this.setItem(Define.dataKeyGameTools, JSON.stringify(this.gameTools))
    }
    //金币是否足够
    public static isGoldEnoght(gold:number){
        return this.userGold >= gold;
    }
    //清空所有数据
    public static clearAllDatas(){
        cc.sys.localStorage.clear();
    }
    //进入关卡
    public static nextLevel(){
        this.userLevel =  this.userLevel + 1
        this.setItem(Define.datakeyLevel,this.userLevel)
    }
    //添加道具
    public static addPropByIdAndCount(propId:number,addCount:number){
        // let curCount:number = UserInfo.getPropCountById(propId)
        // let count:number = curCount + addCount
        // this.setItem(Define.datakeyProp+propId.toString(),count)
        // //将口红的数量上传到微信服务器
        // if(propId == Define.prop_kouhong){
        //     //GameManager.getInstance().wxHelper.submitScore(UserInfo.getPropCountById(Define.prop_kouhong))
        // } 
        // return count
    }
    //添加道具通过信息 issub 是否是减少道具 1,2;3,3
    public static addPropInfoByInfo(propInfo:string,isSub:boolean)
    {
        let arrInfo:string [] = propInfo.split(";")
        let subTag:number = 1
        if(isSub){
            subTag = -1
        }
        for (let index = 0; index < arrInfo.length; index++) {
            let info:string [] = arrInfo[index].split(",")
            let id:number = Number(info[0])
            let count:number = Number(info[1])
            if(id > 0 && id < 100){
                UserInfo.addPropByIdAndCount(id,count*subTag)
            }else if(id==Define.prop_gold){
                UserInfo.addGold(count*subTag)
            }else if(id==Define.prop_star){
                //星星机制改变，以下代码作废
                // UserInfo.addStar(count*subTag)
            }
        }
    }



    //获得道具
    public static getPropCountById(propId:number){
        return this.getItem(Define.datakeyProp+propId.toString(),true) as number
    }
    //检测版本信息
    public static checkVersion(callBack:Function){
        let version:string = this.getItem(Define.datakeyVersion,false) as string
        console.log("version = " + version)
        console.log("Define.version = " + Define.version)
        if(Define.version != version){
      
            this.setItem(Define.datakeyVersion,Define.version)
            if(cc.sys.platform == cc.sys.WECHAT_GAME){
                WXHelper.cleanOldAssets()
            } 
        }else{
            console.log("没有版本需要更新......")
        }
        UIManager.getInstance().showView(Define.viewLoading);
    }
    //添加奖励信息 1,10;2,30;4,50
    public static addRewardInfo(rewardInfo:string){
        if(rewardInfo.length == 0){
            return
        }
        let arrInfo:string [] = rewardInfo.split(";")

        for (let index = 0; index < arrInfo.length; index++) {
            let info:string [] = arrInfo[index].split(",")
            let id:number = Number(info[0])
            let count:number = Number(info[1])
            if(id > 0 && id < 100){
                UserInfo.addPropByIdAndCount(id,count)                               
            }else if(id == Define.prop_gold){
                UserInfo.addGold(count)
            }else if(id==Define.prop_star){
                //星星机制改变，以下代码作废
                // UserInfo.addStar(count)
            }
        }
    }
}
