 using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LoowooTech.Artemisinine.Models
{
    public class Disease
    {
        public int ID { get; set; }
        public string JGID { get; set; }
        public double Data { get; set; }
        public DateTime Time { get; set; }
        public string Thing { get; set; }
    }
    public class DiseaseBase
    {
        /// <summary>
        /// 疾病数据
        /// </summary>
        public double Data { get; set; }
        /// <summary>
        /// 时间
        /// </summary>
        public DateTime Time { get; set; }

       
    }
}
