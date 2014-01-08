using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using JDT.Models;
using JDT.App_Code;
using MvcSiteMapProvider;

namespace JDT.Controllers
{

    public class IngredientsController : Controller
    {
        private JDTContext context = new JDTContext();

        //
        // GET: /Ingredients/

        [MvcSiteMapNode(Title = "Ingredients", ParentKey = "Recipe", PreservedRouteParameters = "id")]
        public ViewResult Index(string id, string id1, string id2)
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