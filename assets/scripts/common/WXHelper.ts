import Common from "./Common";
import UserInfo from "../UserInfo";
import UIManager from "../manager/UIManager";
import Define from "./Define";
import HttpManager from "../manager/HttpManager";
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
export default class WXHelper{

    isShow:boolean = false
    tex:cc.Texture2D = null;
    display:cc.Sprite = null;

    public static instance:WXHelper;
    initWXHelper(){
        WXHelper.instance = this;
        if(cc.sys.platform == cc.sys.WECHAT_GAME) {
            this.initOnShareAppMessage();

            let info = wx.getLaunchOptionsSync()
            if(info.query != null && info.query.openid != null){
                console.log("我是被邀请进来的")
                Common.friendOpenId = info.query.openid
            }
            console.log("小程序启动的值")
            console.log(info)
        }else{
            UserInfo.openid = "123"
            UserInfo.nickName = "测试账号123"
        }
    }


    initOnShareAppMessage(){
        wx.showShareMenu();

        let showStr:string = Define.shareDesc1
        let shareRes:string = "textures/shangxian_fenxiang"
        if(Common.getRandom(0,3) != 0){
            showStr = Define.shareDesc1
            shareRes = "textures/shangxian_fenxiang"
        }
        cc.loader.loadRes(shareRes,function(err,data){	
            wx.onShareAppMessage(function(res){		
                return {				
                    title: showStr,				
                    imageUrlId: 'f8n0EhB6QiiW586IHS3xlA',
                    imageUrl:  'https://mmocgame.qpic.cn/wechatgame/r5bjOS7zliaAhibxe0JcQo3wONRRZgH1IbUCKSDoAjgkpXnEbOAUDtOt6KsSlUYlWY/0',	
                    success(res){				
                        console.log("转发成功!!!")		
	
                    },fail(res){		
                        console.log("转发失败!!!")			
                    } 		
                }
            })	
        })  
    }

