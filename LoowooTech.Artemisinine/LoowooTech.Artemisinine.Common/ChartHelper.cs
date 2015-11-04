using LoowooTech.Artemisinine.Models;
using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LoowooTech.Artemisinine.Common
{
    public static class ChartHelper
    {
        public static string GetJavaScriptContent(Dictionary<DateTime, double> dict, string FilePath)
        {
            string str = string.Empty;
            try
            {
                using (var reader = new StreamReader(FilePath))
                {
                    str = reader.ReadToEnd();
                }
            }
            catch
            {
                return null;
            }
            int Index = str.IndexOf("labels: [");
            StringBuilder SSB = new StringBuilder(str);
            StringBuilder Labelsb = new StringBuilder();
            StringBuilder datasb = new StringBuilder();
            var list = new List<DateTime>(dict.Keys);
           // for(var i=0 count=list.Count;i<coun)
            foreach (var key in dict.Keys)
            {
                Labelsb.Append('"' + key.ToShortDateString().ToString() + '"');
                datasb.Append(Math.Round(dict[key], 4));
                Labelsb.Append(',');
                datasb.Append(',');
            }
            SSB.Insert(Index + 9, Labelsb);
            Index = SSB.ToString().IndexOf("data: [");
            SSB.Insert(Index + 7, datasb);
            return SSB.ToString();

            
        }
        public static string GetJavaScriptContent(List<DiseaseBase> list, string FilePath)
        {
            return GetJavaScriptContent(list.ToDictionary(entry=>entry.Time,entry=>entry.Data), FilePath);
            /*
            string str = string.Empty;
            try
            {
                using (var reader = new StreamReader(FilePath))
                {
                    str = reader.ReadToEnd();
                }
            }
            catch
            {
                return null;
            }
            int count=list.Count;
            if(count==0){
                return str;
            }
            int Index = str.IndexOf("labels: [");
            StringBuilder SSB = new StringBuilder(str);
            StringBuilder Labelsb = new StringBuilder();
            StringBuilder datasb = new StringBuilder();
            for (var i = 0; i < count; i++)
            {
                Labelsb.Append('"' + list[i].Time.ToShortDateString().ToString() + '"');
                datasb.Append(Math.Round(list[i].Data, 4));
                if (i != (count - 1))
                {
                    Labelsb.Append(',');
                    datasb.Append(',');
                }
            }
            SSB.Insert(Index + 9, Labelsb);
            Index = SSB.ToString().IndexOf("data: [");
            SSB.Insert(Index + 7, datasb);
            return SSB.ToString();
            */
        }
    }
}
