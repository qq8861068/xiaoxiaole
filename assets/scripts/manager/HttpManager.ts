import UserInfo from "../UserInfo";
import Define from "../common/Define";
import UIManager from "./UIManager";
import Common from "../common/Common";
import WXHelper from "../common/WXHelper";
import TimeTaskManager from "./TimeTaskManager";
import PastureDataMgr from "./PastureDataMgr";
import PastureConfigMgr from "./PastureConfigMgr";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
const {ccclass, property} = cc._decorator;

@ccclass
export default class HttpManager {

    //返回一个静态的函数
    static instance:HttpManager;
    static getInstance():HttpManager{
        if(HttpManager.instance == null){
            HttpManager.instance = new HttpManager();
        }
        return HttpManager.instance;
    }

    httpGets(url,params,callBack){

        console.log("sendXHR")
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            // readyState值说明  
            // 0：请求未初始化，还没有调用 open()
            // 1：请求已经建立，但是还没有发送，还没有调用 send()
            // 2：请求已发送，正在处理中（通常现在可以从响应中获取内容头）
            // 3：请求在处理中；通常响应中已有部分数据可用了，没有全部完成
            // 4：响应已完成；您可以获取并使用服务器的响应
            if(xhr.readyState == 4){
                console.log('xhr.readyState='+xhr.readyState+'  xhr.status='+xhr.status);
                if(xhr.status >= 200 && xhr.status < 300){
                    var respone = xhr.responseText;
                    console.log(respone)
                    callBack(respone);
                }else{
                    callBack("{\"state\":1}");
                }
            }
        };
        xhr.open("GET", url, true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding","gzip,deflate");
        }

        xhr.timeout = 5000;// 10 seconds for timeout

