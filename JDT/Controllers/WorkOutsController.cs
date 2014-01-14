using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using JDT.Models;
using WebMatrix.WebData;
using MvcSiteMapProvider;
using JDT.App_Code;

namespace JDT.Controllers
{

    //[LocsAuthorizeAttribute]
    //[SessionExpireFilterAttribute]
    //[Authorize(Roles = "Administrator,ContentCreator")]
    public class WorkOutsController : Controller
    {
        private JDTContext context = new JDTContext();

        //
        // GET: /WorkOuts/

        [MvcSiteMapNode(Title = "Workouts", ParentKey = "Plan", PreservedRouteParameters = "id")]
        public ViewResult Index(string id)
        {

            return View();

        }


        public ViewResult Search()
        {
            return View();
        }

       

        protected override void Dispose(bool disposing)
        {
            if (disposing) {
                context.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}