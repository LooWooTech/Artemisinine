using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;

namespace LoowooTech.Artemisinine.Common
{
    public class AppSettings
    {
        public static AppSettings Current = new AppSettings();

        public Dictionary<string, string> Data { get; private set; }

        private AppSettings()
        {
            Data = new Dictionary<string, string>();
            foreach (var key in ConfigurationManager.AppSettings.AllKeys)
            {
                var key1 = key;//.ToLower();
                if (Data.ContainsKey(key1))
                {
                    Data[key1] = ConfigurationManager.AppSettings[key];
                }
                else
                {
                    Data.Add(key1, ConfigurationManager.AppSettings[key]);
                }
            }
        }

        public string this[string key]
        {
            get
            {
                //key = key.ToLower();
                return Data.ContainsKey(key) ? Data[key] : null;
            }
        }

        public static string Get(string key)
        {
            return Current[key];
        }


        public Document GetConfigs()
        {
            var doc = new Document();
            foreach (var cfg in Data)
            {
                var name = cfg.Key;
                doc[name] = cfg.Value;
            }
            return doc;
        }
    }
}
