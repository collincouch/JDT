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

        //
        // GET: /Ingredients/Details/5

        [MvcSiteMapNode(Title = "Details", ParentKey = "Ingredient")]
        public ViewResult Details(string id, string id1, string id2, string id3)
        {
           
            return View();
        }

        //
        // GET: /Ingredients/Create
        [MvcSiteMapNode(Title = "Add", ParentKey = "Ingredient")]
        public ActionResult Create(string id, string id1, string id2)
        {
            
            return View();
        } 

       
        
        //
        // GET: /Ingredients/Edit/5

        [MvcSiteMapNode(Title = "Edit", ParentKey = "Ingredient")]
        public ActionResult Edit(string id, string id1, string id2, string id3 )
        {
           
            return View();
        }

       

        //
        // GET: /Ingredients/Delete/5

        [MvcSiteMapNode(Title = "Delete", ParentKey = "Ingredient")]
        public ActionResult Delete(string id, string id1, string id2, string id3)
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