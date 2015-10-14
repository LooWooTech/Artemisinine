using LoowooTech.Artemisinine.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;

namespace LoowooTech.Artemisinine.Manager
{
    public class ARDbContext:DbContext
    {
        public ARDbContext() : base("name=AR") { }
        public ARDbContext(string connectionString) : base(connectionString) { }
        public DbSet<User> Users { get; set; }
        public DbSet<UploadFile> Files { get; set; }
    }
}
