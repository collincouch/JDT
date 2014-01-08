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

    public class RecipesController : Controller
    {
        private JDTContext context = new JDTContext();

        //
        // GET: /Meals/

        [MvcSiteMapNode(Title = "Recipes", ParentKey = "Diet", PreservedRouteParameters = "id")]
        public ViewResult Index(string id)
        {
           
           

            return View();
        }

        //
        // GET: /Meals/Details/5
        [MvcSiteMapNode(Title = "Details", ParentKey = "Recipe")]
        public ViewResult Details(string id, string id1)
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