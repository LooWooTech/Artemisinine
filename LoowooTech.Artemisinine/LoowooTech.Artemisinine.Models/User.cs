using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;

namespace LoowooTech.Artemisinine.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        [DatabaseGenerated(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        [Column("Role",TypeName="INT")]
        public UserRole Role { get; set; }
        public DateTime LastLoginTime { get; set; }
        public string LastLoginIP { get; set; }
    }

    public enum UserRole
    {
        Guest,
        Admin
    }
}
