import LDataBanner from "./LDataBanner";
export default class LDataBannerManager 
{
    public static dataList:LDataBanner[] = [];
    public static GetDataById(index:number):LDataBanner
    {    
        if(LDataBannerManager.dataList.length == 0){
            LDataBannerManager.dataList[0] = new LDataBanner(0,"消除界面",false);
            LDataBannerManager.dataList[1] = new LDataBanner(1,"忽略",false);
            LDataBannerManager.dataList[2] = new LDataBanner(2,"关卡编辑器",false);
            LDataBannerManager.dataList[3] = new LDataBanner(3,"忽略",false);
            LDataBannerManager.dataList[4] = new LDataBanner(4,"排行榜",false);
            LDataBannerManager.dataList[5] = new LDataBanner(5,"普通关卡中途退出弹框",true);
            LDataBannerManager.dataList[6] = new LDataBanner(6,"普通关卡胜利弹框",true);
            LDataBannerManager.dataList[7] = new LDataBanner(7,"普通关卡+10步弹窗",true);
            LDataBannerManager.dataList[8] = new LDataBanner(8,"普通关卡失败弹窗",true);
            LDataBannerManager.dataList[9] = new LDataBanner(9,"设置界面",true);
            LDataBannerManager.dataList[10] = new LDataBanner(10,"主界面",false);
            LDataBannerManager.dataList[11] = new LDataBanner(11,"转盘界面",false);
            LDataBannerManager.dataList[12] = new LDataBanner(12,"挑战赛中途退出弹框",true);
            LDataBannerManager.dataList[13] = new LDataBanner(13,"挑战赛开始弹窗",true);
            LDataBannerManager.dataList[14] = new LDataBanner(14,"新手奖励弹窗",true);
            LDataBannerManager.dataList[15] = new LDataBanner(15,"挑战赛胜利弹窗",true);
            LDataBannerManager.dataList[16] = new LDataBanner(16,"好友助力弹窗",false);
            LDataBannerManager.dataList[17] = new LDataBanner(17,"奖励展示弹窗",false);
            LDataBannerManager.dataList[18] = new LDataBanner(18,"活动规则弹窗",true);
            LDataBannerManager.dataList[19] = new LDataBanner(19,"挑战赛+10步弹窗",true);
            LDataBannerManager.dataList[20] = new LDataBanner(20,"兑换奖励弹窗",true);
            LDataBannerManager.dataList[21] = new LDataBanner(21,"奖品兑换码显示弹窗",true);
            LDataBannerManager.dataList[22] = new LDataBanner(22,"本期奖品展示弹窗",false);
            LDataBannerManager.dataList[23] = new LDataBanner(23,"挑战赛金币不足弹窗",true);
            LDataBannerManager.dataList[24] = new LDataBanner(24,"游戏loading界面",false);
            LDataBannerManager.dataList[25] = new LDataBanner(25,"每日奖励弹窗",true);
            LDataBannerManager.dataList[26] = new LDataBanner(26,"普通关卡开始弹窗",true);
            LDataBannerManager.dataList[27] = new LDataBanner(27,"新手引导1-10",false);
            LDataBannerManager.dataList[28] = new LDataBanner(28,"忽略",false);
            LDataBannerManager.dataList[29] = new LDataBanner(29,"忽略",false);
            LDataBannerManager.dataList[30] = new LDataBanner(30,"忽略",false);
            LDataBannerManager.dataList[31] = new LDataBanner(31,"忽略",false);
            LDataBannerManager.dataList[32] = new LDataBanner(32,"忽略",false);
            LDataBannerManager.dataList[33] = new LDataBanner(33,"忽略",false);
            LDataBannerManager.dataList[34] = new LDataBanner(34,"忽略",false);
            LDataBannerManager.dataList[35] = new LDataBanner(35,"忽略",false);
            LDataBannerManager.dataList[36] = new LDataBanner(36,"忽略",false);
            LDataBannerManager.dataList[37] = new LDataBanner(37,"剩余挑战次数不足弹框",false);
            LDataBannerManager.dataList[38] = new LDataBanner(38,"牧场家园界面",false);
            LDataBannerManager.dataList[39] = new LDataBanner(39,"牧场家园商店界面",false);
            LDataBannerManager.dataList[40] = new LDataBanner(40,"花仙子升级弹框",false);
            LDataBannerManager.dataList[41] = new LDataBanner(41,"花仙子升级成功弹框",false);
            LDataBannerManager.dataList[42] = new LDataBanner(42,"购买鲜花弹框",false);
            LDataBannerManager.dataList[43] = new LDataBanner(43,"没有足够星星弹框",false);
            LDataBannerManager.dataList[44] = new LDataBanner(44,"花仙子升级弹框",false);
            LDataBannerManager.dataList[45] = new LDataBanner(45,"花仙子升级成功弹框",false);
            LDataBannerManager.dataList[46] = new LDataBanner(46,"浇花弹框",false);
            LDataBannerManager.dataList[47] = new LDataBanner(47,"浇花成功弹框",false);
            LDataBannerManager.dataList[48] = new LDataBanner(48,"领取浇花收获金币弹框",false);
            LDataBannerManager.dataList[49] = new LDataBanner(49,"忽略",false);
            LDataBannerManager.dataList[50] = new LDataBanner(50,"忽略",false);
        }
        return LDataBannerManager.dataList[index]
    }
}
