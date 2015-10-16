using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;

namespace LoowooTech.Artemisinine.Models
{
    [Table("files")]
    public class UploadFile
    {
        public UploadFile()
        {
            CreateTime = DateTime.Now;
        }
        [Key]
        [DatabaseGenerated(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        /// <summary>
        /// 疾病事件
        /// </summary>
        public string Thing { get; set; }
        public string Year { get; set; }
        public string FileName { get; set; }
        public DateTime CreateTime { get; set; }
        /// <summary>
        /// 读取疾病文件时间
        /// </summary>
        public DateTime CheckTime { get; set; }
        [Column("State",TypeName="INT")]
        public UploadFileProcessState State { get; set; }
        [MaxLength(1023)]
        public string ProcessMessage { get; set; }
        [MaxLength(1023)]
        public string SavePath { get; set; }
    }

    public enum UploadFileProcessState
    {
        [Description("未读取")]
        UnProcessed,
        [Description("正在读取")]
        Processing,
        [Description("成功读取")]
        Processed,
        [Description("错误")]
        Error
    }
}