    //分享
    shareAppMessage(str:string,query:string = "") 
    {
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            let showStr:string = Define.shareDesc1
            let shareRes:string = "textures/shangxian_fenxiang"
            if(Common.getRandom(0,3) != 0){
                showStr = Define.shareDesc1
                shareRes = "textures/shangxian_fenxiang"
            }

            wx.shareAppMessage({
                title: showStr,
                imageUrlId: 'f8n0EhB6QiiW586IHS3xlA',
                imageUrl:  'https://mmocgame.qpic.cn/wechatgame/r5bjOS7zliaAhibxe0JcQo3wONRRZgH1IbUCKSDoAjgkpXnEbOAUDtOt6KsSlUYlWY/0',
                query:query,
                success(res){				
                    console.log("转发成功!!!")		

                },fail(res){		
                    console.log("转发失败!!!")			
                } 	
            });
            
            /*
            cc.loader.loadRes(shareRes,function(err,data){	
                
                console.log(data.url)
                wx.shareAppMessage({
                    title: showStr,
                    imageUrl:  data.url,
                    success(res){				
                        console.log("转发成功!!!")		
	
                    },fail(res){		
                        console.log("转发失败!!!")			
                    } 	
                });
            })  */
        }
    }

    _updaetSubDomainCanvas () {
        if (this.tex == null) {
            return;
        }
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            let openDataContext = window.wx.getOpenDataContext();
            let sharedCanvas = openDataContext.canvas;
            this.tex.initWithElement(sharedCanvas);
            this.tex.handleLoadedTexture();
            this.display.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    }

    update (dt) {
        if(this.isShow){
            this._updaetSubDomainCanvas();
        }
    }

    showView(name:string,tag:string = "-1"){
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            console.log("显示子域 name = " +name);
            if(this.tex != null){
                this.tex.destroy();
                this.tex = null;
            }
            this.tex = new cc.Texture2D();
            this.display.node.active = true;
            this.tex.width = 750;
            this.tex.height = 1334;
            this.isShow = true
            wx.postMessage({
                messageType: "showView",
                viewName:name,
                tag:tag
            })
        }
    }

    hideView(name:string){

        console.log("hideView           000000000")
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            this.isShow = false;
            if(this.tex != null){
                this.tex.destroy();
                this.tex = null;
                console.log("hideView           55555")
            }
            if(this.display.spriteFrame != null){
                this.display.spriteFrame.destroy();
                this.display.spriteFrame = null;
            }
            console.log("hideView           888888")
            this.display.node.active = false;
            wx.postMessage({
                messageType: "hideView",
                viewName:name
            })
            console.log("hideView           99999999999")
        }
    }
    //提交分数
    submitScore(submitScore:number){

        //HttpManager.getInstance().submitUserInfo();
        // if(UserInfo.curScore > UserInfo.maxScore){
        //     UserInfo.maxScore = UserInfo.curScore;
        // }   
        //暂时每次都提交处理版本更新问题
        console.log("上传分数  submitScore ==== " + submitScore.toString())
        let score:string = submitScore.toString()
        let testDate = new Date();
        let week:string =  Common.getYearWeek(testDate.getFullYear(),testDate.getMonth()+1,testDate.getDate()).toString();
        //UserInfo.saveMaxScore();
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            wx.postMessage({
                messageType: "score",
                score:score,
                week:week
            });
        }
    }

    public static checkWXLogin(){
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.getSetting({
                success: function (res) {
                    let authSetting = res.authSetting
                    if (authSetting['scope.userInfo'] === true) {
                        //用户已授权，可以直接调用相关 API
 
                        wx.getUserInfo({
                            success:function(res) {
                                let userInfo = res.userInfo
                                UserInfo.nickName = userInfo.nickName
                                UserInfo.avatarUrl = userInfo.avatarUrl
                                console.log("getUserInfo")
                                console.log(res)
                                WXHelper.wxLogin(res)
                            }
                        })
    
                    } else if (authSetting['scope.userInfo'] === false){
                        // 用户已拒绝授权，再调用相关 API 或者 wx.authorize 会失败，需要引导用户到设置页面打开授权开关
                        console.log('用户已拒绝授权，再调用相关 API');
                        WXHelper.createWXLoginBtn();
                    } else {
                        // 未询问过用户授权，调用相关 API 或者 wx.authorize 会弹窗询问用户
                        console.log('未询问过用户授权，再调用相关 API');
                        WXHelper.createWXLoginBtn();
                    }
                }
            });
        }        
    }
    public static wxloginBtn:any = null
    public static createWXLoginBtn (){
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            //UIManager.getInstance().showView(Define.viewLogin)  
            
            let sysInfo = wx.getSystemInfoSync();
            //获取微信界面大小
            let width = sysInfo.screenWidth;
            let height = sysInfo.screenHeight;
    
            WXHelper.wxloginBtn = wx.createUserInfoButton({
                type: 'text',
                text: '',
                style: {
                    left: 0,
                    top: 0,
                    width: width,
                    height: height,
                    lineHeight: 40,
                    //backgroundColor: '#ff0000',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: 16,
                    borderRadius: 4
                }
            })
    
            WXHelper.wxloginBtn.onTap(function (res) {
                let res2 = res;
                console.log(res2)
    
                if(res2.userInfo == null){
                    console.log("玩家点击了取消")
                    return
                }else{
                    console.log("点击点击的确认")
                    WXHelper.wxLogin(res2)
                    WXHelper.wxloginBtn.destroy();//隐藏按钮
                }
            })
    
        }
    }
    
    public static wxLogin(res2){
        wx.login({
            success: function (res) {
                if (res.code) {
                    console.log("success ..........")
                    console.log(res)
                    //jscode用于后台解密隐私数据encryptedData，参考https://developers.weixin.qq.com/minigame/dev/document/open-api/login/wx.login.html
                    let jscode=res.code;
    
                    let userInfo = res2.userInfo


                    let nickName = userInfo.nickName

                    let avatarUrl = userInfo.avatarUrl
            
                    UserInfo.avatarUrl = avatarUrl
                    UserInfo.nickName = nickName
    
                    let encryptedData = encodeURIComponent(res2.encryptedData);//一定要把加密串转成URI编码
                    let rawData = encodeURIComponent(res2.rawData);
                    let iv = res2.iv;
                    let signature = res2.signature;
                            

                    HttpManager.getInstance().loginWX(jscode)
    
                    // gNet.setHandler(WXHelper.msgHandler, this);
                    // console.log("服务器请求openid jscode = " + jscode)
                    // NetRequest.sendWXOpenIdRequest(jscode)
                    // 执行登录自己的服务器
                }else{
                    console.log('登录失败！' + res.errMsg);
                }
            }
        });
    }


    public static createImage(avatarUrl,spFace:cc.Sprite) {
        if (CC_WECHATGAME) {
            try {
                let image = wx.createImage();
                image.onload = () => {
                    try {
                        let texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        spFace.spriteFrame = new cc.SpriteFrame(texture);
                    } catch (e) {
                        cc.log(e);
                        spFace.node.active = false;
                    }
                };
                image.src = avatarUrl;
            } catch (e) {
                cc.log(e);
                spFace.node.active = false;
            }
        } else {
            cc.loader.load({
                url: avatarUrl, type: 'jpg'
            }, (err, texture) => {
                spFace.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    }

    public static bannerAd = null;
    private static bannerAdId = "adunit-f27c3e43154d296d" //commonBanner
    private static showCount:number = 0;
    private static bannerIsShow:boolean = false
    public static showBannder(isShow){
    
        if(cc.sys.platform != cc.sys.WECHAT_GAME){
            return
        }
        let screenHeight = wx.getSystemInfoSync().screenHeight;
        let screenWidth = wx.getSystemInfoSync().screenWidth;
       
        let bannerWidth:number = screenWidth
        let bannerHeight:number = 80
        WXHelper.bannerIsShow = isShow
        
        if(isShow){
            Common.changeBannerTaskTime.setPause(false)
            if(WXHelper.bannerAd == null){
                WXHelper.bannerAd = wx.createBannerAd({
                    adUnitId: WXHelper.bannerAdId,
                    style: {
                        left: (screenWidth-bannerWidth)*0.5,
                        top: screenHeight - bannerHeight,
                        width: bannerWidth
                    }
                })
                WXHelper.bannerAd.onLoad(() => {
                    console.log('banner 广告加载成功')

                })
                WXHelper.bannerAd.onError(err => {
                    console.log("showBannder onError = ")
                    console.log(err)
                })
            }
            WXHelper.bannerAd.show().catch(err => console.log(err))
            WXHelper.bannerAd.onResize(function (res){
                WXHelper.bannerAd.style.top = screenHeight - WXHelper.bannerAd.style.realHeight;
            });
            
        }else{
            Common.changeBannerTaskTime.setPause(true)
            if(WXHelper.bannerAd != null){
                WXHelper.bannerAd.hide(); 
            }
        }
        //小尺寸适配
        /*
        if(isShow){
            
            let bannerWidth:number = 300
            let bannerHeight:number = 80
            // 广告1和2
            if(WXHelper.bannerAd == null) {
                // 广告
                WXHelper.bannerAd = wx.createBannerAd({
                    adUnitId: WXHelper.bannerAdId,
                    style: {
                        left: (screenWidth-bannerWidth)*0.5,
                        top: screenHeight - bannerHeight,
                        width: bannerWidth
                    }
                })
                WXHelper.bannerAd.onLoad(() => {
                    console.log('banner 广告加载成功')
                })
                WXHelper.bannerAd.onError(err => {
                    console.log("showBannder onError = ")
                    console.log(err)
                })
            }
            Common.changeBannerTaskTime.setPause(false)
            WXHelper.bannerAd.show().catch(err => console.log(err))

            WXHelper.bannerAd.onResize(function (res){
                WXHelper.bannerAd.style.top = screenHeight - WXHelper.bannerAd.style.realHeight;
            });
            // WXHelper.bannerAd.onResize(()=>{
            //     WXHelper.bannerAd.style.left = screenWidth/2 - 150 + 0.1;
            // });
            WXHelper.bannerAd.onError(function(res){
                console.log(res);
            })
        }else{
            Common.changeBannerTaskTime.setPause(true)
            if(WXHelper.bannerAd != null){
                WXHelper.bannerAd.hide(); 
            }
        }*/
    }
    //改变banner 广告
    public static changeBanner(){
        if(WXHelper.bannerAd != null && WXHelper.bannerIsShow){
            WXHelper.bannerAd.destroy();
            WXHelper.bannerAd = null
            WXHelper.showBannder(true)
        }
    }


    // video_fuhuo
    // adunit-68b829d3ac23ef00
    // 奶粉 adunit-3d3229e6165c592c
    // 口红 adunit-5157571720d1f1fd
    // 激励式视频
    public static isLoadVideoSuccessful:boolean = false  //广告加载是否成功 会出现加载失败的情况
    public static video = null;
    private static videoId = "adunit-3d3229e6165c592c" 
    private static videoCallBack:Function;
    public static initRewardedVideoAd(){

        if(cc.sys.platform != cc.sys.WECHAT_GAME){
            return
        }

        WXHelper.video = wx.createRewardedVideoAd({ adUnitId: WXHelper.videoId})
        WXHelper.video.onError(function (errMsg){
            console.log("广告播放失败")
            WXHelper.videoCallBack(2)
        });

        WXHelper.video.onLoad(() => {
            console.log("WXHelper.isLoadVideoSuccessful")
            WXHelper.isLoadVideoSuccessful = true
        })
        
        WXHelper.video.onClose(function (res):void 
        {
            WXHelper.isLoadVideoSuccessful = false
            //SoundManager.pauseBackGroundSound(false)
            Common.isGamePause = false
            if (res.isEnded) 
            {
                console.log("广告播放成功 11")
                WXHelper.videoCallBack(1)
            }
            else
            {
                console.log("广告播放失败 00")
                WXHelper.videoCallBack(0)
            }
        });
    }

    //展示广告
    public static showVideo(callBack:Function){
        if(cc.sys.platform != cc.sys.WECHAT_GAME){
            return
        }
        if(!WXHelper.isLoadVideoSuccessful){
            console.log("广告加载失败")
            return;
        }
        //SoundManager.pauseBackGroundSound(true)
        Common.isGamePause = true
        console.log("showVideo   222")
        WXHelper.videoCallBack = callBack
        WXHelper.video.show().catch(err => console.log(err)).then(() => console.log('激励视频 广告显示'))
    }
    //短震动
    public static brateShort(){
        if(cc.sys.platform != cc.sys.WECHAT_GAME){
            return
        }
        if(UserInfo.openBrateTag == 1){
            return
        }
        wx.vibrateShort({})
    }
    //震动
    public static brateLong(){
        if(cc.sys.platform != cc.sys.WECHAT_GAME){
            return
        }
        if(UserInfo.openBrateTag == 1){
            return
        }
        wx.vibrateLong({})
    }

    //跳转到其它的小游戏
    static appIdArr:string [] = ["","wx2408344b7e2e0798","wx53420085302416c1"] 
    static jumpToMiniProgram(index:number){
        //index 1.口红消消消  2.密室与成语
        if(cc.sys.platform != cc.sys.WECHAT_GAME){
            return
        }
        let appId:string = this.appIdArr[index]
        wx.navigateToMiniProgram({
            appId: appId,
            success(res) {
            // 打开成功
                console.log("success 666")
                console.log(res)
            },
            fail(res){
                console.log("fail 666")
                console.log(res)
            },complete(){
                console.log("complete 666")

            }
        })
    }

    static addTotalEvent(eventName:string,eventInfo:any){//阿拉丁发送事件
        if(cc.sys.platform != cc.sys.WECHAT_GAME){
            return
        }
        wx.aldSendEvent(eventName+eventInfo)
    }

    public static openCustomerServiceConversation(){
        if(cc.sys.platform != cc.sys.WECHAT_GAME){
            return
        }
        wx.openCustomerServiceConversation({})
    }
    //清理旧的版本资源
    public static cleanOldAssets(){
        console.log("11执行清理缓存资源....")
        wxDownloader.cleanOldAssets()
    }
}
