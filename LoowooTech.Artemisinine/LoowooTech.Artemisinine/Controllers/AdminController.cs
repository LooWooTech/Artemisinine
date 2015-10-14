using LoowooTech.Artemisinine.Models;
using LoowooTech.Artemisinine.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LoowooTech.Artemisinine.Controllers
{
    [UserAuthorize]
    public class AdminController : ControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Users()
        {
            ViewBag.List = Core.UserManager.GetList();
            return View();
        }

        public ActionResult AddUser(string Name, string Password,UserRole Role)
        {
            Core.UserManager.Add(new User()
            {
                Name = Name,
                Password = Password.MD5(),
                Role=Role
            });
            return View();
        }

        public ActionResult Upload()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Upload(string Thing,string Year)
        {
            var file = UploadHelper.GetPostedFile(HttpContext);
            if (!UploadHelper.IsSupport(file.FileName))
            {
                throw new ArgumentException("您上传的疾病数据文件，目前平台不支持！");
            }
            var filePath = UploadHelper.Upload(file);
            var fileID = Core.FileManager.Add(new UploadFile()
            {
                FileName = file.FileName,
                SavePath = filePath,
                Thing = Thing,
                Year = Year
            });
            return RedirectToAction("UploadList");
        }

        public ActionResult UploadList()
        {
            ViewBag.List = Core.FileManager.GetList();
            return View();
        }

        

    }
}
