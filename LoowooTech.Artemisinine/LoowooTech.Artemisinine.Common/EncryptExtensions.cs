using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LoowooTech.Artemisinine.Common
{
    public static class EncryptExtensions
    {
        private static System.Security.Cryptography.MD5 _md5Hash = System.Security.Cryptography.MD5.Create();

        public static string MD5(this string str)
        {
            var data = _md5Hash.ComputeHash(System.Text.Encoding.UTF8.GetBytes(str));
            return data.ToHexString();
        }
        public static string ToHexString(this byte[] bytes)
        {
            var sb = new StringBuilder();
            foreach (var b in bytes)
            {
                sb.Append(b.ToString("x2"));
            }
            return sb.ToString();
        }
    }
}
