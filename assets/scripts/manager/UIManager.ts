import ViewBase from "../ui/ViewBase";
import ResManager from "./ResManager";
import Common from "../common/Common";
import Define from "../common/Define";
import UserInfo from "../UserInfo";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class UIManager{

    private viewArr:ViewBase[] = [];
    private static instance:UIManager = null;

    private loadIdArr:number [] = [];

    curViewId:number = 0;

    public static getInstance():UIManager{
        if(this.instance == null){
            this.instance = new UIManager();
        }
        return this.instance;
    }
    //显示界面
    showView(viewId:number,callBack:Function = null){

        //金币写入本地
        UserInfo.addGold(0);
        
        this.curViewId = viewId;
        if(this.viewArr[viewId] == null){
            if(this.loadIdArr[viewId] == 1){
                return //强制只加载一次
            }
            this.loadIdArr[viewId] = 1
            ResManager.loadPrefab("prefabs/ui/" + Define.viewUrl[viewId],function(prefab){
                let viewNode = cc.instantiate(prefab);
                let viewCtr = (viewNode as cc.Node).getComponent<ViewBase>(ViewBase);
                this.viewArr[viewId] = viewCtr;
                Common.nodeUiRoot.addChild(viewNode);
                Common.showBanner(true,viewId)
                viewCtr.showView();
                if(callBack != null){
                    callBack();
                }
            }.bind(this));
        }else{
            Common.showBanner(true,viewId)
            this.viewArr[viewId].showView()
            if(callBack != null){
                callBack();
            }
        }
    }
   //显示牧场界面
   showView2(viewId:number,callBack:Function = null){
    
    this.curViewId = viewId;
    if(this.viewArr[viewId] == null){
        if(this.loadIdArr[viewId] == 1){
            return //强制只加载一次
        }
        this.loadIdArr[viewId] = 1
        ResManager.loadPrefab("prefabs/ui2/" + Define.viewUrl[viewId],function(prefab){
            let viewNode = cc.instantiate(prefab);
            let viewCtr = (viewNode as cc.Node).getComponent<ViewBase>(ViewBase);
            this.viewArr[viewId] = viewCtr;
            Common.nodeUiRoot.addChild(viewNode);
            viewCtr.showView();
            if(callBack != null){
                Common.showBanner(true,viewId)
                callBack();
            }
        }.bind(this));
    }else{
        Common.showBanner(true,viewId)
        this.viewArr[viewId].showView()
        if(callBack != null){
            callBack();
        }
    }
}
    //隐藏界面
    hideView(viewId:number,hideCallBack:Function = null){
        if(this.viewArr[viewId] != null){
            Common.showBanner(false,viewId)
            this.viewArr[viewId].hideView()
            if(hideCallBack != null){
                hideCallBack();
            }
        }else{
            console.log("当前界面没有打开...");
        }
    }

    removeView(viewId:number){
        if(this.viewArr[viewId] != null){
            Common.showBanner(false,viewId)
            this.viewArr[viewId].hideView()
            this.viewArr[viewId].destroy()
            this.viewArr[viewId] = null
            this.loadIdArr[viewId] = 0
        }
    }

    //刷新界面
    refreshView(viewId:number,isFristRefresh:boolean = false){
        if(this.viewArr[viewId] != null){
            this.viewArr[viewId].refreshView(isFristRefresh)
        }
    }

    // 其它的事件
    sendMessage(viewId:number,eventTag:string = "defualt",args: any = null){
        if(this.viewArr[viewId] != null){
            this.viewArr[viewId].message(eventTag,args)
        }
    }

    isShow(viewId:number):boolean{
        if(this.viewArr[viewId] == null){
            return false
        }
        return this.viewArr[viewId].isShow
    }
}
