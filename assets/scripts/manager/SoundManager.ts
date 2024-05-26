import Common from "../common/Common";
import Define from "../common/Define";
import UserInfo from "../UserInfo";
import GameManager from "./GameManager";
import ResManager from "./ResManager";
import TimeTaskManager from "./TimeTaskManager";
import UIManager from "./UIManager";


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
export default class SoundManager {

    static audioSourceArr:cc.AudioSource[] = []
    static guidAudioClips:any ={};
    static curGuidAudio:number = -1;


    static musicid:number =1; 


    public static palySoundById(strRes:string,isLoop:boolean = false){
        
        if(!isLoop){
            //播放sound
            if(UserInfo.openSoundTag == 1){
                return
            }
        }

        ResManager.loadSound(strRes,function(clip){
            if(clip == null){
                console.log("strRes = " + strRes + " 音效加载失败...........")
                return
            }
            cc.audioEngine.playEffect(clip, false);
        }.bind(this))
        // let audioSource  = SoundManager.getAudioSource(strRes); 
   
        // if(audioSource != null){
        //     audioSource.loop = isLoop
        //     //if(!audioSource.loop)
        //     audioSource.stop();
        //     audioSource.play();
        //     SoundManager.audioSourceArr[strRes] = audioSource
        // }
    }

    public static playGuidSoundById(strRes:string){
        if(this.curGuidAudio!=-1){
            cc.audioEngine.stopEffect(this.curGuidAudio);
        }
        let clips=this.guidAudioClips;
        if(typeof clips[strRes] != "undefined"){
            let clip=clips[strRes];
            this.curGuidAudio=cc.audioEngine.playEffect(clip,false);
        }else{
            this.palySoundById(strRes,false);
        }
    }

    public static addGuidSound(strRes:string,clip:cc.AudioClip){
        this.guidAudioClips[strRes]=clip;
    }

    public static getAudioSource(str:string):cc.AudioSource{
        for (let index = 0; index <  Common.nodeSoundRoot.childrenCount; index++) {
            if(Common.nodeSoundRoot.children[index].name == str){
                return Common.nodeSoundRoot.children[index].getComponent<cc.AudioSource>(cc.AudioSource)
            }         
        }
        return null
    }    
    
    public static pauseBackGroundSound(isPause,musicRes:string,isLoop:boolean=true){
        
        //let sound = SoundManager.audioSourceArr[musicRes]
        let sound = null;
        if(isPause){
            //console.log("暂停了背景音乐"+Common.curMusicRes);
            cc.audioEngine.pauseMusic()
        }else{
            
            Common.curMusicRes = musicRes //当前要开启的背景音乐(不考虑开关)
            //console.log("播放了背景音乐"+Common.curMusicRes);
            if(Common.curMusicRes==Define.backgroundmusic[0])
            {
                //console.log("背量为0.3");
                cc.audioEngine.setMusicVolume(0.3);
            }else{
                //console.log("背量为1");
                cc.audioEngine.setMusicVolume(0.3);
            }            
            if(UserInfo.openMusicTag == 1){
                return
            }           
            if(sound != null){
                //console.log("%%%%%恢复了背景音乐"+Common.curMusicRes);
                cc.audioEngine.resumeMusic()
            }else{
                ResManager.loadSound(musicRes,function(clip){
                    if(clip == null){
                        console.log("musicRes = " + musicRes + " 音乐背景加载失败...........")
                        return
                    }
                    cc.audioEngine.stopMusic();
                    //console.log("加载资源播放背景音乐"+Common.curMusicRes);
                    cc.audioEngine.playMusic(clip, isLoop);
                    
                }.bind(this))
            }
        }
    }

    public static playBackGroundMusic(musicRes:string)
    {
        for(let i=0;i<Define.backgroundmusic.length;i++)
        {                       
            if(musicRes==Define.backgroundmusic[i])
            {                           
                this.pauseBackGroundSound(false,musicRes);
                return;
            }
            else 
            {
                this.pauseBackGroundSound(true,musicRes);
            }
        }
    }

    public static resumeBackGroundSound(){
        console.log('resumeBackGroundSound')
        console.log('UserInfo.openMusicTag = ' + UserInfo.openMusicTag)
        console.log('cc.audioEngine.isMusicPlaying ' + cc.audioEngine.isMusicPlaying())
        if(UserInfo.openMusicTag == 1){
            return
        }
        cc.audioEngine.pauseMusic()
        console.log("tttttttttt = " + cc.audioEngine.getMusicVolume())

        TimeTaskManager.addTimeTask(0.5,function(){
            console.log("播放音乐............")
            SoundManager.pauseBackGroundSound(false,Common.curMusicRes)
        }.bind(this),"resumeBackGroundSound",1)
    }

    public static checkLoopMusic(){

        // if(UserInfo.isLoop!=1){
        //     return;
        // }
        //切换一次背景音乐
        //SoundManager.pauseBackGroundSound(false,Define.gamemusic[1],false);
        Common.changeMusicTaskTime = TimeTaskManager.addTimeTask(1,function(){

            console.log("音乐检测音乐检测音乐检测音乐检测音乐检测音乐检测音乐检测")
            if(!cc.audioEngine.isMusicPlaying()){

                console.log("音乐停止检测停止音乐检测停止停止停止停止停止停止停止停止停止")
                Common.musicid++;

                console.log("this.musicid"+Common.musicid);
                SoundManager.pauseBackGroundSound(false,Define.gamemusic[Common.musicid],false);
                if(UIManager.getInstance().isShow(Define.viewMusic)){
                    UIManager.getInstance().sendMessage(Define.viewMusic,"changeMusic",Common.musicid)
                    console.log("this.musicid"+Common.musicid);
                }
                if(Common.musicid==4){
                    Common.musicid=0;
                }
            }         
            //WXHelper.changeBanner();
        }.bind(this),"changeMusic")
        if(UserInfo.isLoop==1){
            Common.changeMusicTaskTime.setPause(false)
        }else{
            Common.changeMusicTaskTime.setPause(true)
        }
    }
}
