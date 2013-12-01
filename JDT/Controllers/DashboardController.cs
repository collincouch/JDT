using JDT.App_Code;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JDT.Controllers
{
   
    public class DashboardController : Controller
    {
        //
        // GET: /Dashboard/

        public ActionResult Index()
        {
            ViewBag.IsDashboardActive = "active";
            ViewBag.IsManagePlans = "";
            return View();
           

        }

    }
}
