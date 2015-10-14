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
        public User Search(string Name,string Password)
        {
            using (var db = GetARDataContext())
            {
                return db.Users.FirstOrDefault(e => e.Name == Name && e.Password == Password);
            }
        }

        public void Update(User user,string IP=null)
        {
            using (var db = GetARDataContext())
            {
                var entity = db.Users.Find(user.ID);
                entity.LastLoginTime = DateTime.Now;
                if (!string.IsNullOrEmpty(IP))
                {
                    entity.LastLoginIP = IP;
                }
                db.SaveChanges();
            } 
        }

        public int Add(User user)
        {
            using (var db = GetARDataContext())
            {
                db.Users.Add(user);
                db.SaveChanges();
                return user.ID;
            }
        }

        public List<User> GetList()
        {
            using (var db = GetARDataContext())
            {
                return db.Users.ToList();
            }
        }
    }
}
