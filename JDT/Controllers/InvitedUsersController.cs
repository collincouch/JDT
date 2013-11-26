using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using JDT.Models;
using JDT.App_Code;
using WebMatrix.WebData;
using MvcSiteMapProvider;

namespace JDT.Controllers
{
    [LocsAuthorizeAttribute]
    [SessionExpireFilterAttribute]
    [Authorize(Roles = "Administrator,ContentCreator")]
    public class InvitedUsersController : Controller
    {
        private JDTContext context = new JDTContext();

        //
        // GET: /PreConsumers/

        [MvcSiteMapNode(Title = "Friends", ParentKey = "Dashboard")]
        public ViewResult Index()
        {
           
            int uid = WebSecurity.CurrentUserId;
            return View(context.InvitedUsers.Where(pc => pc.InvitedById == uid).ToList());

        }

        //
        // GET: /PreConsumers/Details/5

        [MvcSiteMapNode(Title = "Details", ParentKey = "InvitedUser")]
        public ViewResult Details(int id)
        {
            InvitedUser pc = context.InvitedUsers.Single(x => x.InvitedUserId == id);
            return View();
        }

        //
        // GET: /Plans/Create
        [MvcSiteMapNode(Title = "Add", ParentKey = "InvitedUser")]
        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /Plans/Create

        [HttpPost]
        public ActionResult Create(InvitedUser client)
        {
            if (ModelState.IsValid)
            {
                client.InvitedById = WebSecurity.CurrentUserId;
                context.InvitedUsers.Add(client);
                context.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(client);
        }

        //
        // GET: /Plans/Edit/5
        [MvcSiteMapNode(Title = "Edit", ParentKey = "InvitedUser")]
        public ActionResult Edit(int id)
        {
            InvitedUser client = context.InvitedUsers.Single(x => x.InvitedUserId == id);
            return View(client);
        }

        //
        // POST: /Plans/Edit/5

        [HttpPost]
        public ActionResult Edit(InvitedUser client)
        {
            if (ModelState.IsValid)
            {

                client.InvitedById = WebSecurity.CurrentUserId;
                client.DateModified = DateTime.Now;
                context.Entry(client).State = EntityState.Modified;
                context.SaveChanges();
                return RedirectToAction("Index");
            }
           
            return View(client);
        }

        //
        // GET: /Plans/Delete/5

        [MvcSiteMapNode(Title = "Delete", ParentKey = "InvitedUser")]
        public ActionResult Delete(int id)
        {
            InvitedUser client = context.InvitedUsers.Single(x => x.InvitedUserId == id);
            return View(client);
        }

        //
        // POST: /Plans/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {
            InvitedUser client = context.InvitedUsers.Single(x => x.InvitedUserId == id);
            context.InvitedUsers.Remove(client);
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