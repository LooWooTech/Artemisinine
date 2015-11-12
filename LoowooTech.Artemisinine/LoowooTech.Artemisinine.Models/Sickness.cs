using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;

namespace LoowooTech.Artemisinine.Models
{
    [Table("sickness")]
    public class Sickness
    {
        [Key]
        [DatabaseGenerated(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        /// <summary>
        /// 年
        /// </summary>
        public int Year { get; set; }
        /// <summary>
        /// 月
        /// </summary>
        [Range(1,12)]
        public int Month { get; set; }
        /// <summary>
        /// 日
        /// </summary>
        [Range(1,31)]
        public int Day { get; set; }
        /// <summary>
        /// 疾病名称
        /// </summary>
        public string Thing { get; set; }
        /// <summary>
        /// 疾病率
        /// </summary>
        public double Data { get; set; }
        /// <summary>
        /// 医疗机构ID
        /// </summary>
        public string JGID { get; set; }
        /// <summary>
        /// 所在行政村
        /// </summary>
        public string XZC { get; set; }
        /// <summary>
        /// 所在行政区
        /// </summary>
        public string XZQ { get; set; }
    }
}
