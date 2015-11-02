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



        public ActionResult GetDays(int Year,int Month)
        {
            var dict = MapInfoManager.GetDays(Year, Month);
            return Content(MapInfoManager.HtmlResult(dict));
        }

        public ActionResult Query(string JGID)
        {
            ESRI.ArcGIS.RuntimeManager.Bind(ESRI.ArcGIS.ProductCode.EngineOrDesktop);
            LicenseManager.StartUp();
            var list = GISManager.GetValues(JGID);
            LicenseManager.ShutDown();
            ViewBag.List = list;
            return View();
        }

        public ActionResult Chart(string JGID)
        {
            ViewBag.JGID = JGID;
            return View();
        }
        public string JavaScriptContext(string JGID)
        {
            ESRI.ArcGIS.RuntimeManager.Bind(ESRI.ArcGIS.ProductCode.EngineOrDesktop);
            LicenseManager.StartUp();
            var list = GISManager.GetValues(JGID);
            LicenseManager.ShutDown();
            return ChartHelper.GetJavaScriptContext(list, Server.MapPath("~/Maps/Chart.js"));
        }

        public ActionResult GetValues(string JGID)
        {
            ESRI.ArcGIS.RuntimeManager.Bind(ESRI.ArcGIS.ProductCode.EngineOrDesktop);
            LicenseManager.StartUp();
            var list = GISManager.GetValues(JGID);
            LicenseManager.ShutDown();
            return Content(list.ToTableHtml());  
        }

    }
}
