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
using System.Web.Security;

namespace JDT.Controllers
{
    //[LocsAuthorizeAttribute]
    //[SessionExpireFilterAttribute]
    //[Authorize(Roles = "Administrator,ContentCreator")]
    public class PlansController : Controller
    {
        private JDTContext context = new JDTContext();

        //
        // GET: /Plans/
        [MvcSiteMapNode(Title = "Plans", ParentKey = "Dashboard")]
        public ViewResult Index()
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