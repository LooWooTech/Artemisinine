using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LoowooTech.Artemisinine.Manager
{
    public class ManagerBase
    {
        protected ManagerCore Core = new ManagerCore();
        protected ARDbContext GetARDataContext()
        {
            var db = new ARDbContext();
            db.Database.Connection.Open();
            return db;
        }
    }
}
