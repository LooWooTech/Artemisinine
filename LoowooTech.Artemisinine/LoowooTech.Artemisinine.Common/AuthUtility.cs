using LoowooTech.Artemisinine.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Security;

namespace LoowooTech.Artemisinine.Common
{
    public static class AuthUtility
    {
        private const string _cookieName = ".Artemisinine_user";

        public static void SaveAuth(this HttpContextBase context, User user)
        {
            var ticket = new FormsAuthenticationTicket(user.ID + "|" + user.Role+"|"+user.Name, true, 60);
            var cookieValue = FormsAuthentication.Encrypt(ticket);
            var cookie = new HttpCookie(_cookieName, cookieValue);
            context.Response.Cookies.Remove(_cookieName);
            context.Response.Cookies.Add(cookie);
        }

        public static UserIdentity GetCurrentUser(this HttpContextBase context)
        {
            var cookie = context.Request.Cookies.Get(_cookieName);
            if (cookie != null)
            {
                if (string.IsNullOrEmpty(cookie.Value))
                {
                    return UserIdentity.Guest;
                }

                var ticket = FormsAuthentication.Decrypt(cookie.Value);
                if (ticket != null && !string.IsNullOrEmpty(ticket.Name))
                {
                    var values = ticket.Name.Split('|');
                    if (values.Length == 3)
                    {
                        var userID = 0;
                        if (int.TryParse(values[0], out userID))
                        {
                            var role = UserRole.Guest;
                            if (Enum.TryParse<UserRole>(values[1], out role))
                            {
                                return new UserIdentity
                                {
                                    UserID = userID,
                                    Role = role,
                                    UserName = values[2]
                                };
                            }
                        }
                    }
                }
            }
            return UserIdentity.Guest;
        }

        public static void ClearAuth(this HttpContextBase context)
        {
            var cookie = context.Request.Cookies.Get(_cookieName);
            if (cookie == null) return;
            cookie.Value = null;
            cookie.Expires = DateTime.Now.AddDays(-1);
            context.Response.SetCookie(cookie);
        }
    }
}
