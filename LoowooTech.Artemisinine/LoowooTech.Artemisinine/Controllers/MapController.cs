using LoowooTech.Artemisinine.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LoowooTech.Artemisinine.Controllers
{
    public class MapController : Controller
    {
        //
        // GET: /Map/

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Dynamic()
        {
            ViewBag.List = MapInfoManager.GetYears();
            ViewBag.Indexs = MapInfoManager.GetIndexs();
            return View();
        }

        public ActionResult GetMonths(int Year)
        {
            var list = MapInfoManager.GetMonths(Year);
            return Content(MapInfoManager.HtmlResult(list));
        }



        public ActionResult GetDays(int Year,int Month)
        {
            var dict = MapInfoManager.GetDays(Year, Month);
            return Content(MapInfoManager.HtmlResult(dict));
        }

    }
}
