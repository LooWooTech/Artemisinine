using LoowooTech.Artemisinine.Common;
using LoowooTech.Artemisinine.Models;
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



        public ActionResult GetDays(int Year, int Month)
        {
            var dict = MapInfoManager.GetDays(Year, Month);
            return Content(MapInfoManager.HtmlResult(dict));
        }

        public ActionResult Query(string JGID)
        {
            var list = GISManager.GetValues(JGID);

            ViewBag.List = list;
            return View();
        }

        public ActionResult Trend()
        {
            ViewBag.List = GISManager.GetXZC();
            return View();
        }

        public ActionResult GetValues(string JGID)
        {
            var list = GISManager.GetValues(JGID);
            return Content(list.ToTableHtml());
        }

        public ActionResult GetData(Sick sickType)
        {
            var list = MapInfoManager.GetMapInfo(sickType.ToString());
            return Content(list.ToJson());
        }


        public ActionResult Chart(string type, string xzc, Sick? sickType, DateTime? beginTime, DateTime? endTime)
        {
            object data = null;
            try
            {
                switch (type)
                {
                    case "xzc":
                        data = GISManager.GetComparison(beginTime.Value, endTime.Value, sickType.Value);
                        break;
                    case "time":
                        data = GISManager.GetTrend(xzc, sickType.Value);
                        break;
                    case "sick":
                        data = GISManager.GetComparison(beginTime.Value, xzc);
                        break;
                }
            }
            catch { }
            ViewBag.Data = data;
            ViewBag.Type = type;
            ViewBag.XZC = xzc;
            if (sickType == null)
            {
                ViewBag.SickType = "";
            }
            else
            {
                ViewBag.SickType = sickType.Value;
            }
            if (beginTime == null)
            {
                ViewBag.StartTime = null;
            }
            else
            {
                ViewBag.StartTime = beginTime.Value;
            }
            if (endTime == null)
            {
                ViewBag.EndTime = null;
            }
            else
            {
                ViewBag.EndTime = endTime.Value;
            }
            return View();
        }
    }
}
