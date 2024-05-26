import LDataChallengelevels from "./LDataChallengelevels";
export default class LDataChallengelevelsManager 
{
    public static dataList:LDataChallengelevels[] = [];
    public static GetDataById(index:number):LDataChallengelevels
    {    
        if(LDataChallengelevelsManager.dataList.length == 0){
            LDataChallengelevelsManager.dataList[0] = new LDataChallengelevels(0,-9999,-9999,-9999,-9999,"-9999","-9999","-9999","-9999",-9999,"-9999");
            LDataChallengelevelsManager.dataList[1] = new LDataChallengelevels(1,1,1,-9999,30,"1,45","1;2;3;4;5","25;25;25;25;25","3",3,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[2] = new LDataChallengelevels(2,2,-9999,-9999,13,"4,22","1;2;3;4;5","25;25;25;25;25","3",3,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[3] = new LDataChallengelevels(3,3,-9999,-9999,13,"2,17","1;2;3;4;5","25;25;25;25;25","3",3,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[4] = new LDataChallengelevels(4,1,-9999,-9999,15,"2,26","1;2;3;4;5","25;25;25;25;25","3",3,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[5] = new LDataChallengelevels(5,2,-9999,-9999,16,"4,28","1;2;3;4;5","25;25;25;25;25","3",3,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[6] = new LDataChallengelevels(6,3,-9999,-9999,14,"2,18","1;2;3;4;5","25;25;25;25;25","3",3,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[7] = new LDataChallengelevels(7,1,-9999,-9999,13,"5,22","1;2;3;4;5","25;25;25;25;25","3",3,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[8] = new LDataChallengelevels(8,2,-9999,-9999,14,"4,24","1;2;3;4;5","25;25;25;25;25","3",3,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[9] = new LDataChallengelevels(9,3,-9999,-9999,15,"4,19","1;2;3;4;5","25;25;25;25;25","3",3,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[10] = new LDataChallengelevels(10,1,-9999,-9999,13,"4,22","1;2;3;4;5","25;25;25;25;25","3",3,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[11] = new LDataChallengelevels(11,4,-9999,-9999,16,"4,25","1;2;3;4;5","25;25;25;25;25","0",0,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[12] = new LDataChallengelevels(12,6,-9999,-9999,12,"3,22","1;2;3;4;5","25;25;25;25;25","0",0,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[13] = new LDataChallengelevels(13,8,-9999,-9999,11,"3,25","1;2;3;4;5","25;25;25;25;25","0",0,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[14] = new LDataChallengelevels(14,8,-9999,-9999,12,"1,21","1;2;3;4;5","25;25;25;25;25","0",0,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[15] = new LDataChallengelevels(15,6,-9999,-9999,12,"3,22","1;2;3;4;5","25;25;25;25;25","0",0,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[16] = new LDataChallengelevels(16,9,-9999,-9999,14,"2,30","1;2;3;4;5","25;25;25;25;25","0",0,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[17] = new LDataChallengelevels(17,4,-9999,-9999,14,"3,24","1;2;3;4;5","25;25;25;25;25","0",0,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[18] = new LDataChallengelevels(18,8,-9999,-9999,13,"2,24","1;2;3;4;5","25;25;25;25;25","0",0,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[19] = new LDataChallengelevels(19,8,-9999,-9999,12,"2,26","1;2;3;4;5","25;25;25;25;25","0",0,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[20] = new LDataChallengelevels(20,9,-9999,-9999,11,"5,25","1;2;3;4;5","25;25;25;25;25","0",0,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[21] = new LDataChallengelevels(21,5,-9999,-9999,15,"1,43","1;2;3;4;5","25;25;25;25;25","1",1,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[22] = new LDataChallengelevels(22,8,-9999,-9999,14,"4,39","1;2;3;4;5","25;25;25;25;25","1",1,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[23] = new LDataChallengelevels(23,8,-9999,-9999,15,"3,42","1;2;3;4;5","25;25;25;25;25","1",1,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[24] = new LDataChallengelevels(24,8,-9999,-9999,13,"3,34","1;2;3;4;5","25;25;25;25;25","1",1,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[25] = new LDataChallengelevels(25,7,-9999,-9999,12,"1,32","1;2;3;4;5","25;25;25;25;25","1",1,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[26] = new LDataChallengelevels(26,8,-9999,-9999,12,"2,31","1;2;3;4;5","25;25;25;25;25","1",1,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[27] = new LDataChallengelevels(27,5,-9999,-9999,13,"1,35","1;2;3;4;5","25;25;25;25;25","1",1,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[28] = new LDataChallengelevels(28,7,-9999,-9999,15,"3,43","1;2;3;4;5","25;25;25;25;25","1",1,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[29] = new LDataChallengelevels(29,8,-9999,-9999,12,"4,34","1;2;3;4;5","25;25;25;25;25","1",1,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[30] = new LDataChallengelevels(30,8,-9999,-9999,13,"5,38","1;2;3;4;5","25;25;25;25;25","1",1,"1,1;2,1;3,1;4,1;5,1");
            LDataChallengelevelsManager.dataList[31] = new LDataChallengelevels(31,8,-9999,-9999,12,"2,78","1;2;3;4;5","25;25;25;25;25","2",2,"-9999");
            LDataChallengelevelsManager.dataList[32] = new LDataChallengelevels(32,8,-9999,-9999,10,"4,66","1;2;3;4;5","25;25;25;25;25","2",2,"-9999");
            LDataChallengelevelsManager.dataList[33] = new LDataChallengelevels(33,8,-9999,-9999,11,"5,66","1;2;3;4;5","25;25;25;25;25","2",2,"-9999");
            LDataChallengelevelsManager.dataList[34] = new LDataChallengelevels(34,8,-9999,-9999,10,"3,70","1;2;3;4;5","25;25;25;25;25","2",2,"-9999");
            LDataChallengelevelsManager.dataList[35] = new LDataChallengelevels(35,7,-9999,-9999,13,"1,78","1;2;3;4;5","25;25;25;25;25","2",2,"-9999");
            LDataChallengelevelsManager.dataList[36] = new LDataChallengelevels(36,8,-9999,-9999,13,"1,72","1;2;3;4;5","25;25;25;25;25","2",2,"-9999");
            LDataChallengelevelsManager.dataList[37] = new LDataChallengelevels(37,5,-9999,-9999,13,"5,82","1;2;3;4;5","25;25;25;25;25","2",2,"-9999");
            LDataChallengelevelsManager.dataList[38] = new LDataChallengelevels(38,8,-9999,-9999,12,"4,74","1;2;3;4;5","25;25;25;25;25","2",2,"-9999");
            LDataChallengelevelsManager.dataList[39] = new LDataChallengelevels(39,8,-9999,-9999,10,"4,62","1;2;3;4;5","25;25;25;25;25","2",2,"-9999");
            LDataChallengelevelsManager.dataList[40] = new LDataChallengelevels(40,8,-9999,-9999,12,"1,68","1;2;3;4;5","25;25;25;25;25","2",2,"-9999");
        }
        return LDataChallengelevelsManager.dataList[index]
    }
}
