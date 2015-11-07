using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;

namespace LoowooTech.Artemisinine.Models
{
    /// <summary>
    /// 记录用户上传疾病数据的时间列表
    /// </summary>
    [Table("records")]
    public class Record
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
        public string SickName { get; set; }
    }
}
