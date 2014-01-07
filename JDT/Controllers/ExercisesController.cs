using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using JDT.Models;
using MvcSiteMapProvider;
using WebMatrix.WebData;

namespace JDT.Controllers
{   
    public class ExercisesController : Controller
    {
        private JDTContext context = new JDTContext();

        //
        // GET: /JdtTasks/
        [MvcSiteMapNode(Title = "Exercises", ParentKey = "WorkOut", PreservedRouteParameters = "id")]
        public ViewResult Index(string id)
        {
           
            return View();

        }

        

        //
        // GET: /JdtTasks/Details/5
        [MvcSiteMapNode(Title = "Details", ParentKey = "Exercise")]
        public ViewResult Details(string id, string id1, string id2)
        {
            return View();
        }

        //
        // GET: /JdtTasks/Create
        [MvcSiteMapNode(Title = "Add", ParentKey = "Exercise")]
        public ActionResult Create()
        {
            
            return View();
        } 

          
        //
        // GET: /JdtTasks/Edit/5
        [MvcSiteMapNode(Title = "Edit", ParentKey = "Exercise")]
        public ActionResult Edit(string id, string id1, string id2)
        {
            return View();
        }


        //
        // GET: /JdtTasks/Delete/5

         [MvcSiteMapNode(Title = "Delete", ParentKey = "Exercise")]
        public ActionResult Delete(string id, string id1, string id2)
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