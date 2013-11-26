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
    public class IngredientsController : Controller
    {
        private JDTContext context = new JDTContext();

        //
        // GET: /Ingredients/

        [MvcSiteMapNode(Title = "Ingredients", ParentKey = "Recipe", PreservedRouteParameters = "id")]
        public ViewResult Index(int id)
        {

            List<Ingredient> ingredients = context.Recipes.
                SingleOrDefault(m => m.RecipeId == id) == null ?
                new List<Ingredient>() { } : context.Recipes.Single(d => d.RecipeId == id).Ingredients.ToList();

            ViewBag.DietId = Convert.ToString(id);

            return View(ingredients);
        }

        //
        // GET: /Ingredients/Details/5

        [MvcSiteMapNode(Title = "Details", ParentKey = "Ingredient")]
        public ViewResult Details(int id, int id1)
        {
            ViewBag.MealId = id1;
            Ingredient ingredient = context.Ingredients.Single(x => x.IngredientId == id);
            return View(ingredient);
        }

        //
        // GET: /Ingredients/Create
        [MvcSiteMapNode(Title = "Add", ParentKey = "Ingredient")]
        public ActionResult Create(int id)
        {
            ViewBag.MealId = Convert.ToString(id);
            return View();
        } 

        //
        // POST: /Ingredients/Create

        [HttpPost]
        public ActionResult Create(Ingredient ingredient, int id)
        {
            if (ModelState.IsValid)
            {

                int mealId = id;
                Recipe meal = context.Recipes.Single(p => p.RecipeId == mealId);
                ingredient.Recipes.Add(meal);
                context.Ingredients.Add(ingredient);
                context.SaveChanges();
                return RedirectToAction("Index", new { id = id });
            }

            return View(ingredient);
        }
        
        //
        // GET: /Ingredients/Edit/5

        [MvcSiteMapNode(Title = "Edit", ParentKey = "Ingredient")]
        public ActionResult Edit(int id, int id1)
        {
            ViewBag.MealId = Convert.ToString(id1);
            Ingredient ingredient = context.Ingredients.Single(x => x.IngredientId == id);
            return View(ingredient);
        }

        //
        // POST: /Ingredients/Edit/5

        [HttpPost]
        public ActionResult Edit(Ingredient ingredient, int id)
        {
            if (ModelState.IsValid)
            {
                ingredient.DateModified = DateTime.Now;
                context.Entry(ingredient).State = EntityState.Modified;
                context.SaveChanges();
                return RedirectToAction("Index", new { id = id });

            }
            return View(ingredient);
        }

        //
        // GET: /Ingredients/Delete/5

        [MvcSiteMapNode(Title = "Delete", ParentKey = "Ingredient")]
        public ActionResult Delete(int id, int id1)
        {
            ViewBag.MealId = Convert.ToString(id1);
            Ingredient ingredient = context.Ingredients.Single(x => x.IngredientId == id);
            return View(ingredient);
        }

        //
        // POST: /Ingredients/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id, int id1)
        {
            Ingredient ingredient = context.Ingredients.Single(x => x.IngredientId == id);
            context.Ingredients.Remove(ingredient);
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