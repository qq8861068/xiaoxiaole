import LDataConsume from "./LDataConsume";
export default class LDataConsumeManager 
{
    public static dataList:LDataConsume[] = [];
    public static GetDataById(index:number):LDataConsume
    {    
        if(LDataConsumeManager.dataList.length == 0){
            LDataConsumeManager.dataList[0] = new LDataConsume(0,1,288,"-9999");
            LDataConsumeManager.dataList[1] = new LDataConsume(1,2,588,"-9999");
            LDataConsumeManager.dataList[2] = new LDataConsume(2,3,2888,"-9999");
            LDataConsumeManager.dataList[3] = new LDataConsume(3,4,8888,"-9999");
            LDataConsumeManager.dataList[4] = new LDataConsume(4,5,8888,"-9999");
            LDataConsumeManager.dataList[5] = new LDataConsume(5,6,18888,"-9999");
        }
        return LDataConsumeManager.dataList[index]
    }
}
