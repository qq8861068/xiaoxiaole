import LDataTurntable from "./LDataTurntable";
export default class LDataTurntableManager 
{
    public static dataList:LDataTurntable[] = [];
    public static GetDataById(index:number):LDataTurntable
    {    
        if(LDataTurntableManager.dataList.length == 0){
            LDataTurntableManager.dataList[0] = new LDataTurntable(0,"1001,101,;101;2;102;4;102;5;101","1;300;1;1;1;1;1;500","100;30000;10000;5000;10000;5000;10000;20000","1001;100");
            LDataTurntableManager.dataList[1] = new LDataTurntable(1,"1001;2,3,4,5,101;2,3,4,5;2,3,101;4,5,101;2,3,4,5;1001;2,3,4,5;4,5,101;102;2,3,101;4,5,101","1;1,1,1,1,666;2,2,2,2;3,3,666;3,3,666;3,3,3,3;1;2,2,2,2;3,3,666;1;3,3,666;3,3,888","100;2600;1000;800;800;5000;100;2600;800;200;1000;5000","1001;100");
            LDataTurntableManager.dataList[2] = new LDataTurntable(2,"1001;2,3,101;4,5,101;2,4,101;3,5,101;2,5,101;1001;3,4,101;4,5,101;102;2,3,101;4,5,101","1;1,1,1314;2,2,520;3,3,666;3,3,666;3,3,520;1;2,2,888;3,3,666;1;3,3,666;3,3,888","100;7800;3000;2400;2400;15000;100;7800;2400;600;3000;15000","1001;100");
            LDataTurntableManager.dataList[3] = new LDataTurntable(3,"1001;2,3,101;4,5,101;1002;3,5,101;2,5,101;1001;3,4,101;4,5,101;1003;2,3,101;4,5,101","1;1,1,1314;2,2,520;1;3,3,666;3,3,520;1;2,2,888;3,3,666;1;3,3,666;3,3,888","100;15000;50;300;50;15000;100;15000;50;150;50;15000","1001,100;1002,30;1003,75");
        }
        return LDataTurntableManager.dataList[index]
    }
}
