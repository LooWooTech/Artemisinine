using LoowooTech.Artemisinine.Common;
using LoowooTech.Artemisinine.Manager;
using LoowooTech.Artemisinine.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LoowooTech.Artemisinine.Console
{
    class Program
    {
        static void Main(string[] args)
        {
            ESRI.ArcGIS.RuntimeManager.Bind(ESRI.ArcGIS.ProductCode.EngineOrDesktop);
            System.Console.WriteLine("成功绑定ArcGISEngine或者Desktop.....................");
            if (!LicenseManager.StartUp())
            {
                System.Console.WriteLine("ArcGIS授权失败！................................");
                return;
            }
            System.Console.WriteLine("成功完后ArcGIS授权！................................");
            var featureclass= GISManager.GetH();
            GISHelper.StatisticCounty();
            //GISHelper.Statistic();
            //GISManager.UpdateValue();
            //var operate = new FileManager();
            //var uploadfile = operate.GetAnalyzeFile();
            //if (uploadfile != null)
            //{
            //    System.Console.WriteLine("成功读取到文件：" + uploadfile.FileName);
            //    var values = ExcelHelper.Analyze(uploadfile.SavePath, uploadfile.Thing, uploadfile.Year);
            //    System.Console.WriteLine("开始保存到SDE中");

            //    //var rightTime = GISManager.Operate(values, uploadfile.Thing);
            //    var JGIDDict = values.Transform();//将每个时间的疾病数据转换为医疗机构的疾病数据值
            //    //try
            //    //{
            //    //    GISManager.UpdateHopsitalData(JGIDDict, uploadfile.Thing);
            //    //}
            //    //catch (Exception ex)
            //    //{
            //    //    System.Console.WriteLine(ex.Message);
            //    //    System.Console.ReadLine();
            //    //    return;
            //    //}

            //    //if (rightTime != null)
            //    //{
            //    //    var recordTool = new RecordManager();
            //    //    foreach (var item in rightTime)
            //    //    {
            //    //        recordTool.Update(item, uploadfile.Thing);
            //    //    }
            //    //}


            //    System.Console.WriteLine("开始Shapefile文件！");
            //    //GISManager.CreateShapeFile(values);
            //    System.Console.WriteLine("保存在一个文件中");
            //    //GISManager.OperateSum(values, uploadfile.Thing);

            //}
            System.Console.WriteLine("完成");
            System.Console.ReadLine();
            LicenseManager.ShutDown();
            System.Console.WriteLine("成功关闭ArcGIS授权！................................");
            System.Console.WriteLine("疾病数据分析程序结束！..............................");
        }
    }
}
