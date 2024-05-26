import Common from "../common/Common";
import Define from "../common/Define";
import ResInfo from "../common/ResInfo";

export default class ResManager{

    private static prefabArr:ResInfo[] = [];
    private static frameArr:ResInfo[] = [];

    public static loadPrefab(url:string,callBack:Function){

        let obj = this.isAlreadyExsit(Define.loadTypePrefab,url);
        if(obj == null){
            cc.loader.loadRes(url, cc.Prefab, function(err, prefab) {
                if (err) {
                    cc.error(url)
                    cc.error(err.message || err);
                    return;
                }
                callBack(prefab);

                this.prefabArr.push(new ResInfo(url,prefab));
                
            }.bind(this));
        }else{
            callBack(obj);
        }
    }

    public static loadFrame(url:string,callBack:Function){
        let obj = this.isAlreadyExsit(Define.loadTypeFrame,url);
        if(obj == null){
            cc.loader.loadRes(url, cc.SpriteFrame, function(err, spFrame) {
                if (err) {
                    cc.error(err.message || err);
                    callBack(null)
                    return;
                }
                this.frameArr.push(new ResInfo(url,spFrame));
                callBack(spFrame)
            }.bind(this));
        }else{
            callBack(obj);
        }
    }


    private static isAlreadyExsit(loadType:number,ulr:string):cc.Object{
        let arr = null;
        if(loadType == Define.loadTypePrefab){
            arr = this.prefabArr;
        }else if(loadType == Define.loadTypeFrame){
            arr = this.frameArr;
        }

        for (let index = 0; index < arr.length; index++) {
            if(arr[index].key == ulr){
                return arr[index].node;
            }
        }
        return null;
    }

    //加载地图
    public static loadLevelBg(url:string,callBack:Function){
        ResManager.loadFrame("textures/"+url,function(spFrame){
            callBack(spFrame)
        }.bind(this));
    }

    //加载Block
    public static loadBlock(blockId:number,callBack:Function){
        ResManager.loadPrefab("prefabs/blocks/block1",function(prefab){
            callBack(prefab)
        }.bind(this));
    }

     //加载骨骼动画预制体
     public static loadSpine(path:string,callBack:Function){
        ResManager.loadPrefab("prefabs/spine/"+path,function(prefab){
            callBack(prefab)
        }.bind(this));
    }


    //加载地图数据
    public static loadMapData(info:string,callBack:Function){
        console.log("loadMapData info = " + info)
        if(Common.isChallenge){
            cc.loader.loadRes("challengeLevels/"+info, cc.TextAsset,function(err, content:cc.TextAsset) {
                if (err) {
                    cc.log(err.message || err);
                    callBack("")
                    return;
                }
                callBack(content.text)
            });
        }else{
            cc.loader.loadRes("levels/"+info, cc.TextAsset,function(err, content:cc.TextAsset) {
                if (err) {
                    cc.log(err.message || err);
                    callBack("")
                    return;
                }
                callBack(content.text)
            });
        }

    }
    //加载音效
    public static loadSound(url,callBack:Function){
        cc.loader.loadRes("sounds/"+url,cc.AudioClip,function(err, clip){
            callBack(clip)
        }.bind(this))
    }
}

//     cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
//         var audioID = cc.audioEngine.playMusic(clip, false);
//     });
// }
