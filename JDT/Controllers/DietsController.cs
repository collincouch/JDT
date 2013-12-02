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

        //
        // GET: /Diets/Details/5

         [MvcSiteMapNode(Title = "Details", ParentKey = "Diet")]
        public ViewResult Details(string id, string id1)
        {
            return View();
        }

        //
        // GET: /Diets/Create

         [MvcSiteMapNode(Title = "Add", ParentKey = "Diet")]
         public ActionResult Create(string id)
        {
           
            return View();
        } 

        //
        // GET: /Diets/Edit/5

        [MvcSiteMapNode(Title = "Edit", ParentKey = "Diet")]
        public ActionResult Edit(string id, string id1)
        {
            return View();
        }

        

        //
        // GET: /Diets/Delete/5

        [MvcSiteMapNode(Title = "Delete", ParentKey = "Diet")]
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