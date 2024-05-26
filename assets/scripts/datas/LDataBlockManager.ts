import LDataBlock from "./LDataBlock";
export default class LDataBlockManager 
{
    public static dataList:LDataBlock[] = [];
    public static GetDataById(index:number):LDataBlock
    {    
        if(LDataBlockManager.dataList.length == 0){
            LDataBlockManager.dataList[0] = new LDataBlock(0,"透明道具",0,false,-9999,-9999,false,"kouhong");
            LDataBlockManager.dataList[1] = new LDataBlock(1,"口红",1,false,-9999,1,true,"kouhong");
            LDataBlockManager.dataList[2] = new LDataBlock(2,"香水",1,false,-9999,1,true,"xiangshui");
            LDataBlockManager.dataList[3] = new LDataBlock(3,"粉底",1,false,-9999,1,true,"fenbing");
            LDataBlockManager.dataList[4] = new LDataBlock(4,"眼影",1,false,-9999,1,true,"yanying");
            LDataBlockManager.dataList[5] = new LDataBlock(5,"指甲油",1,false,-9999,1,true,"zhijiayou");
            LDataBlockManager.dataList[6] = new LDataBlock(6,"障碍物3滴血",2,false,7,2,false,"zhangaiwu_huaban_three");
            LDataBlockManager.dataList[7] = new LDataBlock(7,"障碍物2滴血",2,false,8,2,false,"zhangaiwu_huaban_two");
            LDataBlockManager.dataList[8] = new LDataBlock(8,"障碍物1滴血",2,false,-9999,2,false,"zhangaiwu_huaban_one");
            LDataBlockManager.dataList[9] = new LDataBlock(9,"移动障碍物3滴血",4,false,10,2,false,"zhangaiwu_wuya_three");
            LDataBlockManager.dataList[10] = new LDataBlock(10,"移动障碍物2滴血",4,false,11,2,false,"zhangaiwu_wuya_two");
            LDataBlockManager.dataList[11] = new LDataBlock(11,"移动障碍物1滴血",4,false,-9999,2,false,"zhangaiwu_wuya_one");
            LDataBlockManager.dataList[12] = new LDataBlock(12,"锁格子道具3滴血",2,true,13,3,false,"zhangaiwu_tengman_three");
            LDataBlockManager.dataList[13] = new LDataBlock(13,"锁格子道具2滴血",2,true,14,3,false,"zhangaiwu_tengman_two");
            LDataBlockManager.dataList[14] = new LDataBlock(14,"锁格子道具1滴血",2,true,-9999,3,false,"zhangaiwu_tengman_one");
            LDataBlockManager.dataList[15] = new LDataBlock(15,"下落收集道具苹果",3,false,-9999,5,false,"zhangaiwu_apple");
            LDataBlockManager.dataList[16] = new LDataBlock(16,"下落收集道具香蕉",3,false,-9999,5,false,"zhangaiwu_bananer");
            LDataBlockManager.dataList[17] = new LDataBlock(17,"下落收集道具橘子",3,false,-9999,5,false,"zhangaiwu_orange");
            LDataBlockManager.dataList[18] = new LDataBlock(18,"藤蔓横上",2,false,-9999,6,false,"lianteng_xia");
            LDataBlockManager.dataList[19] = new LDataBlock(19,"藤蔓横下",2,false,-9999,6,false,"lianteng_shang");
            LDataBlockManager.dataList[20] = new LDataBlock(20,"藤蔓竖左",2,false,-9999,6,false,"lianteng_you");
            LDataBlockManager.dataList[21] = new LDataBlock(21,"藤蔓竖右",2,false,-9999,6,false,"lianteng_zuo");
            LDataBlockManager.dataList[22] = new LDataBlock(22,"透明",2,false,-9999,6,false,"lianteng0");
        }
        return LDataBlockManager.dataList[index]
    }
}
