using JDT.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Web;
using System.Web.Security;
using WebMatrix.WebData;

namespace JDT.Migrations
{
    public static class Seed 
    {
        public static void AddUserAndRole(JDTContext context)
        {

            WebSecurity.InitializeDatabaseConnection(
                "JDT",
                "UserProfile",
                "Id",
                "Email", autoCreateTables: true);

            if (!Roles.RoleExists("Administrator"))
                Roles.CreateRole("Administrator");

            if (!WebSecurity.UserExists("adminUser"))
                WebSecurity.CreateUserAndAccount(
                    "adminUser@adminUser.com",
                    "password", new { UserName = "adminUser", FirstName = "Johnny", LastName = "Knoxville" });

            if (!Roles.GetRolesForUser("adminUser").Contains("Administrator"))
                Roles.AddUsersToRoles(new[] { "adminUser" }, new[] { "Administrator" });

        }
    }
}