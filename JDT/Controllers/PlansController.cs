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
    [LocsAuthorizeAttribute]
    [SessionExpireFilterAttribute]
    [Authorize(Roles = "Administrator,ContentCreator")]
    public class PlansController : Controller
    {
        private JDTContext context = new JDTContext();

        //
        // GET: /Plans/
        [MvcSiteMapNode(Title = "Plans", ParentKey = "Dashboard")]
        public ViewResult Index()
        {
            ViewBag.IsDashboardActive = "";
            ViewBag.IsManagePlans = "active";
            int uid = WebSecurity.CurrentUserId;
            return View(context.Plans.Where(plan => plan.CreatorId == uid).
                Include(plan => plan.WorkOuts).Include(plan=>plan.Diets).ToList());

        }

        //
        // GET: /Plans/Details/5

        [MvcSiteMapNode(Title = "Details", ParentKey = "Plan")]
        public ViewResult Details(int id)
        {
            Plan plan = context.Plans.Single(x => x.PlanId == id);
            return View(plan);
        }

        //
        // GET: /Plans/Create
        [MvcSiteMapNode(Title = "Add", ParentKey = "Plan")]
        public ActionResult Create()
        {
            return View();
        } 

        //
        // POST: /Plans/Create

        [HttpPost]
        public ActionResult Create(Plan plan)
        {
            if (ModelState.IsValid)
            {
                plan.CreatorId = WebSecurity.CurrentUserId;
                context.Plans.Add(plan);
                context.SaveChanges();
                return RedirectToAction("Index");  
            }

            return View(plan);
        }
        
        //
        // GET: /Plans/Edit/5
        [MvcSiteMapNode(Title = "Edit", ParentKey = "Plan")]
        public ActionResult Edit(int id)
        {
            Plan plan = context.Plans.Single(x => x.PlanId == id);
            return View(plan);
        }

        //
        // POST: /Plans/Edit/5

        [HttpPost]
        public ActionResult Edit(Plan plan)
        {
            if (ModelState.IsValid)
            {

                plan.CreatorId = WebSecurity.CurrentUserId;
                plan.DateModified = DateTime.Now;
                context.Entry(plan).State = EntityState.Modified;
                context.SaveChanges();
                return RedirectToAction("Index");
            }
           
            return View(plan);
        }

        //
        // GET: /Plans/Delete/5

        [MvcSiteMapNode(Title = "Delete", ParentKey = "Plan")]
        public ActionResult Delete(int id)
        {
            Plan plan = context.Plans.Single(x => x.PlanId == id);
            return View(plan);
        }

        //
        // POST: /Plans/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {
            Plan plan = context.Plans.Single(x => x.PlanId == id);
            context.Plans.Remove(plan);
            context.SaveChanges();
            return RedirectToAction("Index");
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