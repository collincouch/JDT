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
        [MvcSiteMapNode(Title = "Exercise", ParentKey = "WorkOut", PreservedRouteParameters = "id")]
        public ViewResult Index(int id)
        {
            int uid = WebSecurity.CurrentUserId;
            ViewBag.WorkOutId = Convert.ToString(id);

            List<Exercise> exercises = context.WorkOuts.SingleOrDefault(wo => wo.WorkOutId == id) == null ?
                new List<Exercise>() { } : context.WorkOuts.SingleOrDefault(wo => wo.WorkOutId == id).Exercises.ToList();

            return View(exercises);

        }

        //
        // GET: /JdtTasks/Details/5
        [MvcSiteMapNode(Title = "Details", ParentKey = "Exercise")]
        public ViewResult Details(int id, int id1)
        {
            ViewBag.WorkOutId = id1;
            Exercise exercise = context.JdtTasks.Single(x => x.ExerciseId == id);
            return View(exercise);
        }

        //
        // GET: /JdtTasks/Create
        [MvcSiteMapNode(Title = "Add", ParentKey = "Exercise")]
        public ActionResult Create(int id)
        {
            ViewBag.WorkOutId = id;
            return View();
        } 

        //
        // POST: /JdtTasks/Create

        [HttpPost]
        public ActionResult Create(Exercise jdttask, int id)
        {
            if (ModelState.IsValid)
            {

                int workOutId = id;
                WorkOut workOut = context.WorkOuts.Single(p => p.WorkOutId == workOutId);
                workOut.Exercises.Add(jdttask);
                context.JdtTasks.Add(jdttask);
                context.SaveChanges();
                return RedirectToAction("Index", new { id = id });
            }

            return View(jdttask);
        }
        
        //
        // GET: /JdtTasks/Edit/5
        [MvcSiteMapNode(Title = "Edit", ParentKey = "Exercise")]
        public ActionResult Edit(int id, int id1)
        {
            ViewBag.WorkOutId = Convert.ToString(id1);
            Exercise exercise = context.JdtTasks.Single(x => x.ExerciseId == id);
            return View(exercise);
        }

        //
        // POST: /JdtTasks/Edit/5

        [HttpPost]
        public ActionResult Edit(Exercise jdttask, int id)
        {
            if (ModelState.IsValid)
            {
                jdttask.DateModified = DateTime.Now;
                context.Entry(jdttask).State = EntityState.Modified;
                context.SaveChanges();
                return RedirectToAction("Index", new { id = id });

            }
            return View(jdttask);
        }

        //
        // GET: /JdtTasks/Delete/5

         [MvcSiteMapNode(Title = "Delete", ParentKey = "Exercise")]
        public ActionResult Delete(int id, int id1)
        {
            ViewBag.WorkOutId = Convert.ToString(id1);
            Exercise exercise = context.JdtTasks.Single(x => x.ExerciseId == id);
            return View(exercise);
        }

        //
        // POST: /JdtTasks/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id, int id1)
        {
            Exercise exercise = context.JdtTasks.Single(x => x.ExerciseId == id);
            context.JdtTasks.Remove(exercise);
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