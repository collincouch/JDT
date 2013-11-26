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
    [LocsAuthorizeAttribute]
    [SessionExpireFilterAttribute]
    [Authorize(Roles = "Administrator,ContentCreator")]
    public class DietsController : Controller
    {
        private JDTContext context = new JDTContext();

        //
        // GET: /Diets/

        [MvcSiteMapNode(Title = "Diet", ParentKey = "Plan", PreservedRouteParameters = "id")]
        public ViewResult Index(int id)
        {

            int uid = WebSecurity.CurrentUserId;
            //return View(context.Diets.Include(diet => diet.Plans).Include(diet => diet.Meals).
            //ToList());
            List<Diet> diets = context.Plans.
                SingleOrDefault(p => p.PlanId == id && p.CreatorId == uid) == null ?
                new List<Diet>() { } : context.Plans.Single(p => p.PlanId == id &&
                    p.CreatorId == uid).Diets.ToList();

            ViewBag.PlanId = Convert.ToString(id);

            return View(diets);

        }

        //
        // GET: /Diets/Details/5

         [MvcSiteMapNode(Title = "Details", ParentKey = "Diet")]
        public ViewResult Details(int id, int id1)
        {
            ViewBag.PlanId = id1;
            Diet diet = context.Diets.Single(x => x.DietId == id);
            return View(diet);
        }

        //
        // GET: /Diets/Create

         [MvcSiteMapNode(Title = "Add", ParentKey = "Diet")]
         public ActionResult Create(int id)
        {
            ViewBag.PlanId = Convert.ToString(id);
            return View();
        } 

        //
        // POST: /Diets/Create

        [HttpPost]
        public ActionResult Create(Diet diet, int id)
        {
            if (ModelState.IsValid)
            {

                int planId = id;
                Plan plan = context.Plans.Single(p => p.PlanId == planId);
                diet.Plans.Add(plan);
                context.Diets.Add(diet);
                context.SaveChanges();
                return RedirectToAction("Index", new { id = id });
            }

            return View(diet);
        }
        
        //
        // GET: /Diets/Edit/5

        [MvcSiteMapNode(Title = "Edit", ParentKey = "Diet")]
        public ActionResult Edit(int id, int id1)
        {
            ViewBag.PlanId = Convert.ToString(id1);
            Diet diet = context.Diets.Single(x => x.DietId == id);
            return View(diet);
        }

        //
        // POST: /Diets/Edit/5

        [HttpPost]
        public ActionResult Edit(Diet diet, int id)
        {

            if (ModelState.IsValid)
            {
                diet.DateModified = DateTime.Now;
                context.Entry(diet).State = EntityState.Modified;
                context.SaveChanges();
                return RedirectToAction("Index", new { id = id });

            }
            return View(diet);
        }

        //
        // GET: /Diets/Delete/5

        [MvcSiteMapNode(Title = "Delete", ParentKey = "Diet")]
        public ActionResult Delete(int id, int id1)
        {
            ViewBag.PlanId = Convert.ToString(id1);
            Diet diet = context.Diets.Single(x => x.DietId == id);
            return View(diet);
        }

        //
        // POST: /Diets/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id, int id1)
        {
            Diet diet = context.Diets.Single(x => x.DietId == id);
            context.Diets.Remove(diet);
            context.SaveChanges();
            return RedirectToAction("Index", new { id = id1 });
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