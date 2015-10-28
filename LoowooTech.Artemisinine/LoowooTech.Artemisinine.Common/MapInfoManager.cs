using LoowooTech.Artemisinine.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;

namespace LoowooTech.Artemisinine.Common
{
    public static class MapInfoManager
    {
        private static string Folder = "Maps";

        private static XmlDocument ConfigXml { get; set; }
        static MapInfoManager()
        {
            ConfigXml = new XmlDocument();
            ConfigXml.Load(GetPath(System.Configuration.ConfigurationManager.AppSettings["INFO"]));
        }

        private static string GetPath(string FileName)
        {
            return System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, Folder, FileName);
        }


        /// <summary>
        /// 获取疾病数据所有年
        /// </summary>
        /// <returns></returns>
        public static List<int> GetYears()
        {
            var list = new List<int>();
            var nodes = ConfigXml.SelectNodes("/Maps/Map/Layer");
            if (nodes != null)
            {
                for (var i = 0; i < nodes.Count; i++)
                {
                    var year = int.Parse(nodes[i].Attributes["Year"].Value.ToString());
                    if (!list.Contains(year))
                    {
                        list.Add(year);
                    }
                }
            }
            list = list.OrderBy(e => e).ToList();
            return list;
        }

        public static List<int> GetMonths(int Year)
        {
            var list = new List<int>();
            var nodes = ConfigXml.SelectNodes("/Maps/Map/Layer[@Year='"+Year.ToString("0000")+"']");
            if (nodes != null)
            {
                for (var i = 0; i < nodes.Count; i++)
                {
                    var month = int.Parse(nodes[i].Attributes["Month"].Value.ToString());
                    if (!list.Contains(month))
                    {
                        list.Add(month);
                    }
                }
            }
            list = list.OrderBy(e => e).ToList();
            return list;
        }

        public static Dictionary<int,int> GetDays(int Year, int Month)
        {
            var dict = new Dictionary<int, int>();
            var nodes = ConfigXml.SelectNodes("/Maps/Map/Layer[@Year='" + Year.ToString("0000") + "'][@Month='"+Month.ToString("00")+"']");
            if (nodes != null)
            {
                for (var i = 0; i < nodes.Count; i++)
                {
                    var index = int.Parse(nodes[i].Attributes["value"].Value.ToString());
                    var day = int.Parse(nodes[i].Attributes["Day"].Value.ToString());
                    if (!dict.ContainsKey(day))
                    {
                        dict.Add(day, index);
                    }
                }
            }
            dict = dict.OrderBy(e => e.Key).ToDictionary(e=>e.Key,e=>e.Value);
            return dict;
        }
        public static List<int> GetIndexs()
        {
            var list = new List<int>();
            var nodes = ConfigXml.SelectNodes("/Maps/Map/Layer");
            if (nodes != null)
            {
                for (var i = 0; i < nodes.Count; i++)
                {
                    var index = int.Parse(nodes[i].Attributes["value"].Value.ToString());
                    if (!list.Contains(index))
                    {
                        list.Add(index);
                    }
                }
            }
            return list;
        }

        public static string HtmlResult(List<int> List)
        {
            string str = string.Empty;
            foreach (var item in List)
            {
                str += "<option value='" + item + "'>" + item + "</option>";
            }
            return str;
        }
        public static string HtmlResult<T>(Dictionary<T, int> Dict)
        {
            string str = string.Empty;
            foreach (var key in Dict.Keys)
            {
                str += "<option value='" + Dict[key] + "'>" + key + "</option>";
            }
            return str;
        }

    }
}
