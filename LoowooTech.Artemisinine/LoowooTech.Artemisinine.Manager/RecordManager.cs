using LoowooTech.Artemisinine.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LoowooTech.Artemisinine.Manager
{
    public class RecordManager:ManagerBase
    {
        /// <summary>
        /// 判断是否存在相关记录
        /// </summary>
        /// <param name="record"></param>
        /// <returns>存在 true  不存在false</returns>
        private bool IsExist(Record record)
        {
            using (var db = GetARDataContext())
            {
                var entry = db.Records.FirstOrDefault(e => e.Year == record.Year && e.Month == record.Month && e.Day == record.Day && e.SickName == record.SickName);
                return entry == null ? false : true;
            }
        }
        public int Update(DateTime Time, string SickName)
        {
            var record = new Record()
            {
                Year = Time.Year,
                Month = Time.Month,
                Day = Time.Day,
                SickName = SickName.Trim()
            };
            if (!IsExist(record))
            {
                return Add(record);
            }
            return 0;
        }
        /// <summary>
        /// 添加记录
        /// </summary>
        /// <param name="record"></param>
        /// <returns>返回ID</returns>
        public int Add(Record record)
        {
            using (var db = GetARDataContext())
            {
                db.Records.Add(record);
                db.SaveChanges();
                return record.ID;
            }
        }

        /// <summary>
        /// 获取所有疾病
        /// </summary>
        /// <returns></returns>
        public List<string> GetSickNames()
        {
            using (var db = GetARDataContext())
            {
                return db.Records.GroupBy(e => e.SickName).Select(g => g.Key).ToList();
            }
        }

        /// <summary>
        /// 根据疾病名称  返回年份
        /// </summary>
        /// <param name="SickName">疾病名称</param>
        /// <returns>返回当前疾病的年份记录</returns>
        public List<int> GetTime(string SickName)
        {
            using (var db = GetARDataContext())
            {
                return db.Records.Where(e => e.SickName == SickName).Select(e => e.Year).ToList();
            }
        }

        /// <summary>
        /// 获取月份记录
        /// </summary>
        /// <param name="SickName">疾病名称</param>
        /// <param name="Year">年份</param>
        /// <returns>月份列表</returns>
        public List<int> GetTime(string SickName, int Year)
        {
            using (var db = GetARDataContext())
            {
                return db.Records.Where(e => e.SickName == SickName && e.Year == Year).Select(e => e.Month).ToList();
            }
        }

        /// <summary>
        /// 获取日
        /// </summary>
        /// <param name="SickName">疾病名称</param>
        /// <param name="Year">年份</param>
        /// <param name="Month">月份</param>
        /// <returns>日列表</returns>

        public List<int> GetTime(string SickName, int Year, int Month)
        {
            using (var db = GetARDataContext())
            {
                return db.Records.Where(e => e.SickName == SickName && e.Year == Year && e.Month == Month).Select(e => e.Day).ToList();
            }
        }
    }
}
