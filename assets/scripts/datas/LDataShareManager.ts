import LDataShare from "./LDataShare";
export default class LDataShareManager 
{
    public static dataList:LDataShare[] = [];
    public static GetDataById(index:number):LDataShare
    {    
        if(LDataShareManager.dataList.length == 0){
            LDataShareManager.dataList[0] = new LDataShare(0,-9999,"-9999");
            LDataShareManager.dataList[1] = new LDataShare(1,1,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[2] = new LDataShare(2,2,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[3] = new LDataShare(3,3,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[4] = new LDataShare(4,4,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[5] = new LDataShare(5,5,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[6] = new LDataShare(6,6,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[7] = new LDataShare(7,7,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[8] = new LDataShare(8,8,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[9] = new LDataShare(9,9,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[10] = new LDataShare(10,10,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[11] = new LDataShare(11,11,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[12] = new LDataShare(12,12,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[13] = new LDataShare(13,13,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[14] = new LDataShare(14,14,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[15] = new LDataShare(15,15,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[16] = new LDataShare(16,16,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[17] = new LDataShare(17,17,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[18] = new LDataShare(18,18,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[19] = new LDataShare(19,19,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[20] = new LDataShare(20,20,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[21] = new LDataShare(21,21,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[22] = new LDataShare(22,22,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[23] = new LDataShare(23,23,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[24] = new LDataShare(24,24,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[25] = new LDataShare(25,25,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[26] = new LDataShare(26,26,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[27] = new LDataShare(27,27,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[28] = new LDataShare(28,28,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[29] = new LDataShare(29,29,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[30] = new LDataShare(30,30,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[31] = new LDataShare(31,31,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[32] = new LDataShare(32,32,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[33] = new LDataShare(33,33,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[34] = new LDataShare(34,34,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[35] = new LDataShare(35,35,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[36] = new LDataShare(36,36,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[37] = new LDataShare(37,37,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[38] = new LDataShare(38,38,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[39] = new LDataShare(39,39,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[40] = new LDataShare(40,40,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[41] = new LDataShare(41,41,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[42] = new LDataShare(42,42,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[43] = new LDataShare(43,43,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[44] = new LDataShare(44,44,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[45] = new LDataShare(45,45,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[46] = new LDataShare(46,46,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[47] = new LDataShare(47,47,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[48] = new LDataShare(48,48,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[49] = new LDataShare(49,49,"1,18;2,18;3,18;4,18;5,18;101,16888");
            LDataShareManager.dataList[50] = new LDataShare(50,50,"1,18;2,18;3,18;4,18;5,18;101,16888");
        }
        return LDataShareManager.dataList[index]
    }
}
