using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;

namespace LoowooTech.Artemisinine.Models
{
    [Table("diseases")]
    public class Disease
    {
        [Key]
        [DatabaseGenerated(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public string JGID { get; set; }
        public double Data { get; set; }
        public DateTime Time { get; set; }
        public string Thing { get; set; }
        public string XZC { get; set; }
        public  string XZQ { get; set; }
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
