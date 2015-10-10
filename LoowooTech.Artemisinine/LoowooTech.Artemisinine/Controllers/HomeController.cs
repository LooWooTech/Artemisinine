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
        public ActionResult Login(User user)
        {
            if (string.IsNullOrEmpty(user.Name) || string.IsNullOrEmpty(user.Password))
            {
                throw new ArgumentException("用户名为空或者密码为空！");
            }
            if (Core.UserManager.Login(user))
            {
                HttpContext.SaveAuth(user);
                return View();
            }
            else
            {
                throw new ArgumentException("登录失败！用户名或者密码不正确");
            }
        }

    }
}
