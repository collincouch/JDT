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

        


        

        protected override void Dispose(bool disposing)
        {
            if (disposing) {
                context.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}