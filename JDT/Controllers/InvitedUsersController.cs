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

       
        protected override void Dispose(bool disposing)
        {
            if (disposing) {
                context.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}