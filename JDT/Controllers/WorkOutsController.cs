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


        public ViewResult Search(string id)
        {
            return View();
        }

        //
        // GET: /WorkOuts/Details/5

        [MvcSiteMapNode(Title = "Details", ParentKey = "WorkOut")]
        public ViewResult Details(string id, string id1)
        {
            
            return View();
        }

        //
        // GET: /WorkOuts/Create

        [MvcSiteMapNode(Title = "Add", ParentKey = "WorkOut")]
        public ActionResult Create()
        {
           
            return View();
            
        } 

       
        
        //
        // GET: /WorkOuts/Edit/5

        [MvcSiteMapNode(Title = "Edit", ParentKey = "WorkOut")]
        public ActionResult Edit(string id, string id1, string id2)
        {
            //ViewBag.PlanId = Convert.ToString(id1);
            //WorkOut workout = context.WorkOuts.Single(x => x.WorkOutId == id);
            return View();
        }

       

        //
        // GET: /WorkOuts/Delete/5

        [MvcSiteMapNode(Title = "Delete", ParentKey = "WorkOut")]
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