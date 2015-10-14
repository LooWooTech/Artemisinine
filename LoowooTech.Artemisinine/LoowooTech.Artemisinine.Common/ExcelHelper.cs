using LoowooTech.Artemisinine.Models;
using NPOI.SS.UserModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace LoowooTech.Artemisinine.Common
{
    public static class ExcelHelper
    {
        private static IWorkbook OpenWorkbook(string FilePath)
        {
            using (var fs = new FileStream(FilePath, FileMode.Open, FileAccess.Read))
            {
                return WorkbookFactory.Create(fs);
            }
        }

        private static DateTime GetDateTime(string str, string Year)
        {
            var value = 0;
            int.TryParse(str, out value);
            int year = 0;
            if (string.IsNullOrEmpty(Year))
            {
                year = value / 10000;
                value = value % 10000;
            }
            else
            {
                int.TryParse(Year, out year);
            }
            var month = value / 100;
            var day = value % 100;

            return Convert.ToDateTime(string.Format("{0}-{1}-{2}", year, month, day));
            
        }

        private static string GetValue(this ICell cell)
        {
            switch (cell.CellType)
            {
                case CellType.String:
                    return cell.StringCellValue;
                case CellType.Formula:
                    return cell.NumericCellValue.ToString();
                default: return cell.ToString();
            }
        }

        private static Dictionary<int, DateTime> GetTimeRow(IRow row,string Year)
        {
            var dict = new Dictionary<int, DateTime>();
            var index = 1;
            var cell = row.GetCell(index);
            while (cell != null)
            {
                if (!dict.ContainsKey(index))
                {
                    dict.Add(index, GetDateTime(cell.GetValue(), Year));
                }
                cell = row.GetCell(++index);
            }
            return dict;
        }


        public static Dictionary<DateTime, List<Disease>> Analyze(string FilePath,string Thing,string Year=null)
        {
            var workbook = OpenWorkbook(FilePath);
            Console.WriteLine("成功打开Excel文件!");
            var sheet = workbook.GetSheetAt(0);
            var row = sheet.GetRow(0);
            var dict = GetTimeRow(row,Year);

            var valDict = new Dictionary<DateTime, List<Disease>>();
            Console.WriteLine(string.Format("成功获取第一行时间数据！一共有{0}个时间数据", dict.Count));

            var lines = 1;
            for (var i = lines; i <= sheet.LastRowNum; i++)
            {
                row = sheet.GetRow(i);
                if (row == null)
                {
                    continue;
                }
                var JGID = row.GetCell(0).GetValue();
                if (string.IsNullOrEmpty(JGID))
                {
                    continue;
                }
                Console.WriteLine(string.Format("正在读取{0}医疗机构疾病数据", JGID));
                foreach (var item in dict.Keys)
                {
                    var value = row.GetCell(item).GetValue();
                    double val = 0.0;
                    if (double.TryParse(value, out val) && val > 0)
                    {
                        var time = dict[item];

                        if (valDict.ContainsKey(time))
                        {
                            valDict[time].Add(new Disease()
                            {
                                JGID = JGID,
                                Data = val,
                                Time = time,
                                Thing = Thing
                            });
                        }
                        else
                        {
                            valDict.Add(time, new List<Disease>(){new Disease(){
                            JGID=JGID,
                            Data=val,
                            Time=time,
                            Thing=Thing
                            }});
                        }
                    }
                }
            }
            return valDict;
        }
    }
}