        xhr.send();
    }

    httpPost (url,params, callback) {
        //发送合适的请求头信息
        let xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            // readyState值说明  
            // 0：请求未初始化，还没有调用 open()
            // 1：请求已经建立，但是还没有发送，还没有调用 send()
            // 2：请求已发送，正在处理中（通常现在可以从响应中获取内容头）
            // 3：请求在处理中；通常响应中已有部分数据可用了，没有全部完成
            // 4：响应已完成；您可以获取并使用服务器的响应
            if(xhr.readyState == 4){
                console.log('xhr.readyState='+xhr.readyState+'  xhr.status='+xhr.status);
                if(xhr.status >= 200 && xhr.status < 300){
                    var respone = xhr.responseText;
                    callback(respone);
                }else{
                    this.checkNetworkState()
                    callback("{\"state\":1}");
                }
            }
        }.bind(this);

        xhr.onerror = function () {
            Common.showPrompt("网络异常,请检测网络!");
            this.checkNetworkState()
        }.bind(this);

        console.log("url  = " + url)

        xhr.open("POST", url, true);
        
        //当我们创建一个异步对象XMLHttpRequest同时post方式向后台传输数据的时候。
        //我们要设置异步对象的xhr.setRequestHeader成员的值为
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        
        //设置头

        //xhr.setRequestHeader('user-sessionid', sessionId);
        
        //xhr.setRequestHeader("Content-Type","application/json");
        //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.timeout = 5000;// 5 seconds for timeout
       
        console.log("send")
        console.log(JSON.stringify(params))
        xhr.send(params);
        
    }
    //检测网络的状态
    checkNetworkState(){
        //没有ip地址是空那么就间隔5秒执行一次获取
        // if(Define.strIp == ""){
        //     TimeTaskManager.addTimeTask(5,function(){
        //         HttpManager.getInstance().getGameAddress();
        //     }.bind(this),"address",1)
        // }else{
        //     //有可以访问的ip地址了
        //     if(UserInfo.openid == ""){
        //         TimeTaskManager.addTimeTask(5,function(){
        //             WXHelper.checkWXLogin()
        //         }.bind(this),"login",1)
        //     }
        // }
    }

    //登录微信
    loginWX(code:string){
        // UIManager.getInstance().sendMessage(Define.viewStart,"refreshPropInfo")
        // let name  = UserInfo.nickName == ""?"#####":UserInfo.nickName
        // let netData =  "code="+code+"&nick_name="+name+"&avatar="+UserInfo.avatarUrl+"&friend_id="+Common.friendOpenId
        // console.log("开始执行登陆自己的服务器 netData = "+netData);
        // HttpManager.getInstance().httpPost(Define.strIp+Define.strPort+"/milk/login",netData,function(res){
        //     console.log("服务器回调")
        //     console.log(res);
        //     let data = JSON.parse(res)
        //     if(data.state == 0){
        //         console.log("登录成功")
        //         UserInfo.openid = data.obj.open_id
        //         //获得抽奖次数
        //         HttpManager.getInstance().checkLottery(function(info){
        //             if(info != null){
        //                 Common.userLotteryResidueCount = info.residue;
        //                 UIManager.getInstance().sendMessage(Define.viewStart,"refreshPropInfo")
        //             }
        //         }.bind(this))
        //         //获取用户游戏数据
        //         console.log("loadPastureData");
        //         PastureConfigMgr.loadPastureConfig();
        //          PastureDataMgr.loadPastureData(function(){
        //              PastureDataMgr.savePastureData();
        //         console.log("loadPastureData2");

        //          });
        //     }else{
        //         console.log("登录失败")
        //     }
        // }.bind(this))
    } 

    //获得抽奖次数
    checkLottery(callBack:Function){
        // let netData =  UserInfo.getRequestInfo()
        // console.log("获得抽奖次数 netData = "+netData);
        // HttpManager.getInstance().httpPost(Define.strIp+Define.strPort+"/milk/checkLottery",netData,function(res){
        //     console.log("服务器回调")
        //     console.log(res);
        //     let data = JSON.parse(res)
        //     if(data.state == 0){
        //         console.log("成功")
        //         if(callBack != null){
        //             callBack(data.obj)
        //         }
        //     }else{
        //         console.log("失败")
        //         Common.showPrompt("网络异常,请检测网络!");
        //         if(callBack != null){
        //             callBack(null)
        //         }
        //     }
        // }.bind(this))
    }
    //开始抽奖
    lottery(callBack:Function){
        // let netData =  UserInfo.getRequestInfo()
        // console.log("获得抽奖奖励信息 netData = " + netData);
        // HttpManager.getInstance().httpPost(Define.strIp+Define.strPort+"/milk/lottery",netData,function(res){
        //     console.log("服务器回调")
        //     console.log(res);
        //     let data = JSON.parse(res)
        //     if(data.state == 0){
        //         console.log("成功")
        //         if(callBack != null){
        //             callBack(data.obj)
        //         }
        //     }else{
        //         if(callBack != null){
        //             callBack(res)
        //         }
        //         console.log("失败")
        //     }
        // }.bind(this))
    }
    //增加抽奖次数
    addResidueLottery(callBack:Function){
        // let netData =  UserInfo.getRequestInfo()
        // console.log("增加抽奖次数 netData = " + netData);
        // HttpManager.getInstance().httpPost(Define.strIp+Define.strPort+"/milk/addResidueLottery",netData,function(res){
        //     console.log("服务器回调")
        //     console.log(res);
        //     let data = JSON.parse(res)
        //     if(data.state == 0){
        //         console.log("成功")
        //         if(callBack != null){
        //             callBack(data)
        //         }
        //     }else{
        //         console.log("失败")
        //         if(callBack != null){
        //             callBack(res)
        //         }
        //     }
        // }.bind(this))
    }
    //获取三名获得奖励
    getThreeLotteryInfo(callBack:Function){
        // let netData =  UserInfo.getRequestInfo()
        // console.log("获取三名获得奖励 netData = " + netData);
        // HttpManager.getInstance().httpPost(Define.strIp+Define.strPort+"/milk/getThreeLotteryInfo",netData,function(res){
        //     console.log("服务器回调")
        //     //console.log(res);
        //     let data = JSON.parse(res)
        //     if(data.state == 0){
        //         console.log("成功")
        //         if(callBack != null){
        //             callBack(data.obj)
        //         }
        //     }else{
        //         console.log("失败")
        //     }
        // }.bind(this))
    }
    //获得助力好友的状态
    getFriendHelpState(callBack:Function){
        // let netData =  UserInfo.getRequestInfo()
        // HttpManager.getInstance().httpPost(Define.strIp+Define.strPort+"/milk/lovelipstick/getFriendHelpState",netData,function(res){
        //     console.log("服务器回调")
        //     console.log(res);
        //     let data = JSON.parse(res)
        //     if(data.state == 0){
        //         console.log("成功")
        //         if(callBack != null){
        //             callBack(data.obj)
        //         }
        //     }else{
        //         if(callBack != null){
        //             callBack(null)
        //         }
        //         console.log("失败")
        //     }
        // }.bind(this))
    }
    //获得好友奖励信息
    drawDownFriendHelp(friendId:string,callBack:Function){
        // let netData =  "open_id="+UserInfo.openid+"&friend_id="+friendId
        // HttpManager.getInstance().httpPost(Define.strIp+Define.strPort+"/milk/lovelipstick/drawDownFriendHelp",netData,function(res){
        //     console.log("服务器回调")
        //     console.log(res);
        //     let data = JSON.parse(res)
        //     if(data.state == 0){
        //         console.log("成功")
        //         if(callBack != null){
        //             callBack(data)
        //         }
        //     }else{
        //         console.log("失败")
        //     }
        // }.bind(this))
    }
    //兑换口红
    exchangeCode(callBack:Function){ //cdKeyLipstick66
        // let netData =  "open_id="+UserInfo.openid+"&nickname="+UserInfo.nickName
        // HttpManager.getInstance().httpPost(Define.strIp+Define.strPort+"/milk/lovelipstick/cdKeyLipstick66",netData,function(res){
        //     console.log("服务器回调")
        //     console.log(res);
        //     let data = JSON.parse(res)
        //     if(data.state == 0){
        //         console.log("成功")
        //         if(callBack != null){
        //             callBack(data)
        //         }
        //     }else{
        //         console.log("失败")
        //     }
        // }.bind(this))
    }
    //获得兑换码
    getAllCDKey(callBack:Function){
        // let netData =  UserInfo.getRequestInfo()
        // HttpManager.getInstance().httpPost(Define.strIp+Define.strPort+"/milk/lovelipstick/getAllCDKey",netData,function(res){
        //     console.log("服务器回调")
        //     console.log(res);
        //     let data = JSON.parse(res)
        //     if(data.state == 0){
        //         console.log("成功")
        //         if(callBack != null){
        //             callBack(data)
        //         }
        //     }else{
        //         console.log("失败")
        //         if(callBack != null){
        //             callBack(data)
        //         }
        //     }
        // }.bind(this))
    }
    //获取游戏服务器链接的地址
    getGameAddress(){
        // if(Define.strIp != ""){
        //     if(UserInfo.openid == ""){ //如果没有open id 那么执行微信登录
        //         WXHelper.checkWXLogin()
        //     }
        //     return
        // }
        // console.log("getGameAddress 请求服务器主机地址........")
        // let netData = "ver="+Define.version+"&test="+Define.testState.toString()+"&game_id="+Define.gameId.toString()
        // HttpManager.getInstance().httpPost("https://beijingxiaoman.com/GetGameAddress",netData,function(res){
        //     console.log("服务器回调")
        //     console.log(res);
        //     let data = JSON.parse(res)
        //     if(data.state == 0){
        //         Define.strIp =  data.obj //动态的ip
        //         if(Define.testState == 1){//内网测试服务器
        //            //Define.strPort = ":8080";
        //         }
        //         if(cc.sys.platform!=cc.sys.WECHAT_GAME){
        //             PastureConfigMgr.loadPastureConfig();
        //             PastureDataMgr.loadPastureData(function(){
        //                  PastureDataMgr.savePastureData();
        //              });
        //         }
        //         WXHelper.checkWXLogin()
        //     }else{
        //         console.log("请求主机地址发送错误")
        //         this.checkNetworkState()
        //     }
        // }.bind(this))
    }

       //获得用户储存的数据
       getUserGameData(callBack:Function){
        // let netData =  UserInfo.getRequestInfo()
        // HttpManager.getInstance().httpPost(Define.strIp+Define.strPort+"/milk/pasture/GetBasic",netData,function(res){
        //     console.log("服务器回调")
        //     console.log(res);
        //     let data = JSON.parse(res)
        //     if(data.state == 0){
        //         console.log("成功")
        //         if(callBack != null){
        //             callBack(data)
        //         }
        //     }else{
        //         console.log("失败")
        //         if(callBack != null){
        //             callBack(data)
        //         }
        //     }
        // }.bind(this))
    }

   //上传用户存储的数据
   setUserGameData(data:any,callBack:Function){ //cdKeyLipstick66
    // let netData = JSON.stringify(data);
    // HttpManager.getInstance().httpPost(Define.strIp+Define.strPort+"/milk/pasture/SetBasic",netData,function(res){
    //     console.log("服务器回调")
    //     console.log(res);
    //     let data = JSON.parse(res)
    //     if(data.state == 0){
    //         console.log("上传用户游戏数据成功")
    //         if(callBack != null){
    //             callBack(data)
    //         }
    //     }else{
    //         console.log("上传用户游戏数据失败")
    //     }
    // }.bind(this))
}

    //上传服务器的信息
    submitUserInfo(){
        //不用上传分数
        if(UserInfo.openid == ""){
            return;
        }

        // if(UserInfo.maxScore <= UserInfo.serverMaxScore){
        //     return
        // }

        // UserInfo.serverMaxScore = UserInfo.maxScore;
        // let netData = "openid="+UserInfo.openid;
        // netData = netData + "&avatarUrl="+UserInfo.avatarUrl;
        // netData = netData + "&nickName="+UserInfo.nickName;
        // netData = netData + "&score="+UserInfo.maxScore;

        // HttpManager.getInstance().httpPost(Define.strIp+Define.strPort+"/users/submitInfo",netData,function(res){
        //     console.log("submitUserInfo 服务器回调")
 
        // }.bind(this))
    }
    //返回排行榜数据
    ranking(callBack:Function){
        // HttpManager.getInstance().httpPost(Define.strIp+Define.strPort+"/users/ranking","",function(res){
        //     console.log("服务器回调")
        //     // console.log(res);
        //     // let data = JSON.parse(res)
        //     // console.log("数组的长度 = " + data.length);
        //     // let dataArr:PlayerData[] = [];

        //     // for (var i:number = 0; i < data.length; i++) {
                
        //     //     let userData:PlayerData = new PlayerData();
        //     //     // userData.avatarUrl = data[i].avatarUrl
        //     //     // userData.score = data[i].score
        //     //     // userData.nickName = data[i].nickName
        //     //     // userData.isSelf = data[i].openid == UserInfo.openid
        //     //     // userData.rank = i + 1;
        //     //     // dataArr.push(userData)
        //     // }

        //     // console.log(dataArr)
        //     // callBack(dataArr)
        // }.bind(this))
    }
}
