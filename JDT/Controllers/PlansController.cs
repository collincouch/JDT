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

        //
        // GET: /Plans/Details/5

        [MvcSiteMapNode(Title = "Details", ParentKey = "Plan")]
        public ViewResult Details(string id)
        {
            //Plan plan = context.Plans.Single(x => x.PlanId == id);
            //return View(plan);

            return View();
        }

        //
        // GET: /Plans/Create
        [MvcSiteMapNode(Title = "Add", ParentKey = "Plan")]
        public ActionResult Create()
        {
            //string email = WebSecurity.CurrentUserName;
            //UserProfile usr = context.UserProfile.SingleOrDefault(up => up.Email == email);
            //ViewBag.UserName = usr.UserName;
            return View();
        } 

       
        
        //
        // GET: /Plans/Edit/5
        [MvcSiteMapNode(Title = "Edit", ParentKey = "Plan")]
        public ActionResult Edit(string id)
        {
            //Plan plan = context.Plans.Single(x => x.PlanId == id);
            //return View(plan);

            return View();
            
        }

       
        //
        // GET: /Plans/Delete/5

        [MvcSiteMapNode(Title = "Delete", ParentKey = "Plan")]
        public ActionResult Delete(string id)
        {
            //Plan plan = context.Plans.Single(x => x.PlanId == id);
            //return View(plan);
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