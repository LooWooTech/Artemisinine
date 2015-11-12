using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LoowooTech.Artemisinine.Manager
{
    public static class SQLManager
    {
        private static string Server { get; set; }
        private static string User { get; set; }
        private static string Password { get; set; }
        private static string Database { get; set; }

        static SQLManager()
        {
            Server = System.Configuration.ConfigurationManager.AppSettings["SQLSERVER"];
            User = System.Configuration.ConfigurationManager.AppSettings["USER"];
            Password = System.Configuration.ConfigurationManager.AppSettings["PASSWORD"];
            Database = System.Configuration.ConfigurationManager.AppSettings["DATABASE"];
        }

        public static Dictionary<DateTime, double> GetTrend(string XZC, string Thing)
        {
            var dict = new Dictionary<DateTime, double>();
            var operate = new DiseaseManager();
            var list = operate.Get(Thing);
            foreach (var item in list)
            {

            }
            return dict;
        }
    }
}
