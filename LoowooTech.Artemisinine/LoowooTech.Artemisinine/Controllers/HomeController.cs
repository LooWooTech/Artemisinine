using LoowooTech.Artemisinine.Models;
using LoowooTech.Artemisinine.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LoowooTech.Artemisinine.Controllers
{
    public class HomeController : ControllerBase
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {
            if (Identity.IsAuthenticated)
            {
                switch (Identity.Role)
                {
                    case UserRole.Admin:
                        return Redirect("/Admin");
                    default:
                        return RedirectToAction("Login");
                }
            }
            return RedirectToAction("Login");
        }

        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Login(string Name,string Password)
        {
            if (string.IsNullOrEmpty(Name) || string.IsNullOrEmpty(Password))
            {
                throw new ArgumentException("用户名或者密码为空!");
            }
            var user = Core.UserManager.Search(Name, Password.MD5());
            if (user == null)
            {
                throw new ArgumentException("未找到相关用户信息!");
            }
            Core.UserManager.Update(user, Request.UserHostAddress);
            HttpContext.SaveAuth(user);
            return RedirectToAction("Index");
        }

        public ActionResult Logout()
        {
            HttpContext.ClearAuth();
            return RedirectToAction("Login");
        }
    }
}
