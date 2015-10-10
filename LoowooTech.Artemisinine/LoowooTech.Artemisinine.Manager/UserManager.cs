using LoowooTech.Artemisinine.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using LoowooTech.Artemisinine.Common;

namespace LoowooTech.Artemisinine.Manager
{
    public class UserManager:ManagerBase
    {
        public bool Login(User user)
        {
            using (var db = GetARDataContext())
            {
                var entity = db.Users.FirstOrDefault(e => e.Name == user.Name&&e.Password==user.Password.MD5());
                if (entity != null)
                {
                    return 
                }
            }
            return false;
        }

        public void Update(User user)
        {
            using (var db = GetARDataContext())
            {
                var entity=db.Users.fir
            }
        }
    }
}
