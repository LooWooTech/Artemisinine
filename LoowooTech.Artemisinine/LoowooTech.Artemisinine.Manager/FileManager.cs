using LoowooTech.Artemisinine.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LoowooTech.Artemisinine.Manager
{
    public class FileManager:ManagerBase
    {
        public int Add(UploadFile file)
        {
            using (var db = GetARDataContext())
            {
                db.Files.Add(file);
                db.SaveChanges();
                return file.ID;
            }
        }

        public List<UploadFile> GetList()
        {
            using (var db = GetARDataContext())
            {
                return db.Files.ToList();
            }
        }
    }
}
