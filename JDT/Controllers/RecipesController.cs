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

        //
        // GET: /Meals/Create
        [MvcSiteMapNode(Title = "Add", ParentKey = "Recipe")]
        public ActionResult Create(string id)
        {
            return View();
        } 

       
        
        //
        // GET: /Meals/Edit/5
        [MvcSiteMapNode(Title = "Edit", ParentKey = "Recipe")]
        public ActionResult Edit(string id, string id1, string id2)
        {
            
            return View();
        }

       

        //
        // GET: /Meals/Delete/5
        [MvcSiteMapNode(Title = "Delete", ParentKey = "Recipe")]
        public ActionResult Delete(string id, string id1)
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