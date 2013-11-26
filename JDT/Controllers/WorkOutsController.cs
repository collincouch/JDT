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
    public class WorkOutsController : Controller
    {
        private JDTContext context = new JDTContext();

        //
        // GET: /WorkOuts/

        [MvcSiteMapNode(Title = "Workouts", ParentKey = "Plan")]
        public ViewResult Index(int id)
        {
            int uid = WebSecurity.CurrentUserId;
            ViewBag.PlanId = Convert.ToString(id);

            List<WorkOut> workOuts = context.Plans.SingleOrDefault(p => p.PlanId == id && p.CreatorId == uid) == null ?
                new List<WorkOut>() { } : context.Plans.SingleOrDefault(p => p.PlanId == id && p.CreatorId == uid).
                WorkOuts.ToList();

            return View(workOuts);

        }

        //
        // GET: /WorkOuts/Details/5

        [MvcSiteMapNode(Title = "Details", ParentKey = "WorkOut")]
        public ViewResult Details(int id, int id1)
        {
            ViewBag.PlanId = id1;
            WorkOut workout = context.WorkOuts.Single(x => x.WorkOutId == id);
            return View(workout);
        }

        //
        // GET: /WorkOuts/Create

        [MvcSiteMapNode(Title = "Add", ParentKey = "WorkOut")]
        public ActionResult Create(int id)
        {
            ViewBag.PlanId = Convert.ToString(id);
            return View();
            
        } 

        //
        // POST: /WorkOuts/Create

        [HttpPost]
        public ActionResult Create(WorkOut workout,int id)
        {
            if (ModelState.IsValid)
            {
                
                int planId = id;
                Plan plan = context.Plans.Single(p => p.PlanId == planId);
                workout.Plans.Add(plan);
                context.WorkOuts.Add(workout);
                context.SaveChanges();
                return RedirectToAction("Index", new { id=id});  
            }

            return View(workout);
        }
        
        //
        // GET: /WorkOuts/Edit/5

        [MvcSiteMapNode(Title = "Edit", ParentKey = "WorkOut")]
        public ActionResult Edit(int id, int id1)
        {
            ViewBag.PlanId = Convert.ToString(id1);
            WorkOut workout = context.WorkOuts.Single(x => x.WorkOutId == id);
            return View(workout);
        }

        //
        // POST: /WorkOuts/Edit/5

        [HttpPost]
        public ActionResult Edit(WorkOut workout,int id)
        {
           
            if (ModelState.IsValid)
            {
                workout.DateModified = DateTime.Now;
                context.Entry(workout).State = EntityState.Modified;
                context.SaveChanges();
                return RedirectToAction("Index", new { id = id });
               
            }
            return View(workout);
        }

        //
        // GET: /WorkOuts/Delete/5

        [MvcSiteMapNode(Title = "Delete", ParentKey = "WorkOut")]
        public ActionResult Delete(int id, int id1)
        {
            ViewBag.PlanId = Convert.ToString(id1);
            WorkOut workout = context.WorkOuts.Single(x => x.WorkOutId == id);
            return View(workout);
        }

        //
        // POST: /WorkOuts/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id,int id1)
        {
            WorkOut workout = context.WorkOuts.Single(x => x.WorkOutId == id);
            context.WorkOuts.Remove(workout);
            context.SaveChanges();
            return RedirectToAction("Index",new {id=id1});
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