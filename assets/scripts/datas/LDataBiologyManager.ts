import LDataBiology from "./LDataBiology";
export default class LDataBiologyManager 
{
    public static dataList:LDataBiology[] = [];
    public static GetDataById(index:number):LDataBiology
    {    
        if(LDataBiologyManager.dataList.length == 0){
            LDataBiologyManager.dataList[1] = new LDataBiology(0,"花1-1","水仙",1000,1,0.015,"biology_icon0","biology_icon0");
            LDataBiologyManager.dataList[2] = new LDataBiology(1,"花1-1","牡丹",5000,3,0.02,"biology_icon1","biology_icon1");
            LDataBiologyManager.dataList[3] = new LDataBiology(2,"鱼1","红色锦鲤",1000,1,0.055,"biology_icon2","biology_icon2");
            LDataBiologyManager.dataList[4] = new LDataBiology(3,"鱼2","黄色锦鲤",5000,3,0.06,"biology_icon3","biology_icon3");
            LDataBiologyManager.dataList[5] = new LDataBiology(4,"牛1","奶牛",1000,1,0.025,"biology_icon4","biology_icon4");
            LDataBiologyManager.dataList[6] = new LDataBiology(5,"牛2","奶牛",5000,3,0.03,"biology_icon5","biology_icon5");
        }
        return LDataBiologyManager.dataList[index]
    }
}
