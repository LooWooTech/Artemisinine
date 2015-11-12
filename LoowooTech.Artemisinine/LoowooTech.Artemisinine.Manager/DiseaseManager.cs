using LoowooTech.Artemisinine.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LoowooTech.Artemisinine.Manager
{
    public class DiseaseManager:ManagerBase
    {
        public int Add(Disease Disease)
        {
            using (var db = GetARDataContext())
            {
                db.Diseases.Add(Disease);
                db.SaveChanges();
                return Disease.ID;
            }
        }

        /// <summary>
        /// 根据疾病名称获取相关疾病历史数据
        /// </summary>
        /// <param name="Thing">疾病名称</param>
        /// <returns></returns>
        public List<Disease> Get(string Thing)
        {
            using (var db = GetARDataContext())
            {
                return db.Diseases.Where(e => e.Thing == Thing).ToList();
            }
        }
        /// <summary>
        /// 获取所有疾病列表
        /// </summary>
        /// <returns></returns>
        public List<string> GetThings()
        {
            using (var db = GetARDataContext())
            {
                return db.Diseases.GroupBy(e => e.Thing).Select(g => g.Key).ToList();
            }
        }

    }
}
