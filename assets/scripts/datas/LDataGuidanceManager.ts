import LDataGuidance from "./LDataGuidance";
export default class LDataGuidanceManager 
{
    public static dataList:LDataGuidance[] = [];
    public static GetDataById(index:number):LDataGuidance
    {    
        if(LDataGuidanceManager.dataList.length == 0){
            LDataGuidanceManager.dataList[0] = new LDataGuidance(0,-9999,"-9999");
            LDataGuidanceManager.dataList[1] = new LDataGuidance(1,1,"完成挑战赛，就有机会抽奖大牌奶粉哦！");
            LDataGuidanceManager.dataList[2] = new LDataGuidance(2,1,"挑战赛，每天最多可以参加6次哦！");
            LDataGuidanceManager.dataList[3] = new LDataGuidance(3,1,"三个相同道具连在一起，就可以消除哦。");
            LDataGuidanceManager.dataList[4] = new LDataGuidance(4,1,"真棒！四个相同道具连到一起，会有good消除哦。");
            LDataGuidanceManager.dataList[5] = new LDataGuidance(5,1,"很好，再试一个新的消除姿势！");
            LDataGuidanceManager.dataList[6] = new LDataGuidance(6,1,"五个相同的道具连到一起，会有perfect消除哦。");
            LDataGuidanceManager.dataList[7] = new LDataGuidance(7,1,"太棒了，赶快开启您的快乐消除之旅吧。");
            LDataGuidanceManager.dataList[8] = new LDataGuidance(8,2,"太棒了，赢得了挑战赛，快去参加抽奖吧。");
            LDataGuidanceManager.dataList[9] = new LDataGuidance(9,3,"点击开始按钮，有机会获得大牌奶粉哦");
            LDataGuidanceManager.dataList[10] = new LDataGuidance(10,3,"攒够66次抽奖机会，可以直接兑换大牌奶粉哦！");
        }
        return LDataGuidanceManager.dataList[index]
    }
}
