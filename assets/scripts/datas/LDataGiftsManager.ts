import LDataGifts from "./LDataGifts";
export default class LDataGiftsManager 
{
    public static dataList:LDataGifts[] = [];
    public static GetDataById(index:number):LDataGifts
    {    
        if(LDataGiftsManager.dataList.length == 0){
            LDataGiftsManager.dataList[0] = new LDataGifts(0,"新手礼包","1,5;2,5;3,5;4,5;5,5;101,888");
            LDataGiftsManager.dataList[1] = new LDataGifts(1,"登陆礼包","1,1;2,1;3,1;4,1;5,1;101,100");
            LDataGiftsManager.dataList[2] = new LDataGifts(2,"登陆礼包5倍奖励","1,5;2,5;3,5;4,5;5,5;101,500");
            LDataGiftsManager.dataList[3] = new LDataGifts(3,"金币不足弹窗广告","1,3;2,3;3,3;4,3;5,3;101,500");
        }
        return LDataGiftsManager.dataList[index]
    }
}
