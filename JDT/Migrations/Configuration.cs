namespace JDT.Migrations
{
    using JDT.App_Code;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using System.Web.Security;
    using WebMatrix.WebData;

    internal sealed class Configuration : DbMigrationsConfiguration<JDT.Models.JDTContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(JDT.Models.JDTContext context)
        {
            //WebSecurity.InitializeDatabaseConnection(
            //    "JDT",
            //    "UserProfiles",
            //    "Id",
            //    "Email", autoCreateTables: true);

            WebSecurityInitializer.Instance.EnsureInitialize();

            if (!Roles.RoleExists("Administrator"))
                Roles.CreateRole("Administrator");
            if (!Roles.RoleExists("ContentCreator"))
                Roles.CreateRole("ContentCreator");
            if (!Roles.RoleExists("ViewOnly"))
                Roles.CreateRole("ViewOnly");

            if (!WebSecurity.UserExists("adminUser@adminUser.com"))
                WebSecurity.CreateUserAndAccount(
                    "adminUser@adminUser.com",
                    "password", new { UserName = "adminUser", FirstName = "Johnny", LastName = "Knoxville" });

            if (!Roles.GetRolesForUser("adminUser@adminUser.com").Contains("Administrator"))
                Roles.AddUsersToRoles(new[] { "adminUser@adminUser.com" }, new[] { "Administrator" });
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //
        }
    }
}
