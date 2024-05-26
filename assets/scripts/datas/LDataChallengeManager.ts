import LDataChallenge from "./LDataChallenge";
export default class LDataChallengeManager 
{
    public static dataList:LDataChallenge[] = [];
    public static GetDataById(index:number):LDataChallenge
    {    
        if(LDataChallengeManager.dataList.length == 0){
            LDataChallengeManager.dataList[0] = new LDataChallenge(0,"-9999");
            LDataChallengeManager.dataList[1] = new LDataChallenge(1,"1;2;3;4;5;6;7;8;9;10");
            LDataChallengeManager.dataList[2] = new LDataChallenge(2,"11;12;13;14;15;16;17;18;19;20");
            LDataChallengeManager.dataList[3] = new LDataChallenge(3,"21;22;23;24;25;26;27;28;29;30");
            LDataChallengeManager.dataList[4] = new LDataChallenge(4,"31;32;33;34;35;36;37;38;39;40");
        }
        return LDataChallengeManager.dataList[index]
    }
}
