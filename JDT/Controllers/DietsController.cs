using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using JDT.Models;
using WebMatrix.WebData;
using JDT.App_Code;
using MvcSiteMapProvider;

namespace JDT.Controllers
{
    
    public class DietsController : Controller
    {
        private JDTContext context = new JDTContext();

        //
        // GET: /Diets/

        [MvcSiteMapNode(Title = "Diet", ParentKey = "Plan", PreservedRouteParameters = "id")]
        public ViewResult Index(string id)
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