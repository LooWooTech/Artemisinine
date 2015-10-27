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


        public static Dictionary<string, List<TimeRecord>> Get()
        {
            var dict = new Dictionary<string, List<TimeRecord>>();
            var nodes = ConfigXml.SelectNodes("/Maps/Map");
            if (nodes != null)
            {
                for (var i = 0; i < nodes.Count; i++)
                {
                    var name = nodes[i].Attributes["Name"].Value.ToString();
                    var lnodes = ConfigXml.SelectNodes("/Maps/Map[@Name='" + name + "']/Layer");
                    var list = new List<TimeRecord>();
                    if (lnodes != null)
                    {
                        for (var j = 0; j < lnodes.Count; j++)
                        {
                            list.Add(new TimeRecord()
                            {
                                Year = int.Parse(lnodes[j].Attributes["Year"].Value.ToString()),
                                Month = int.Parse(lnodes[j].Attributes["Month"].Value.ToString()),
                                Day = int.Parse(lnodes[j].Attributes["Day"].Value.ToString()),
                                Index = int.Parse(lnodes[j].Attributes["value"].Value.ToString())
                            });
                        }
                    }
                    if (!dict.ContainsKey(name))
                    {
                        dict.Add(name, list);
                    }
                }
            }
            return dict;
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
        

        public static Dictionary<string,int> GetDays(int Year)
        {
            var dict = new Dictionary<string, int>();
            var nodes = ConfigXml.SelectNodes("/Maps/Map/Layer[@Year='" + Year + "']");
            if (nodes != null)
            {
                List<TimeRecord> list = new List<TimeRecord>();
                for (var i = 0; i < nodes.Count; i++)
                {
                    list.Add(new TimeRecord()
                    {
                        Month = int.Parse(nodes[i].Attributes["Month"].Value.ToString()),
                        Day = int.Parse(nodes[i].Attributes["Day"].Value.ToString()),
                        Index = int.Parse(nodes[i].Attributes["value"].Value.ToString())
                    });
                }
                list = list.OrderBy(e => e.Month).ToList();
                foreach (var item in list)
                {
                    var date = string.Format("{0}月{1}日", item.Month, item.Day);
                    if (!dict.ContainsKey(date))
                    {
                        dict.Add(date, item.Index);
                    }
                }
            }
            return dict;
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
