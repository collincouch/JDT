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
    [LocsAuthorizeAttribute]
    [SessionExpireFilterAttribute]
    [Authorize(Roles = "Administrator,ContentCreator")]
    public class RecipesController : Controller
    {
        private JDTContext context = new JDTContext();

        //
        // GET: /Meals/

        [MvcSiteMapNode(Title = "Recipes", ParentKey = "Diet", PreservedRouteParameters = "id")]
        public ViewResult Index(int id)
        {
           
            List<Recipe> meals = context.Diets.
                SingleOrDefault(d => d.DietId == id) == null ?
                new List<Recipe>() { } : context.Diets.Single(d => d.DietId == id).Recipes.ToList();

            ViewBag.DietId = Convert.ToString(id);

            return View(meals);
        }

        //
        // GET: /Meals/Details/5
        [MvcSiteMapNode(Title = "Details", ParentKey = "Recipe")]
        public ViewResult Details(int id, int id1)
        {
            ViewBag.DietId = id1;
            Recipe meal = context.Recipes.Single(x => x.RecipeId == id);
            return View(meal);
        }

        //
        // GET: /Meals/Create
        [MvcSiteMapNode(Title = "Add", ParentKey = "Recipe")]
        public ActionResult Create(int id)
        {
            ViewBag.DietId = Convert.ToString(id);
            return View();
        } 

        //
        // POST: /Meals/Create

        [HttpPost]
        public ActionResult Create(Recipe meal, int id)
        {
            if (ModelState.IsValid)
            {

                int dietId = id;
                Diet diet = context.Diets.Single(p => p.DietId == dietId);
                meal.Diets.Add(diet);
                context.Recipes.Add(meal);
                context.SaveChanges();
                return RedirectToAction("Index", new { id = id });
            }

            return View(meal);
        }
        
        //
        // GET: /Meals/Edit/5
        [MvcSiteMapNode(Title = "Edit", ParentKey = "Recipe")]
        public ActionResult Edit(int id, int id1)
        {
            ViewBag.DietId = Convert.ToString(id1);
            Recipe meal = context.Recipes.Single(x => x.RecipeId == id);
            return View(meal);
        }

        //
        // POST: /Meals/Edit/5

        [HttpPost]
        public ActionResult Edit(Recipe meal, int id)
        {
            if (ModelState.IsValid)
            {
                meal.DateModified = DateTime.Now;
                context.Entry(meal).State = EntityState.Modified;
                context.SaveChanges();
                return RedirectToAction("Index", new { id = id });

            }
            return View(meal);
        }

        //
        // GET: /Meals/Delete/5
        [MvcSiteMapNode(Title = "Delete", ParentKey = "Recipe")]
        public ActionResult Delete(int id, int id1)
        {
            ViewBag.DietId = Convert.ToString(id1);
            Recipe meal = context.Recipes.Single(x => x.RecipeId == id);
            return View(meal);
        }

        //
        // POST: /Meals/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id, int id1)
        {
            Recipe meal = context.Recipes.Single(x => x.RecipeId == id);
            context.Recipes.Remove(meal);
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